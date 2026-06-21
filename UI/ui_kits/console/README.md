# Institution console, UI kit

The operator dashboard. Citizens never see this. Tone is precise and operational, sharper radii, cool slate tints, denser type. Five tabs:

- **Overview**, headline accountability metrics a regulator watches (questions answered, escalation rate, grounded rate, PII items redacted) + recent activity.
- **Federated**, run a real FedAvg round across nodes; before vs after accuracy; the "zero raw rows left the building" proof; a round timeline.
- **Oversight**, the append-only audit trail (time · confidence · provider · sources · redacted question), the ATRS transparency record, and the model-card viewer.
- **Escalations**, queue of questions the AI handed to a human, each with full redacted context + reasoning trace.
- **Settings**, read-only deployment config (model, redaction policy, retrieval backend, escalation thresholds, corpus).

`index.html` is an interactive recreation on the shared tokens, mirroring `/api/metrics`, `/api/federated`, `/api/audit`, `/api/transparency`, `/api/model-card`, `/api/escalations`, `/api/settings`.
