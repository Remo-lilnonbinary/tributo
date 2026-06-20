"""Append-only audit trail. One entry per answered question, exportable as JSON.

Stores only the *redacted* question, never the raw input, so the log itself is privacy-safe.
This is the public-accountability spine: provenance for every answer the system gave.
"""

from __future__ import annotations

import time
import uuid
from dataclasses import asdict, dataclass, field


def now_iso() -> str:
    return time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())


def new_id() -> str:
    return "audit-" + uuid.uuid4().hex[:8]


@dataclass
class AuditEntry:
    id: str
    timestamp: str
    question_redacted: str
    provider: str
    model: str
    confidence: str
    escalated: bool
    redactions: list[dict] = field(default_factory=list)
    sources: list[dict] = field(default_factory=list)
    outbound_payload: dict = field(default_factory=dict)
    trace: dict = field(default_factory=dict)
    error: str | None = None

    def to_dict(self) -> dict:
        return asdict(self)


class AuditLog:
    def __init__(self) -> None:
        self._entries: list[AuditEntry] = []

    def add(self, entry: AuditEntry) -> AuditEntry:
        self._entries.append(entry)
        return entry

    def all(self) -> list[AuditEntry]:
        return list(reversed(self._entries))  # newest first

    def to_dicts(self) -> list[dict]:
        return [e.to_dict() for e in self.all()]

    def count(self) -> int:
        return len(self._entries)

    def escalations(self) -> list[dict]:
        return [e.to_dict() for e in self.all() if e.escalated]

    def metrics(self) -> dict:
        from collections import Counter

        es = self._entries
        total = len(es)
        escalated = sum(1 for e in es if e.escalated)
        conf = Counter(e.confidence for e in es)
        prov = Counter(e.provider for e in es)
        redactions = sum(sum(r.get("count", 0) for r in e.redactions) for e in es)
        return {
            "total_questions": total,
            "escalated": escalated,
            "escalation_rate": round(escalated / total, 3) if total else 0.0,
            "grounded_rate": round(conf.get("grounded", 0) / total, 3) if total else 0.0,
            "confidence": dict(conf),
            "providers": dict(prov),
            "redactions_removed": redactions,
        }

audit_log = AuditLog()
