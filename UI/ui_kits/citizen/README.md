# Citizen app, UI kit (the hero)

A voice-first tax advisory **session**, not a form. The animated advisor is centre stage; a tabbed side panel exposes the cited Document, the Privacy ledger, the Accountability record, and Federated learning. A persistent, dated, sourced action plan with a deadline timeline.

- `index.html`, fully interactive recreation. Submit a question (or tap a quick-start chip) and the advisor + UI choreograph to the simulated `POST /api/ask` SSE sequence: `redaction → plan → retrieval×N → meta → actions → token(streamed) → done`. Mic button has idle/listening states; reduced-motion respected; captions/transcript always present.

Composes the system's components (AdvisorAvatar, CitationChip, ConfidenceMeter, RedactionChip, ReasoningTrace, Button, Badge, Tag) on the shared tokens. Inlined here so the screen renders standalone; the canonical implementations live in `components/`.

Data shapes mirror the real `/api/*` contract (SSE events, `/api/sources`, `/api/plan`, `/api/transparency`, `/api/model-card`).
