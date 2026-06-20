"""A small structured 'tax facts' store — the graph-lite that grounds exact figures.

Numbers, dates and thresholds the model must NOT improvise. The agentic retriever matches
relevant facts to each sub-question and injects them as authoritative values, so the £12,570 /
31 January / £1,000 in an answer come from this table, not the model's memory. Each fact points
back to the GOV.UK source it came from, so it stays auditable.
"""

from __future__ import annotations

from dataclasses import dataclass

from ..tokenization import tokenize


@dataclass(frozen=True)
class TaxFact:
    id: str
    label: str
    value: str
    source_id: str
    keywords: tuple[str, ...]

    def to_dict(self) -> dict:
        return {"id": self.id, "label": self.label, "value": self.value, "source_id": self.source_id}


FACTS: list[TaxFact] = [
    TaxFact("personal_allowance", "Personal Allowance (2025/26)", "£12,570", "income-tax-rates",
            ("personal", "allowance", "tax-free", "12570", "income", "earn", "before")),
    TaxFact("basic_rate", "Basic rate of Income Tax", "20% on taxable income £12,571–£50,270", "income-tax-rates",
            ("basic", "rate", "20", "band", "income", "tax", "threshold")),
    TaxFact("higher_rate", "Higher rate of Income Tax", "40% on £50,271–£125,140", "income-tax-rates",
            ("higher", "rate", "40", "threshold", "band", "income", "tax")),
    TaxFact("additional_rate", "Additional rate of Income Tax", "45% above £125,140", "income-tax-rates",
            ("additional", "rate", "45", "income", "tax", "high")),
    TaxFact("register_deadline", "Self Assessment registration deadline", "5 October after the tax year ends",
            "register-self-assessment", ("register", "registration", "october", "deadline", "first", "freelancing", "started")),
    TaxFact("online_deadline", "Online filing + payment deadline", "31 January (midnight)", "self-assessment-deadlines",
            ("online", "file", "filing", "deadline", "january", "31", "return", "due")),
    TaxFact("paper_deadline", "Paper return deadline", "31 October (midnight)", "self-assessment-deadlines",
            ("paper", "return", "october", "deadline", "31")),
    TaxFact("payment_deadline", "Payment deadlines", "31 January balancing payment; 31 July second payment on account",
            "pay-self-assessment", ("pay", "payment", "account", "january", "july", "31", "bill", "owe", "when")),
    TaxFact("trading_allowance", "Trading allowance", "£1,000 of trading income tax-free", "trading-allowance",
            ("trading", "allowance", "1000", "side", "income", "tax-free", "gig", "small")),
    TaxFact("self_assessment_income_threshold", "Self Assessment self-employed income threshold",
            "More than £1,000 before tax relief", "who-must-send-tax-return",
            ("self-employed", "sole", "trader", "earned", "income", "1000", "threshold", "need", "return")),
    TaxFact("time_to_pay", "Time to Pay (self-serve threshold)", "Set up online if you owe £30,000 or less",
            "difficulties-paying", ("time", "pay", "instalments", "30000", "afford", "cannot", "struggling", "arrangement")),
    TaxFact("late_penalty", "Late filing penalty", "£100 if up to 3 months late", "penalties",
            ("penalty", "late", "100", "fine", "missed", "filing")),
    TaxFact("payments_on_account_due_dates", "Payments on account due dates",
            "31 January and 31 July", "payments-on-account",
            ("payments", "account", "advance", "instalments", "january", "july", "31", "due")),
    TaxFact("payments_on_account_exemption", "Payments on account exemptions",
            "Usually not required if last bill was under £1,000 or over 80% was paid at source",
            "payments-on-account", ("payments", "account", "exemption", "under", "1000", "80", "source")),
    TaxFact("class_2_voluntary_rate", "Class 2 voluntary National Insurance rate (2025/26)",
            "£3.50 per week below the Small Profits Threshold", "ni-rates-allowances",
            ("national", "insurance", "class", "2", "voluntary", "350", "week", "small", "profits")),
    TaxFact("class_2_small_profits_threshold", "Class 2 Small Profits Threshold (2025/26)",
            "£6,845", "ni-rates-allowances",
            ("national", "insurance", "class", "2", "small", "profits", "threshold", "6845")),
    TaxFact("class_4_rates", "Class 4 National Insurance rates (2025/26)",
            "6% on profits £12,570 to £50,270; 2% above £50,270", "ni-rates-allowances",
            ("national", "insurance", "class", "4", "profits", "self-employed", "ni", "6", "2", "12570", "50270")),
    TaxFact("scottish_starter_rate", "Scottish starter rate (2025/26)",
            "19% on £12,571 to £15,397", "scottish-income-tax",
            ("scotland", "scottish", "starter", "rate", "19", "income", "tax")),
    TaxFact("scottish_basic_rate", "Scottish basic rate (2025/26)",
            "20% on £15,398 to £27,491", "scottish-income-tax",
            ("scotland", "scottish", "basic", "rate", "20", "income", "tax")),
    TaxFact("scottish_intermediate_rate", "Scottish intermediate rate (2025/26)",
            "21% on £27,492 to £43,662", "scottish-income-tax",
            ("scotland", "scottish", "intermediate", "rate", "21", "income", "tax")),
    TaxFact("scottish_higher_rate", "Scottish higher rate (2025/26)",
            "42% on £43,663 to £75,000", "scottish-income-tax",
            ("scotland", "scottish", "higher", "rate", "42", "income", "tax")),
    TaxFact("scottish_advanced_rate", "Scottish advanced rate (2025/26)",
            "45% on £75,001 to £125,140", "scottish-income-tax",
            ("scotland", "scottish", "advanced", "rate", "45", "income", "tax")),
    TaxFact("scottish_top_rate", "Scottish top rate (2025/26)",
            "48% above £125,140", "scottish-income-tax",
            ("scotland", "scottish", "top", "rate", "48", "income", "tax")),
    TaxFact("nino_format", "National Insurance number format", "Two letters, six numbers, a final letter (e.g. QQ 12 34 56 C)",
            "ni-number", ("national", "insurance", "number", "format", "nino", "letters")),
]


def match_facts(query: str, limit: int = 4) -> list[TaxFact]:
    q = set(tokenize(query, drop_stopwords=False))
    scored = [(f, len(q & set(f.keywords))) for f in FACTS]
    scored = [(f, n) for f, n in scored if n > 0]
    scored.sort(key=lambda x: x[1], reverse=True)
    return [f for f, _ in scored[:limit]]
