"""Auditable agentic retrieval.

Instead of one query → one retrieval → one answer, the agent:
  1. PLANS  — decomposes the question into self-contained sub-questions (via FLock, or a
              deterministic fallback when no key is set).
  2. RETRIEVES per sub-question — grounded sources + exact figures from the tax-facts store;
     if a sub-question is uncovered it takes one broader retrieval hop (bounded budget).
  3. GRADES  — deterministic term-coverage per sub-question (deterministic = auditable).
  4. CONSOLIDATES — dedupes and re-cites the union of sources for the final answer.

Every step is captured in a trace that goes into the audit log, so the reasoning itself is part
of the transparency record. Composition (the streamed answer) is done by the caller via flock.
"""

from __future__ import annotations

import json
import re
from dataclasses import dataclass, field

from . import flock
from .corpus.facts import TaxFact, match_facts
from .retrieval import RetrievedSource, retrieve
from .tokenization import tokenize

MAX_SUBQUESTIONS = 5

_PLAN_SYSTEM = (
    "You decompose a UK tax question into the minimal set of self-contained sub-questions needed "
    "to answer it fully. Return ONLY a JSON array of short strings, nothing else. If the question "
    "is already single, return one element. Maximum 5."
)


@dataclass
class RetrievalStep:
    sub_question: str
    hops: int
    coverage: float
    covered: bool
    sources: list[RetrievedSource]
    facts: list[TaxFact]


@dataclass
class AgenticPlan:
    sub_questions: list[str]
    planner: str  # "flock" | "heuristic"
    steps: list[RetrievalStep] = field(default_factory=list)
    sources: list[RetrievedSource] = field(default_factory=list)  # consolidated + re-cited
    facts: list[TaxFact] = field(default_factory=list)
    uncovered: list[str] = field(default_factory=list)

    def trace_dict(self) -> dict:
        return {
            "planner": self.planner,
            "sub_questions": self.sub_questions,
            "steps": [
                {
                    "sub_question": s.sub_question,
                    "hops": s.hops,
                    "coverage": s.coverage,
                    "covered": s.covered,
                    "sources": [src.source.id for src in s.sources],
                    "facts": [f.id for f in s.facts],
                }
                for s in self.steps
            ],
            "facts": [f.to_dict() for f in self.facts],
            "uncovered": self.uncovered,
        }


def _parse_json_list(content: str) -> list[str]:
    # Try each bracketed group (no nested brackets), so prose or tokens like "[S1]" around the
    # real array do not break parsing. Return the first that decodes to a non-empty string list.
    for candidate in re.findall(r"\[[^\[\]]*\]", content, re.S):
        try:
            data = json.loads(candidate)
        except json.JSONDecodeError:
            continue
        items = [str(x).strip() for x in data if isinstance(x, str) and x.strip()]
        if items:
            return items
    return []


def _heuristic_split(question: str) -> list[str]:
    parts = re.split(r"\?|;|\band\b|,\s*and\b|\balso\b", question, flags=re.I)
    subs = [p.strip(" ,.") for p in parts if len(p.split()) >= 3]
    subs = [s if s.endswith("?") else s + "?" for s in subs]
    return subs[:MAX_SUBQUESTIONS] if len(subs) > 1 else [question]


async def plan(question: str) -> tuple[list[str], str]:
    content = await flock.complete(
        [{"role": "system", "content": _PLAN_SYSTEM}, {"role": "user", "content": question}],
        max_tokens=200,
        temperature=0.0,
    )
    if content:
        subs = _parse_json_list(content)
        if subs:
            return subs[:MAX_SUBQUESTIONS], "flock"
    return _heuristic_split(question), "heuristic"


def _coverage(sub_question: str, sources: list[RetrievedSource], facts: list[TaxFact]) -> float:
    terms = set(tokenize(sub_question))
    if not terms:
        return 1.0 if (sources or facts) else 0.0
    covered: set[str] = set()
    for s in sources:
        doc = f"{s.source.title} {s.source.body} {' '.join(s.source.keywords)}"
        covered |= terms & set(tokenize(doc))
    for f in facts:
        covered |= terms & set(f.keywords)
    return round(len(covered) / len(terms), 2)


def _consolidate(sources: list[RetrievedSource], limit: int = 6) -> list[RetrievedSource]:
    best: dict[str, RetrievedSource] = {}
    for s in sources:
        if s.source.id not in best or s.score > best[s.source.id].score:
            best[s.source.id] = s
    ranked = sorted(best.values(), key=lambda s: s.score, reverse=True)[:limit]
    return [RetrievedSource(s.source, s.score, s.matched_terms, f"S{i}") for i, s in enumerate(ranked, 1)]


def _dedupe_facts(facts: list[TaxFact]) -> list[TaxFact]:
    seen, out = set(), []
    for f in facts:
        if f.id not in seen:
            seen.add(f.id)
            out.append(f)
    return out


async def run_agentic(redacted_question: str) -> AgenticPlan:
    """Plan -> retrieve (with bounded re-hops) -> grade -> consolidate. Input is already redacted."""
    sub_questions, planner = await plan(redacted_question)
    steps: list[RetrievalStep] = []
    hop_budget = len(sub_questions) + 2

    for sq in sub_questions:
        sources = retrieve(sq)
        facts = match_facts(sq)
        hops = 1
        # One broader hop if nothing came back and we still have budget.
        if not (sources or facts) and hop_budget > 0:
            sources = retrieve(f"{sq} {redacted_question}")
            facts = match_facts(redacted_question)
            hops, hop_budget = 2, hop_budget - 1
        coverage = _coverage(sq, sources, facts)
        steps.append(RetrievalStep(sq, hops, coverage, bool(sources or facts), sources, facts))

    consolidated = _consolidate([s for st in steps for s in st.sources])
    all_facts = _dedupe_facts([f for st in steps for f in st.facts])
    uncovered = [st.sub_question for st in steps if not st.covered]
    return AgenticPlan(sub_questions, planner, steps, consolidated, all_facts, uncovered)
