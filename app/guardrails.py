"""Responsible-answer guardrails: confidence + human escalation.

Counters the "trust paradox" of gov-branded chatbots: rather than guess on a high-stakes or
unsupported question, Tributo escalates to a human adviser. Every answer carries a confidence
label that lands in the audit trail.
"""

from __future__ import annotations

from dataclasses import dataclass

from .retrieval import RetrievedSource

# Topics where automated guidance is inappropriate or actively harmful to attempt.
ESCALATION_TERMS = (
    "hide income", "hide cash", "hide some", "cash in hand", "under the table", "off the books",
    "don't declare", "do not declare", "not declare", "evade", "evasion", "avoid paying",
    "offshore", "launder", "money laundering", "should i lie", "fake", "investigation",
    "tribunal", "penalty appeal", "bankrupt", "bankruptcy", "fraud",
)


@dataclass
class Guardrails:
    escalated: bool
    confidence: str  # grounded | limited | needs-human
    reasons: list[str]

    def to_dict(self) -> dict:
        return {"escalated": self.escalated, "confidence": self.confidence, "reasons": self.reasons}


def evaluate(query: str, sources: list[RetrievedSource]) -> Guardrails:
    lower = query.lower()
    reasons: list[str] = []

    for term in ESCALATION_TERMS:
        if term in lower:
            reasons.append(f'High-stakes or unsafe topic detected ("{term}").')

    if not sources:
        reasons.append("No supporting GOV.UK / HMRC source was retrieved.")

    if len(query) > 1200:
        reasons.append("The question is long and may mix several separate issues.")

    if reasons:
        return Guardrails(escalated=True, confidence="needs-human", reasons=reasons)

    top_matched = sources[0].matched_terms if sources else 0
    if top_matched >= 2:
        return Guardrails(False, "grounded", ["Answer is grounded in retrieved HMRC / GOV.UK guidance."])
    return Guardrails(False, "limited", ["Relevant sources found, but the match is narrow — treat as a pointer."])
