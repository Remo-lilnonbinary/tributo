import asyncio

from app.agentic import run_agentic
from app.corpus.facts import match_facts


def test_multipart_question_decomposes_and_grounds():
    q = ("Do I need to register for Self Assessment and when is the deadline to file "
         "and how much is the personal allowance?")
    plan = asyncio.run(run_agentic(q))
    assert len(plan.sub_questions) >= 2          # decomposed into sub-questions
    assert plan.planner == "heuristic"           # no FLOCK key in tests -> deterministic fallback
    assert plan.sources                          # consolidated sources retrieved
    assert plan.sources[0].citation == "S1"      # re-cited S1..Sn
    trace = plan.trace_dict()
    assert len(trace["steps"]) == len(plan.sub_questions)


def test_single_question_stays_single():
    plan = asyncio.run(run_agentic("When is the Self Assessment deadline?"))
    assert len(plan.sub_questions) == 1


def test_facts_store_grounds_exact_figures():
    ids = {f.id for f in match_facts("what is the personal allowance and basic rate band")}
    assert "personal_allowance" in ids


def test_facts_flow_into_the_plan():
    plan = asyncio.run(run_agentic("what is the personal allowance and the filing deadline"))
    fact_ids = {f.id for f in plan.facts}
    assert fact_ids  # exact figures attached for grounding
