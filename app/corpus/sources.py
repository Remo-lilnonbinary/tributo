"""The UK tax-guidance corpus Tributo grounds its answers in.

Hand-curated passages from real GOV.UK / HMRC pages. Each answer must cite one of these,
so the wording is kept conservative and close to the published guidance. Figures are for the
2025 to 2026 tax year. This is a demo corpus, not a live mirror of GOV.UK.
"""

from __future__ import annotations

from dataclasses import dataclass

_CHECKED = "GOV.UK public guidance, checked 2026-06-20"


@dataclass(frozen=True)
class TaxSource:
    id: str
    title: str
    url: str
    publisher: str
    updated: str
    body: str
    keywords: tuple[str, ...]


SOURCES: list[TaxSource] = [
    TaxSource(
        id="self-assessment-overview",
        title="Self Assessment tax returns",
        url="https://www.gov.uk/self-assessment-tax-returns",
        publisher="GOV.UK / HMRC",
        updated=_CHECKED,
        body=(
            "Self Assessment is the system HMRC uses to collect Income Tax from people whose tax "
            "is not automatically taken from wages, pensions or savings. You usually need to send a "
            "tax return if, in the last tax year (6 April to 5 April), you were self-employed as a "
            "sole trader and earned more than £1,000, were a partner in a business partnership, or "
            "had other untaxed income."
        ),
        keywords=("self", "assessment", "tax", "return", "self-employed", "sole", "trader",
                  "untaxed", "income", "partner", "1000"),
    ),
    TaxSource(
        id="register-self-assessment",
        title="Register for Self Assessment",
        url="https://www.gov.uk/register-for-self-assessment",
        publisher="GOV.UK / HMRC",
        updated=_CHECKED,
        body=(
            "If you need to send a Self Assessment tax return and did not send one last year, you "
            "must register with HMRC by 5 October following the end of the tax year you need to pay "
            "tax for. For example, if you started working for yourself during the 2025 to 2026 tax "
            "year, you must register by 5 October 2026. After registering you get a Unique Taxpayer "
            "Reference (UTR). Registering late can lead to a penalty."
        ),
        keywords=("register", "registration", "5", "october", "deadline", "first", "return",
                  "utr", "started", "freelancing", "self-employed"),
    ),
    TaxSource(
        id="who-must-send-tax-return",
        title="Self Assessment tax returns: who must send a tax return",
        url="https://www.gov.uk/self-assessment-tax-returns/who-must-send-a-tax-return",
        publisher="GOV.UK / HMRC",
        updated=_CHECKED,
        body=(
            "You must send a Self Assessment tax return if, in the last tax year, you were "
            "self-employed as a sole trader and earned more than £1,000 before taking off anything "
            "you can claim tax relief on. You may also need to send one if you had untaxed income "
            "such as rental income, tips and commission, savings, investments, dividends, or foreign "
            "income. GOV.UK provides a checker if you are not sure whether you need to send a return."
        ),
        keywords=("who", "must", "send", "tax", "return", "need", "checker", "self-employed",
                  "sole", "trader", "1000", "rental", "tips", "commission", "dividends",
                  "foreign", "untaxed"),
    ),
    TaxSource(
        id="self-assessment-deadlines",
        title="Self Assessment tax returns: deadlines",
        url="https://www.gov.uk/self-assessment-tax-returns/deadlines",
        publisher="GOV.UK / HMRC",
        updated=_CHECKED,
        body=(
            "For the 2025 to 2026 tax year the deadline to register is 5 October 2026, the deadline "
            "to file a paper tax return is midnight on 31 October 2026, and the deadline to file "
            "online and pay the tax you owe is midnight on 31 January 2027. If you make payments on "
            "account, a second payment is usually due by 31 July."
        ),
        keywords=("deadline", "deadlines", "31", "january", "october", "july", "paper", "online",
                  "file", "filing", "pay", "due", "when"),
    ),
    TaxSource(
        id="pay-self-assessment",
        title="Pay your Self Assessment tax bill",
        url="https://www.gov.uk/pay-self-assessment-tax-bill",
        publisher="GOV.UK / HMRC",
        updated=_CHECKED,
        body=(
            "You usually pay your Self Assessment bill by 31 January. You may have to make two "
            "payments on account each year, one by 31 January and one by 31 July, unless your last "
            "bill was under £1,000 or you paid more than 80% of the tax you owe at source. Each "
            "payment on account is half your previous year's tax bill."
        ),
        keywords=("pay", "payment", "payments", "account", "31", "january", "july", "bill", "owe",
                  "balancing"),
    ),
    TaxSource(
        id="payments-on-account",
        title="Understand your Self Assessment tax bill: payments on account",
        url="https://www.gov.uk/understand-self-assessment-bill/payments-on-account",
        publisher="GOV.UK / HMRC",
        updated=_CHECKED,
        body=(
            "Payments on account are advance payments towards your next Self Assessment tax bill, "
            "including Class 4 National Insurance if you are self-employed. They are normally made "
            "in two instalments, due by midnight on 31 January and 31 July, and each payment is half "
            "of the tax you owed last year. You usually do not need to make payments on account if "
            "your previous year's tax bill was less than £1,000 or if you paid more than 80% of the "
            "tax you owed at source."
        ),
        keywords=("payments", "account", "advance", "instalments", "31", "january", "july",
                  "half", "previous", "bill", "1000", "80", "source", "class", "4"),
    ),
    TaxSource(
        id="difficulties-paying",
        title="If you cannot pay your tax bill on time",
        url="https://www.gov.uk/difficulties-paying-hmrc",
        publisher="GOV.UK / HMRC",
        updated=_CHECKED,
        body=(
            "If you cannot pay your tax bill in full you may be able to set up a Time to Pay "
            "arrangement with HMRC and pay in instalments. You can often set this up online if you "
            "owe £30,000 or less, are within 60 days of the payment deadline, and plan to clear the "
            "debt within 12 months. Contact HMRC as soon as you can if you are struggling to pay."
        ),
        keywords=("cannot", "pay", "time", "instalments", "arrangement", "struggling", "debt",
                  "30000", "difficulties", "afford"),
    ),
    TaxSource(
        id="trading-allowance",
        title="Tax-free allowances on property and trading income",
        url="https://www.gov.uk/guidance/tax-free-allowances-on-property-and-trading-income",
        publisher="GOV.UK / HMRC",
        updated=_CHECKED,
        body=(
            "You can earn up to £1,000 of trading income in a tax year tax-free under the trading "
            "allowance. If your trading income is £1,000 or less you usually do not need to tell "
            "HMRC or register for Self Assessment. If it is more than £1,000 you can choose to "
            "deduct the £1,000 allowance instead of your actual business expenses."
        ),
        keywords=("trading", "allowance", "1000", "tax-free", "gig", "side", "hustle", "expenses",
                  "income", "earn"),
    ),
    TaxSource(
        id="sole-trader",
        title="Set up as a sole trader",
        url="https://www.gov.uk/set-up-sole-trader",
        publisher="GOV.UK / HMRC",
        updated=_CHECKED,
        body=(
            "You are a sole trader if you run your own business as an individual and are "
            "self-employed. You keep all your business's profits after paying tax on them. You must "
            "keep records of your business's sales and expenses, send a Self Assessment tax return "
            "every year, and pay Income Tax and National Insurance on your profits."
        ),
        keywords=("sole", "trader", "self-employed", "set", "up", "business", "records", "profits",
                  "register"),
    ),
    TaxSource(
        id="expenses",
        title="Expenses if you're self-employed",
        url="https://www.gov.uk/expenses-if-youre-self-employed",
        publisher="GOV.UK / HMRC",
        updated=_CHECKED,
        body=(
            "If you are self-employed your business may have allowable expenses you can deduct to "
            "work out your taxable profit, such as office costs, business travel, stock, and some "
            "tools or uniform. You can only claim allowable expenses for business costs. If "
            "something is for both business and private use, you can only claim the business share."
        ),
        keywords=("expenses", "allowable", "deduct", "claim", "business", "costs", "travel",
                  "office", "stock", "profit"),
    ),
    TaxSource(
        id="simplified-expenses",
        title="Simplified expenses if you're self-employed",
        url="https://www.gov.uk/simpler-income-tax-simplified-expenses",
        publisher="GOV.UK / HMRC",
        updated=_CHECKED,
        body=(
            "Simplified expenses let eligible sole traders and business partnerships use flat rates "
            "instead of calculating actual costs for some vehicles, working from home, and living at "
            "business premises. You must keep records of business miles, hours worked at home, and "
            "how many people live at the business premises. Limited companies and partnerships with "
            "a company as a partner cannot use simplified expenses."
        ),
        keywords=("simplified", "expenses", "flat", "rates", "vehicle", "mileage", "working",
                  "home", "premises", "sole", "trader", "partnership", "records"),
    ),
    TaxSource(
        id="ni-self-employed",
        title="Self-employed National Insurance rates",
        url="https://www.gov.uk/self-employed-national-insurance-rates",
        publisher="GOV.UK / HMRC",
        updated=_CHECKED,
        body=(
            "Self-employed people usually pay Class 4 National Insurance on their profits and may "
            "choose to pay voluntary Class 2 contributions to protect entitlement to benefits such "
            "as the State Pension. For the 2025 to 2026 tax year, Class 4 is charged on profits "
            "above the lower profits limit. Whether you pay depends on how much profit you make."
        ),
        keywords=("national", "insurance", "class", "2", "4", "self-employed", "profits",
                  "voluntary", "state", "pension", "contributions", "ni"),
    ),
    TaxSource(
        id="ni-rates-allowances",
        title="Rates and allowances: National Insurance contributions",
        url="https://www.gov.uk/government/publications/rates-and-allowances-national-insurance-contributions/rates-and-allowances-national-insurance-contributions",
        publisher="GOV.UK / HMRC",
        updated=_CHECKED,
        body=(
            "For the 2025 to 2026 tax year, the self-employed Class 2 Small Profits Threshold is "
            "£6,845 and the voluntary Class 2 rate is £3.50 per week. Self-employed people pay "
            "Class 4 National Insurance on profits above the Lower Profits Limit of £12,570. The "
            "Class 4 rate is 6% on profits from £12,570 to £50,270 and 2% above £50,270."
        ),
        keywords=("national", "insurance", "class", "2", "4", "small", "profits", "threshold",
                  "6845", "350", "12570", "50270", "6", "2", "rate", "self-employed"),
    ),
    TaxSource(
        id="income-tax-rates",
        title="Income Tax rates and Personal Allowance",
        url="https://www.gov.uk/income-tax-rates",
        publisher="GOV.UK / HMRC",
        updated=_CHECKED,
        body=(
            "For the 2025 to 2026 tax year the standard Personal Allowance is £12,570, the amount "
            "of income you do not pay tax on. The basic rate of 20% applies to taxable income from "
            "£12,571 to £50,270, the higher rate of 40% from £50,271 to £125,140, and the "
            "additional rate of 45% above £125,140. Your Personal Allowance is smaller if your "
            "income is over £100,000."
        ),
        keywords=("income", "tax", "rate", "rates", "personal", "allowance", "12570", "basic",
                  "higher", "additional", "band", "threshold"),
    ),
    TaxSource(
        id="scottish-income-tax",
        title="Income Tax in Scotland: 2025 to 2026 tax year",
        url="https://www.gov.uk/scottish-income-tax/2025-to-2026-tax-year",
        publisher="GOV.UK / HMRC",
        updated=_CHECKED,
        body=(
            "Scottish Income Tax uses different bands for earnings, pensions, and most other taxable "
            "income. For the 2025 to 2026 tax year, the Personal Allowance is up to £12,570, then "
            "the starter rate is 19% from £12,571 to £15,397, basic rate is 20% from £15,398 to "
            "£27,491, intermediate rate is 21% from £27,492 to £43,662, higher rate is 42% from "
            "£43,663 to £75,000, advanced rate is 45% from £75,001 to £125,140, and top rate is "
            "48% over £125,140."
        ),
        keywords=("scotland", "scottish", "income", "tax", "rate", "starter", "basic",
                  "intermediate", "higher", "advanced", "top", "band", "12570"),
    ),
    TaxSource(
        id="ni-number",
        title="Your National Insurance number",
        url="https://www.gov.uk/national-insurance/your-national-insurance-number",
        publisher="GOV.UK",
        updated=_CHECKED,
        body=(
            "Your National Insurance number is your own personal account number. It makes sure the "
            "National Insurance contributions and tax you pay are properly recorded. It is made up "
            "of two letters, six numbers and a final letter, for example QQ 12 34 56 C. You keep "
            "the same number all your life and should never share it unless you need to, for "
            "example with HMRC or an employer."
        ),
        keywords=("national", "insurance", "number", "nino", "personal", "letters", "numbers",
                  "share"),
    ),
    TaxSource(
        id="penalties",
        title="Self Assessment tax returns: penalties",
        url="https://www.gov.uk/self-assessment-tax-returns/penalties",
        publisher="GOV.UK / HMRC",
        updated=_CHECKED,
        body=(
            "You will usually get a £100 penalty if your tax return is up to 3 months late, and "
            "more if it is later or if you pay your tax bill late. After 3 months there can be "
            "additional daily penalties, with further penalties at 6 and 12 months. You can appeal "
            "a penalty if you have a reasonable excuse, such as a serious illness or a bereavement."
        ),
        keywords=("penalty", "penalties", "late", "100", "fine", "appeal", "reasonable", "excuse",
                  "daily", "missed"),
    ),
    TaxSource(
        id="report-tax-fraud",
        title="Report tax fraud or avoidance to HMRC",
        url="https://www.gov.uk/report-tax-fraud",
        publisher="GOV.UK / HMRC",
        updated=_CHECKED,
        body=(
            "GOV.UK tells people to report a person or business they think is not paying enough tax "
            "or is committing another type of fraud against HMRC. This includes tax avoidance or "
            "evasion, hiding or moving assets, cash or crypto, and other fraud. Reports should be "
            "made using HMRC's online form or fraud hotline; people should not send reports another "
            "way or try to investigate the activity themselves."
        ),
        keywords=("fraud", "avoidance", "evasion", "hide", "hiding", "cash", "income",
                  "declare", "report", "hmrc", "illegal", "hotline"),
    ),
    TaxSource(
        id="extra-support",
        title="Get help from HMRC if you need extra support",
        url="https://www.gov.uk/get-help-hmrc-extra-support",
        publisher="GOV.UK / HMRC",
        updated=_CHECKED,
        body=(
            "HMRC provides extra support for people who need help because of a health condition, a "
            "disability, or personal circumstances such as bereavement, domestic abuse, or "
            "difficulty using digital services. You can ask to speak to an adviser, get help "
            "completing forms, or use the extra support team. You do not have to face tax problems "
            "on your own."
        ),
        keywords=("help", "support", "extra", "disability", "health", "bereavement", "domestic",
                  "abuse", "adviser", "human", "vulnerable", "accessibility"),
    ),
]

_BY_ID = {s.id: s for s in SOURCES}


def all_sources() -> list[TaxSource]:
    return list(SOURCES)


def get_source(source_id: str) -> TaxSource | None:
    return _BY_ID.get(source_id)
