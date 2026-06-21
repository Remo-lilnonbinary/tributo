"""Tributo backend API. Run: uv run uvicorn app.main:app --reload

Serves the citizen Q&A pipeline (redact -> retrieve -> FLock -> cite -> audit), a real
federated round, the accountability artifacts, and a LiveKit voice token. The mock UI in web/
is served at /. The Lovable frontend consumes these same endpoints (see SPEC.md).
"""

from __future__ import annotations

import json
import os

import httpx
from fastapi import FastAPI, HTTPException, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sse_starlette.sse import EventSourceResponse

from .accountability import model_card, transparency_record
from .actions import build_actions
from .agentic import run_agentic
from .audit import AuditEntry, audit_log, new_id, now_iso
from .config import get_settings
from .corpus.sources import all_sources, get_source
from .federated import run_federated_round
from .flock import build_messages, build_outbound_payload, stream_answer
from .guardrails import evaluate
from .plans import plan_store
from .redaction import redact
from .retrieval import get_retriever
from .schemas import AskRequest, PlanToggleRequest, VoiceSpeakRequest, VoiceTokenRequest
from .voice.token import VoiceUnavailable, create_token

app = FastAPI(title="Tributo", version="0.1.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=get_settings().cors_origin_list,  # set CORS_ORIGINS to the Lovable origin in prod
    allow_methods=["GET", "POST"],
    allow_headers=["content-type"],
)


def _compose(redacted_text: str, plan):
    """Guardrails + the FLock compose request for a redacted question and its agentic plan."""
    guards = evaluate(redacted_text, plan.sources)
    messages = build_messages(
        redacted_text, plan.sources, guards,
        facts=plan.facts, sub_questions=plan.sub_questions, uncovered=plan.uncovered,
    )
    return guards, messages, build_outbound_payload(messages)


async def _agentic_prepare(question: str):
    """Redact -> agentic plan/retrieve -> guardrails -> build the FLock compose request."""
    redaction = redact(question)
    plan = await run_agentic(redaction.redacted_text)
    guards, messages, outbound = _compose(redaction.redacted_text, plan)
    return redaction, plan, guards, messages, outbound


def _audit(redaction, plan, guards, provider, model, outbound, error) -> AuditEntry:
    return audit_log.add(AuditEntry(
        id=new_id(),
        timestamp=now_iso(),
        question_redacted=redaction.redacted_text,
        provider=provider,
        model=model,
        confidence=guards.confidence,
        escalated=guards.escalated,
        redactions=[f.to_dict() for f in redaction.findings],
        sources=[s.to_dict() for s in plan.sources],
        outbound_payload=outbound,
        trace=plan.trace_dict(),
        error=error,
    ))


@app.get("/api/health")
def health() -> dict:
    s = get_settings()
    return {
        "ok": True,
        "flock_configured": s.flock_configured,
        "model": s.flock_model,
        "redactor": s.redactor,
        "retriever": get_retriever().backend,
        "voice_configured": s.voice_configured,
        "eleven_configured": s.eleven_configured,
        "corpus_size": len(all_sources()),
        "audit_entries": audit_log.count(),
    }


@app.post("/api/ask")
async def ask(req: AskRequest):
    """Stream the agentic answer as SSE: redaction -> plan -> retrieval* -> meta -> token* -> done."""

    async def event_gen():
        redaction = redact(req.question)
        yield {"event": "redaction", "data": json.dumps(redaction.to_dict())}

        plan = await run_agentic(redaction.redacted_text)
        yield {"event": "plan", "data": json.dumps(
            {"sub_questions": plan.sub_questions, "planner": plan.planner})}
        for step in plan.steps:
            yield {"event": "retrieval", "data": json.dumps({
                "sub_question": step.sub_question,
                "coverage": step.coverage,
                "covered": step.covered,
                "hops": step.hops,
                "sources": [s.to_dict() for s in step.sources],
                "facts": [f.to_dict() for f in step.facts],
            })}

        guards, messages, outbound = _compose(redaction.redacted_text, plan)
        yield {"event": "meta", "data": json.dumps({
            "redaction": redaction.to_dict(),
            "sources": [s.to_dict() for s in plan.sources],
            "guardrails": guards.to_dict(),
            "outbound_payload": outbound,
            "facts": [f.to_dict() for f in plan.facts],
        })}

        actions = build_actions(plan.facts, plan.sources, guards)
        plan_items = plan_store.merge(req.citizen, actions)
        yield {"event": "actions", "data": json.dumps(
            {"actions": [a.to_dict() for a in actions], "plan": plan_items})}

        answer, provider, model, error = "", "local-demo", get_settings().flock_model, None
        async for ev in stream_answer(messages, plan.sources, guards):
            if ev["type"] == "token":
                yield {"event": "token", "data": json.dumps({"token": ev["token"]})}
            else:
                answer, provider, model, error = ev["answer"], ev["provider"], ev["model"], ev["error"]

        entry = _audit(redaction, plan, guards, provider, model, outbound, error)
        yield {"event": "done", "data": json.dumps({
            "answer": answer, "audit": entry.to_dict(),
            "actions": [a.to_dict() for a in actions], "plan": plan_items,
        })}

    return EventSourceResponse(event_gen())


@app.post("/api/chat")
async def chat(req: AskRequest) -> dict:
    """Non-streaming variant: one JSON response (handy for the Lovable fallback path)."""
    redaction, plan, guards, messages, outbound = await _agentic_prepare(req.question)
    answer, provider, model, error = "", "local-demo", get_settings().flock_model, None
    async for ev in stream_answer(messages, plan.sources, guards):
        if ev["type"] == "done":
            answer, provider, model, error = ev["answer"], ev["provider"], ev["model"], ev["error"]
    entry = _audit(redaction, plan, guards, provider, model, outbound, error)
    actions = build_actions(plan.facts, plan.sources, guards)
    plan_items = plan_store.merge(req.citizen, actions)
    return {
        "answer": answer,
        "citations": [{"citation": s.citation, "title": s.source.title, "url": s.source.url} for s in plan.sources],
        "redaction": redaction.to_dict(),
        "sub_questions": plan.sub_questions,
        "confidence": guards.confidence,
        "escalate": guards.escalated,
        "trace": plan.trace_dict(),
        "actions": [a.to_dict() for a in actions],
        "plan": plan_items,
        "audit": entry.to_dict(),
    }


@app.get("/api/sources")
def list_sources() -> dict:
    return {"sources": [
        {"id": s.id, "title": s.title, "url": s.url, "publisher": s.publisher, "updated": s.updated}
        for s in all_sources()
    ]}


@app.get("/api/source/{source_id}")
def read_source(source_id: str) -> dict:
    s = get_source(source_id)
    if not s:
        raise HTTPException(404, f"No source with id {source_id!r}")
    return {
        "id": s.id, "title": s.title, "url": s.url, "publisher": s.publisher,
        "updated": s.updated, "body": s.body,
    }


@app.post("/api/federated/run")
def federated_run(num_rounds: int = 3) -> dict:
    return run_federated_round(num_rounds=num_rounds)


@app.get("/api/transparency")
def transparency() -> dict:
    return transparency_record()


@app.get("/api/model-card")
def model_card_endpoint() -> dict:
    return model_card()


@app.get("/api/audit")
def audit() -> dict:
    return {"entries": audit_log.to_dicts(), "count": audit_log.count()}


@app.post("/api/voice/token")
def voice_token(req: VoiceTokenRequest) -> dict:
    try:
        return create_token(req.room, req.identity)
    except VoiceUnavailable as exc:
        raise HTTPException(503, str(exc))


@app.post("/api/voice/speak")
async def voice_speak(req: VoiceSpeakRequest) -> Response:
    """Synthesize advisor speech with ElevenLabs without exposing the API key to the browser."""
    s = get_settings()
    if not s.eleven_configured:
        raise HTTPException(503, "ElevenLabs is not configured. Set ELEVEN_API_KEY and VOICE_ID.")

    url = f"https://api.elevenlabs.io/v1/text-to-speech/{s.voice_id}"
    payload = {
        "text": req.text,
        "model_id": s.eleven_model,
        "voice_settings": {"stability": 0.45, "similarity_boost": 0.8},
    }
    headers = {
        "accept": "audio/mpeg",
        "content-type": "application/json",
        "xi-api-key": s.eleven_api_key or "",
    }
    try:
        async with httpx.AsyncClient(timeout=60.0) as client:
            resp = await client.post(url, headers=headers, json=payload)
            resp.raise_for_status()
    except httpx.HTTPStatusError as exc:
        detail = exc.response.text[:240]
        raise HTTPException(exc.response.status_code, f"ElevenLabs TTS failed: {detail}") from exc
    except httpx.HTTPError as exc:
        raise HTTPException(502, "ElevenLabs TTS request failed.") from exc

    return Response(content=resp.content, media_type="audio/mpeg")


# --- citizen action plan ---
@app.get("/api/plan")
def get_plan(citizen: str = "citizen") -> dict:
    return {"citizen": citizen, "plan": plan_store.get(citizen)}


@app.post("/api/plan/toggle")
def toggle_plan(req: PlanToggleRequest) -> dict:
    return {"citizen": req.citizen, "plan": plan_store.toggle(req.citizen, req.id)}


# --- institution dashboard ---
@app.get("/api/metrics")
def metrics() -> dict:
    return audit_log.metrics()


@app.get("/api/escalations")
def escalations() -> dict:
    return {"escalations": audit_log.escalations()}


@app.get("/api/settings")
def settings_view() -> dict:
    s = get_settings()
    return {
        "model": s.flock_model,
        "flock_configured": s.flock_configured,
        "redactor": s.redactor,
        "retriever": get_retriever().backend,
        "retrieval_top_k": s.retrieval_top_k,
        "voice_configured": s.voice_configured,
        "eleven_configured": s.eleven_configured,
        "corpus_size": len(all_sources()),
    }


# Mock UI last, so it never shadows the API routes above.
_WEB_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "web")
if os.path.isdir(_WEB_DIR):
    app.mount("/", StaticFiles(directory=_WEB_DIR, html=True), name="web")
