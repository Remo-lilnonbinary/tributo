# Tributo.plain

---
description: "Voice-first, privacy-preserving, auditable UK tax guidance for citizens"
source_of_truth: "README.md"
style: "structured plain-language specification"
---

***overview***

- :App: is named Tributo.
- :App: is a voice-first AI tax advisor for UK citizens.
- :App: is built for the FLock hackathon's Public Sector and Citizen Services theme.
- :App: should help citizens understand UK tax obligations in plain English.
- :App: should protect citizen privacy before inference.
- :App: should make every answer accountable through citations, audit records, and human escalation.
- :App: should run end to end without an API key by using a clearly labelled local fallback answer.

***definitions***

- :Citizen: is a UK user asking for tax guidance.
- :Question: is a plain-English tax question submitted by :Citizen: through text or voice.
- :RawQuestion: is :Question: before redaction.
- :RedactedQuestion: is :Question: after personal data has been removed.
- :Answer: is the spoken and displayed tax guidance returned to :Citizen:.
- :Source: is a GOV.UK or HMRC guidance document in the local corpus.
- :Citation: is a reference from :Answer: to the exact :Source: used.
- :FactStore: is the curated structured tax-facts table used for exact figures and dates.
- :ReasoningTrace: is the auditable record of planning, retrieval, grading, consolidation, guardrails, and composition.
- :ActionPlan: is an ordered, dated, source-cited list of next steps for :Citizen:.
- :AuditEntry: is the exportable record of one interaction.
- :InstitutionConsole: is the government/operator surface at `/gov.html`.
- :CitizenApp: is the citizen-facing surface at `/`.
- :FLockInference: is FLock API Platform using `qwen3-30b-a3b-instruct-2507`.
- :FederatedRound: is a real FedAvg run over siloed per-institution data.
- :ATRSRecord: is the UK Algorithmic Transparency Recording Standard record served by the API.
- :ModelCard: is the Mitchell-style model card served by the API.
- :VoiceWorker: is the optional LiveKit Agents worker using Deepgram STT and ElevenLabs TTS.

***implementation reqs***

- :App: should be implemented as a Python 3.11+ FastAPI backend.
- :App: should use `uv` for dependency management and execution.
- :App: should expose both :CitizenApp: and :InstitutionConsole: as reference front ends in `web/`.
- :App: should treat the production Lovable front end as a future consumer of the same API contract.
- :App: should load configuration from environment variables or `.env`.
- :App: should support `FLOCK_API_KEY` as optional.
- :App: should call :FLockInference: through an OpenAI-compatible API when `FLOCK_API_KEY` is set.
- :App: should use the `x-litellm-api-key` header for FLock requests.
- :App: should return a clearly labelled local fallback answer when `FLOCK_API_KEY` is absent.
- :App: should support BM25 retrieval by default.
- :App: may support sentence-transformers retrieval when the embeddings extra is installed.
- :App: should redact UK personal data with a regex redactor by default.
- :App: may use Microsoft Presidio when the Presidio extra is installed.
- :App: should never retain :RawQuestion:.
- :App: should store only :RedactedQuestion:, redaction metadata, outbound payload, sources, confidence, model info, and :ReasoningTrace: in the audit log.
- :VoiceWorker: should be optional and run separately from the API.
- :VoiceWorker: should use LiveKit, Deepgram, ElevenLabs, and the FLock LLM step when voice credentials are configured.
- :VoiceWorker: should publish UI highlight events over the LiveKit data channel with topic `ui-highlight`.
- :FederatedRound: should run quickly enough for a live demo.
- :FederatedRound: should use non-IID synthetic institution datasets.
- :FederatedRound: should share only model weights, never raw rows.
- :FederatedRound: should return genuine before/after accuracy metrics and provenance.
- :App: should document that the live FedAvg path is implemented locally with numpy and scikit-learn.
- :App: should document that the heavier FLocKit LoRA artifact is an offline credibility artifact, not the live demo path.

***functional specs***

- :Citizen: should be able to open :CitizenApp: at `/`.
- :Citizen: should be able to ask :Question: by text.
- :Citizen: should be able to use voice when :VoiceWorker: is configured.
- :CitizenApp: should show :Answer: in plain English.
- :CitizenApp: should show :ReasoningTrace: as the system works.
- :CitizenApp: should show the cited :Source: document.
- :CitizenApp: should highlight the passage or document used by :Answer:.
- :CitizenApp: should show an :ActionPlan: with ordered next steps and relevant deadlines.
- :CitizenApp: should persist :ActionPlan: per citizen so steps can be ticked off over time.
- :CitizenApp: should show what data was redacted before inference.
- :App: should decompose :RedactedQuestion: into sub-questions.
- :App: should use FLock for planning when configured.
- :App: should use a deterministic planner when FLock is not configured.
- :App: should retrieve sources per sub-question.
- :App: should use :FactStore: for exact tax figures and dates.
- :App: should run one broader retrieval hop when a sub-question is uncovered and budget remains.
- :App: should grade source coverage deterministically.
- :App: should consolidate and re-cite the union of sources as S1 through Sn.
- :App: should compose :Answer: from grounded sources and exact facts.
- :App: should escalate unsupported, high-stakes, or tax-avoidance questions to a human.
- :App: should never fabricate an answer when supporting sources are missing.
- :InstitutionConsole: should be available at `/gov.html`.
- :InstitutionConsole: should show overview metrics.
- :InstitutionConsole: should let an operator run :FederatedRound: and inspect before/after results.
- :InstitutionConsole: should show "0 raw rows shared" provenance for every federated node.
- :InstitutionConsole: should show the audit trail.
- :InstitutionConsole: should show :ATRSRecord: and :ModelCard:.
- :InstitutionConsole: should show the human escalation queue.
- :InstitutionConsole: should show read-only deployment settings.
- :App: should not claim to provide binding tax determinations.
- :App: should not claim HMRC filing or submission.
- :App: should not claim the hosted FLock API keeps data in a specific region.
- :App: should not claim on-chain or staked federated learning.
- :App: should not claim the tax-facts table is a knowledge graph.

***api reqs***

- `GET /api/health` should return service health, FLock configuration status, model, redactor, retriever, voice configuration status, and corpus size.
- `POST /api/ask` should stream an agentic answer as Server-Sent Events.
- `POST /api/ask` should accept body `{question, citizen}`.
- `POST /api/ask` should emit events in this order: `redaction`, `plan`, `retrieval`, `meta`, `actions`, `token`, `done`.
- `redaction` should describe what personal data was removed.
- `plan` should include sub-questions and the planner used.
- `retrieval` should be emitted per sub-question and include coverage, covered status, hops, sources, and facts.
- `meta` should include consolidated sources, guardrails, exact outbound payload, and facts.
- `actions` should include the new action plan and the persisted plan.
- `token` should stream the answer text.
- `done` should include the final answer and :AuditEntry:, including :ReasoningTrace:.
- `POST /api/chat` should return the non-streaming answer, citations, sub-questions, trace, actions, plan, redaction, confidence, escalation decision, and audit entry.
- `GET /api/source/{id}` should return a full corpus document for the document panel.
- `GET /api/sources` should list the corpus documents.
- `GET /api/plan?citizen=` should return the citizen's persisted action plan.
- `POST /api/plan/toggle` should accept `{citizen, id}` and toggle a plan step.
- `POST /api/federated/run` should run :FederatedRound: and return nodes, before accuracy, after accuracy, provenance, and timeline.
- `GET /api/transparency` should return :ATRSRecord:.
- `GET /api/model-card` should return :ModelCard:.
- `GET /api/audit` should return the exportable session audit log.
- `GET /api/metrics` should return totals, escalation rate, grounded rate, and PII items removed.
- `GET /api/escalations` should return the human escalation queue.
- `GET /api/settings` should return read-only deployment configuration.
- `POST /api/voice/token` should mint a LiveKit room JWT when voice is configured.
- `POST /api/voice/token` should return 503 when voice is not configured.

***configuration reqs***

- `FLOCK_API_KEY` should default to empty and enable live FLock inference when set.
- `FLOCK_BASE_URL` should default to `https://api.flock.io/v1`.
- `FLOCK_MODEL` should default to `qwen3-30b-a3b-instruct-2507`.
- `REDACTOR` should support `auto`, `presidio`, and `regex`.
- `RETRIEVER` should support `bm25` and `embeddings`.
- `LIVEKIT_URL`, `LIVEKIT_API_KEY`, and `LIVEKIT_API_SECRET` should enable LiveKit voice.
- `DEEPGRAM_API_KEY` should enable Deepgram speech to text.
- `ELEVEN_API_KEY` should enable ElevenLabs text to speech.
- `VOICE_ID` should configure the ElevenLabs voice.

***test reqs***

- :App: should start with `uv sync` and `uv run uvicorn app.main:app --reload`.
- :App: should pass `uv run pytest -q`.
- :App: should pass `uv run ruff check app tests`.
- `GET /api/health` should return 200 in fallback mode.
- `POST /api/ask` with a fake National Insurance number should stream a redaction event that excludes the raw identifier.
- `POST /api/ask` should include the exact :RedactedQuestion: in the outbound payload metadata.
- `POST /api/ask` should finish with at least one source citation for supported tax questions.
- `POST /api/ask` should create an audit entry that includes model info, sources, confidence, redactions, outbound payload, and :ReasoningTrace:.
- Unsupported questions should signpost human help instead of guessing.
- High-stakes or avoidance questions should trigger escalation.
- `POST /api/federated/run` should report zero raw rows shared for every node.
- `POST /api/federated/run` should report after accuracy greater than before accuracy.
- `GET /api/transparency` should return populated ATRS-shaped JSON.
- `GET /api/model-card` should return populated model-card JSON.
- :CitizenApp: should exercise ask, citation, source display, redaction display, audit, action plan, and federated demo flows without an API key.
- :InstitutionConsole: should show overview metrics, federated results, oversight artifacts, escalations, and read-only settings.

***demo reqs***

- Demo should open with the problem: tax guidance is hard, advice is expensive, and tax questions reveal sensitive personal data.
- Demo should show one citizen asking a plain-English tax question.
- Demo should show redaction before inference.
- Demo should show the reasoning trace.
- Demo should show a GOV.UK or HMRC source and the cited passage.
- Demo should show an action plan with deadlines.
- Demo should trigger one human escalation.
- Demo should switch to :InstitutionConsole: and run :FederatedRound:.
- Demo should show before/after accuracy and zero raw rows shared.
- Demo should show audit, ATRS, model card, and headline oversight metrics.

***out of scope***

- :App: should not file or submit tax returns to HMRC.
- :App: should not process real personal data in the hackathon demo.
- :App: should use synthetic personas and synthetic institution data for the demo.
- :App: should not provide binding tax determinations.
- :App: should not include production multi-institution deployment in the hackathon scope.
- :App: should not include on-chain or staked federated learning in the hackathon scope.
- :App: should not include the production Lovable UI in the current backend build.
