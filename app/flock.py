"""FLock API Platform inference client (OpenAI-compatible, streaming).

Routes the redacted, source-grounded prompt through https://api.flock.io/v1 using the
`x-litellm-api-key` header. With no key configured it serves a clearly-labelled local
fallback built from the retrieved sources, so the app still demos end-to-end.
"""

from __future__ import annotations

import asyncio
import json
import logging
from collections.abc import AsyncIterator

import httpx

from .config import get_settings
from .guardrails import Guardrails
from .retrieval import RetrievedSource

logger = logging.getLogger("tributo.flock")

SYSTEM_PROMPT = (
    "You are Tributo, a UK citizen tax-guidance assistant for the public. "
    "Answer only with cautious, plain-English guidance grounded in the supplied GOV.UK/HMRC "
    "sources. Cite every factual claim with bracketed citations like [S1], [S2] that match the "
    "sources you were given. Never invent figures, deadlines, or sources. If the sources do not "
    "support an answer, say so and point the person to GOV.UK, HMRC, or a human adviser. Do not "
    "give definitive legal or tax determinations, and never explain how to hide income or evade "
    "tax. When authoritative figures are provided, use those exact numbers and dates and never "
    "change them. Keep answers short and natural to read aloud."
)


def build_messages(
    redacted_question: str,
    sources: list[RetrievedSource],
    guardrails: Guardrails,
    facts: list | None = None,
    sub_questions: list[str] | None = None,
    uncovered: list[str] | None = None,
) -> list[dict]:
    if sources:
        source_block = "\n\n".join(
            f"[{s.citation}] {s.source.title} ({s.source.url})\n{s.source.body}" for s in sources
        )
    else:
        source_block = "No supporting GOV.UK/HMRC source was retrieved."

    parts = [f"Citizen question (personal details already redacted):\n{redacted_question}"]
    if sub_questions and len(sub_questions) > 1:
        parts.append("The citizen is really asking these sub-questions:\n- " + "\n- ".join(sub_questions))
    parts.append(f"Sources you may cite:\n{source_block}")
    if facts:
        facts_block = "\n".join(f"- {f.label}: {f.value} (source {f.source_id})" for f in facts)
        parts.append(
            "Authoritative figures — use these exact numbers and dates, do not change them:\n" + facts_block
        )
    if uncovered:
        parts.append(
            "No source was found for: " + "; ".join(uncovered)
            + ". Say you cannot confirm those and point the person to GOV.UK/HMRC or a human adviser."
        )
    parts.append(f"Guardrail status: {guardrails.confidence}.")

    user = "\n\n".join(parts)
    if guardrails.escalated:
        user += " This needs a human adviser — say so. Reason: " + "; ".join(guardrails.reasons)

    return [
        {"role": "system", "content": SYSTEM_PROMPT},
        {"role": "user", "content": user},
    ]


async def complete(messages: list[dict], max_tokens: int = 300, temperature: float = 0.0) -> str | None:
    """Non-streaming completion (used by the agentic planner). Returns None if no key or on error."""
    s = get_settings()
    if not s.flock_configured:
        return None
    url = s.flock_base_url.rstrip("/") + "/chat/completions"
    headers = {
        "content-type": "application/json",
        "accept": "application/json",
        "x-litellm-api-key": s.flock_api_key or "",
    }
    payload = {
        "model": s.flock_model, "stream": False, "temperature": temperature,
        "max_tokens": max_tokens, "messages": messages,
    }
    try:
        async with httpx.AsyncClient(timeout=s.flock_timeout) as client:
            resp = await client.post(url, headers=headers, json=payload)
            resp.raise_for_status()
            return resp.json()["choices"][0]["message"]["content"]
    except Exception:
        return None


def build_outbound_payload(messages: list[dict]) -> dict:
    s = get_settings()
    return {
        "model": s.flock_model,
        "stream": True,
        "temperature": s.flock_temperature,
        "messages": messages,
    }


def fallback_answer(sources: list[RetrievedSource], guardrails: Guardrails) -> str:
    if guardrails.escalated:
        lines = ["This looks like something a human adviser should help with before you act."]
        if guardrails.reasons:
            lines.append("Reason: " + " ".join(guardrails.reasons))
        if sources:
            lines.append(
                "A good starting point: "
                + ", ".join(f"[{s.citation}] {s.source.title}" for s in sources[:2])
                + "."
            )
        lines.append("You can contact HMRC, Citizens Advice, or a qualified tax adviser.")
        return "\n".join(lines)

    if not sources:
        return (
            "I could not find a GOV.UK or HMRC source that covers this, so I should not guess. "
            "Try rephrasing your question, or contact HMRC or Citizens Advice."
        )

    top = sources[0]
    parts = [f"Based on GOV.UK / HMRC guidance: {top.source.body} [{top.citation}]"]
    if len(sources) > 1:
        parts.append(f"Related guidance: {sources[1].source.body} [{sources[1].citation}]")
    parts.append(
        "This is general guidance, not a binding tax determination. Check the linked GOV.UK page "
        "before acting."
    )
    return "\n\n".join(parts)


async def _emit_slowly(text: str, size: int = 22, delay: float = 0.012) -> AsyncIterator[str]:
    buf = ""
    for word in text.split(" "):
        buf += word + " "
        if len(buf) >= size:
            yield buf
            buf = ""
            await asyncio.sleep(delay)
    if buf:
        yield buf


async def stream_answer(
    messages: list[dict], sources: list[RetrievedSource], guardrails: Guardrails
) -> AsyncIterator[dict]:
    """Yield {"type":"token","token":...} events, then a final {"type":"done",...} event."""
    s = get_settings()

    if not s.flock_configured:
        text = fallback_answer(sources, guardrails)
        async for tok in _emit_slowly(text):
            yield {"type": "token", "token": tok}
        yield {
            "type": "done", "provider": "local-demo",
            "model": f"{s.flock_model} (no FLOCK_API_KEY — local fallback)",
            "answer": text, "error": None,
        }
        return

    url = s.flock_base_url.rstrip("/") + "/chat/completions"
    headers = {
        "content-type": "application/json",
        "accept": "application/json",
        "x-litellm-api-key": s.flock_api_key or "",
    }
    payload = build_outbound_payload(messages)
    parts: list[str] = []

    try:
        async with httpx.AsyncClient(timeout=s.flock_timeout) as client:
            async with client.stream("POST", url, headers=headers, json=payload) as resp:
                if resp.status_code != 200:
                    body = (await resp.aread()).decode("utf-8", "ignore")
                    raise RuntimeError(f"FLock API {resp.status_code}: {body[:240]}")
                async for line in resp.aiter_lines():
                    line = line.strip()
                    if not line.startswith("data:"):
                        continue
                    data = line[len("data:"):].strip()
                    if data == "[DONE]":
                        break
                    try:
                        delta = json.loads(data)["choices"][0]["delta"].get("content")
                    except (json.JSONDecodeError, KeyError, IndexError):
                        continue
                    if delta:
                        parts.append(delta)
                        yield {"type": "token", "token": delta}
        yield {
            "type": "done", "provider": "flock", "model": s.flock_model,
            "answer": "".join(parts), "error": None,
        }
    except Exception as exc:  # network, auth, malformed stream — degrade gracefully
        logger.warning("FLock request failed: %s", exc)  # full detail stays server-side only
        text = fallback_answer(sources, guardrails)
        note = "\n\n(Note: the live FLock request failed, so this used the local fallback.)"
        async for tok in _emit_slowly(text):
            yield {"type": "token", "token": tok}
        yield {"type": "token", "token": note}
        yield {
            "type": "done", "provider": "local-demo",
            "model": f"{s.flock_model} (fallback after error)",
            "answer": text + note, "error": "FLock request failed",
        }
