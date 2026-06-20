"""Tributo voice advisor — a LiveKit Agents worker (separate process from the API).

Pipeline: Deepgram STT -> FLock LLM (qwen3-30b via the OpenAI-compatible API) -> ElevenLabs TTS,
with Silero VAD for turn-taking. The advisor is given two tools:

  - find_guidance(query):     redact + retrieve grounded GOV.UK/HMRC snippets to ground its answer
  - highlight_document(doc_id): push a UI event so the frontend highlights that document as it speaks

Run it (after `uv sync --extra voice` and filling LiveKit/Deepgram/ElevenLabs keys in .env):
    uv run python app/voice/agent.py dev

NOTE: FLock's streaming + OpenAI tool-calling through LiveKit is unverified — test on day one.
If tool-calling is unsupported, fall back to emitting highlight events from transcript keywords
(see the commented hook in entrypoint()).
"""

from __future__ import annotations

import json
import os


def _build_flock_llm(openai_plugin):
    key = os.environ.get("FLOCK_API_KEY")
    if not key:
        raise RuntimeError("FLOCK_API_KEY is required to run the voice agent.")
    model = os.environ.get("FLOCK_MODEL", "qwen3-30b-a3b-instruct-2507")
    base = os.environ.get("FLOCK_BASE_URL", "https://api.flock.io/v1")
    try:
        return openai_plugin.LLM(
            model=model, base_url=base, api_key="unused",
            extra_headers={"x-litellm-api-key": key},
        )
    except TypeError:
        # Older plugin without extra_headers: route via a custom client instead.
        import openai as oai

        client = oai.AsyncClient(base_url=base, api_key="unused",
                                 default_headers={"x-litellm-api-key": key})
        return openai_plugin.LLM(model=model, client=client)


INSTRUCTIONS = (
    "You are Tributo, a friendly UK tax advisor speaking with a citizen. Keep replies short and "
    "natural to hear aloud. Before answering any tax question, call find_guidance to fetch "
    "grounded GOV.UK/HMRC snippets, and base your answer only on what it returns, mentioning the "
    "source. When you reference a specific document, call highlight_document with its docId so the "
    "citizen sees it on screen. Never invent figures or deadlines. For high-stakes situations "
    "(hiding income, evasion, appeals, investigations) or anything the sources do not cover, say "
    "it needs a human adviser and offer to point them to HMRC or Citizens Advice."
)


def main() -> None:
    try:
        from livekit import agents
        from livekit.agents import (
            Agent,
            AgentSession,
            JobContext,
            RunContext,
            WorkerOptions,
            function_tool,
        )
        from livekit.plugins import deepgram, elevenlabs, openai, silero
    except Exception as exc:  # missing voice extra
        print("Tributo voice worker needs the voice extra:  uv sync --extra voice")
        print(f"Import error: {exc}")
        raise SystemExit(1)

    from ..config import get_settings
    from ..redaction import redact
    from ..retrieval import retrieve

    settings = get_settings()

    class Advisor(Agent):
        def __init__(self, publish) -> None:
            super().__init__(instructions=INSTRUCTIONS)
            self._publish = publish

        @function_tool
        async def find_guidance(self, context: RunContext, query: str) -> str:
            """Retrieve grounded GOV.UK/HMRC guidance snippets for the citizen's question."""
            redacted = redact(query).redacted_text
            sources = retrieve(redacted)
            if not sources:
                return "No supporting GOV.UK/HMRC source found. Tell the citizen to contact HMRC or Citizens Advice."
            await self._publish({"type": "cite", "sources": [s.source.id for s in sources]})
            return "\n\n".join(
                f"[{s.citation}] docId={s.source.id} — {s.source.title}: {s.source.body}" for s in sources
            )

        @function_tool
        async def highlight_document(self, context: RunContext, doc_id: str) -> str:
            """Highlight a document on the citizen's screen as you discuss it."""
            await self._publish({"type": "highlight_doc", "docId": doc_id})
            return "highlighted"

    async def entrypoint(ctx: JobContext) -> None:
        await ctx.connect()

        async def publish(payload: dict) -> None:
            await ctx.room.local_participant.publish_data(
                json.dumps(payload), reliable=True, topic="ui-highlight"
            )

        session = AgentSession(
            vad=silero.VAD.load(),
            stt=deepgram.STT(model="nova-3", language="en"),
            llm=_build_flock_llm(openai),
            tts=elevenlabs.TTS(voice_id=settings.voice_id, model="eleven_turbo_v2_5"),
        )
        await session.start(room=ctx.room, agent=Advisor(publish))
        await session.generate_reply(
            instructions="Greet the citizen warmly and ask what tax question you can help with."
        )

    agents.cli.run_app(WorkerOptions(entrypoint_fnc=entrypoint))


if __name__ == "__main__":
    main()
