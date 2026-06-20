"""Turn an agentic answer into an action plan: 'what to do next', grounded and dated.

Every answer should not just explain, it should move the citizen forward. This derives concrete,
ordered, source-cited next steps from the matched tax-facts and sources. Deterministic on purpose
(auditable, works with no key): each action points back at the GOV.UK source it came from.
"""

from __future__ import annotations

from dataclasses import dataclass, replace


@dataclass
class Action:
    id: str
    title: str
    detail: str
    deadline: str | None
    source_id: str | None
    citation: str | None = None

    def to_dict(self) -> dict:
        return {
            "id": self.id, "title": self.title, "detail": self.detail,
            "deadline": self.deadline, "source_id": self.source_id, "citation": self.citation,
        }


# fact id -> action
_FACT_ACTIONS: dict[str, Action] = {
    "register_deadline": Action("register", "Register for Self Assessment",
        "Tell HMRC you need to file so you get a Unique Taxpayer Reference (UTR).",
        "5 October 2026", "register-self-assessment"),
    "online_deadline": Action("file", "File your online tax return",
        "Complete and submit your Self Assessment online.", "31 January 2027", "self-assessment-deadlines"),
    "payment_deadline": Action("pay", "Pay your tax bill",
        "Pay what you owe, including any payment on account.", "31 January 2027", "pay-self-assessment"),
    "trading_allowance": Action("check_threshold", "Check if you need to file",
        "If you earned over £1,000 from trading, you likely need to register.", None, "trading-allowance"),
    "time_to_pay": Action("payment_plan", "Set up a payment plan if you need one",
        "If you cannot pay in full, arrange Time to Pay with HMRC.", None, "difficulties-paying"),
    "late_penalty": Action("avoid_penalty", "File on time to avoid a penalty",
        "A late return is usually a £100 penalty.", None, "penalties"),
    "ni_self_employed": Action("national_insurance", "Sort your National Insurance",
        "You'll pay Class 4 on profits; consider voluntary Class 2.", None, "ni-self-employed"),
    "personal_allowance": Action("estimate", "Estimate what you'll owe",
        "Your first £12,570 is tax-free; 20% applies above that.", None, "income-tax-rates"),
    "basic_rate": Action("estimate", "Estimate what you'll owe",
        "Your first £12,570 is tax-free; 20% applies above that.", None, "income-tax-rates"),
}

# source id -> action (used when a source matched but no specific fact did)
_SOURCE_ACTIONS: dict[str, Action] = {
    "expenses": Action("records", "Keep records of income and expenses",
        "Track everything so you can claim allowable expenses and work out your profit.", None, "expenses"),
    "sole-trader": Action("records", "Keep records of income and expenses",
        "Track everything so you can claim allowable expenses and work out your profit.", None, "sole-trader"),
    "extra-support": Action("get_support", "Get extra support if you need it",
        "HMRC offers help for health conditions, disability or personal circumstances.", None, "extra-support"),
}

_PRIORITY = [
    "human", "check_threshold", "register", "records", "national_insurance",
    "estimate", "file", "pay", "payment_plan", "avoid_penalty", "get_support",
]


def build_actions(facts, sources, guardrails, limit: int = 6) -> list[Action]:
    """Assemble an ordered, deduped, source-cited action plan from the agentic result."""
    actions: dict[str, Action] = {}

    if getattr(guardrails, "escalated", False):
        reason = "; ".join(getattr(guardrails, "reasons", [])) or "This needs a person."
        actions["human"] = Action("human", "Speak to a human adviser", reason, None, None)

    for f in facts:
        a = _FACT_ACTIONS.get(f.id)
        if a:
            actions.setdefault(a.id, replace(a))  # copy: templates are shared, we mutate citation below

    source_ids = {s.source.id for s in sources}
    for sid in source_ids:
        a = _SOURCE_ACTIONS.get(sid)
        if a:
            actions.setdefault(a.id, replace(a))

    # Attach the citation of the consolidated source this action points at.
    citation_by_source = {s.source.id: s.citation for s in sources}
    for a in actions.values():
        if a.source_id and a.source_id in citation_by_source:
            a.citation = citation_by_source[a.source_id]

    ordered = sorted(
        actions.values(),
        key=lambda a: _PRIORITY.index(a.id) if a.id in _PRIORITY else 99,
    )
    return ordered[:limit]
