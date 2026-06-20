"""Synthetic, deliberately non-IID per-institution training data.

Each "node" is an institution that only sees questions from its own specialism. No node sees
the whole picture — which is exactly why federating their models (without ever pooling the raw
questions) beats any single node on a held-out test set that spans every topic.

All questions are synthetic personas. No real citizen data is used anywhere.
"""

from __future__ import annotations

CLASSES = [
    "registration_deadlines",
    "paying_the_bill",
    "expenses_allowances",
    "rates_and_thresholds",
    "penalties_and_help",
]

# Each node: (display name, what they specialise in, [(question, class), ...]).
NODES: list[tuple[str, str, list[tuple[str, str]]]] = [
    (
        "Council A",
        "first-time filers, registration and deadlines",
        [
            ("When do I need to register for Self Assessment if I just started freelancing?", "registration_deadlines"),
            ("What is the deadline to register as self employed with HMRC?", "registration_deadlines"),
            ("I started working for myself this year, when must I tell HMRC?", "registration_deadlines"),
            ("When is the online Self Assessment tax return deadline?", "registration_deadlines"),
            ("What date do I need to file my tax return by?", "registration_deadlines"),
            ("Do I need to register for Self Assessment as a first time filer?", "registration_deadlines"),
            ("When do I pay the tax I owe after filing Self Assessment?", "paying_the_bill"),
            ("Is the deadline to pay my tax bill in January?", "paying_the_bill"),
        ],
    ),
    (
        "Citizens Advice B",
        "gig workers, expenses, allowances and paying the bill",
        [
            ("Can I claim travel and office costs as a sole trader?", "expenses_allowances"),
            ("What business expenses can I deduct from my profit?", "expenses_allowances"),
            ("Is there a tax free trading allowance for side income?", "expenses_allowances"),
            ("I earn a small amount on the side, do I get a 1000 pound allowance?", "expenses_allowances"),
            ("What expenses are allowable if I am self employed?", "expenses_allowances"),
            ("How do payments on account work for my tax bill?", "paying_the_bill"),
            ("I cannot afford my tax bill, can I pay in instalments?", "paying_the_bill"),
            ("Can I set up a Time to Pay arrangement with HMRC?", "paying_the_bill"),
        ],
    ),
    (
        "Adviser Practice C",
        "rates, thresholds, penalties and extra support",
        [
            ("What is the personal allowance for income tax?", "rates_and_thresholds"),
            ("What are the income tax rates and bands this year?", "rates_and_thresholds"),
            ("How much National Insurance do self employed people pay?", "rates_and_thresholds"),
            ("What is the higher rate income tax threshold?", "rates_and_thresholds"),
            ("What penalty do I get for filing my tax return late?", "penalties_and_help"),
            ("Can I appeal a late filing penalty if I was seriously ill?", "penalties_and_help"),
            ("I need extra help from HMRC because of a disability.", "penalties_and_help"),
            ("Where can I get support if I am struggling with my tax?", "penalties_and_help"),
        ],
    ),
]

# Held-out global test set: spans every class, so a single specialised node cannot do well.
TEST_SET: list[tuple[str, str]] = [
    ("I just went self employed, when do I register with HMRC?", "registration_deadlines"),
    ("When is the Self Assessment filing deadline?", "registration_deadlines"),
    ("When do I need to pay my tax bill?", "paying_the_bill"),
    ("Can I pay my tax in instalments if I cannot afford it?", "paying_the_bill"),
    ("Which expenses can I claim as a sole trader?", "expenses_allowances"),
    ("Is there a 1000 pound tax free allowance for small trading income?", "expenses_allowances"),
    ("What is the personal allowance and basic rate band?", "rates_and_thresholds"),
    ("How much National Insurance will I pay on my profits?", "rates_and_thresholds"),
    ("What is the penalty for a late tax return?", "penalties_and_help"),
    ("I have a health condition and need help from HMRC.", "penalties_and_help"),
]
