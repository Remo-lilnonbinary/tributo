import asyncio

from app.actions import build_actions
from app.agentic import run_agentic
from app.guardrails import evaluate
from app.plans import PlanStore


def _plan_for(q):
    plan = asyncio.run(run_agentic(q))
    return plan, evaluate(q, plan.sources)


def test_actions_built_ordered_and_sourced():
    plan, guards = _plan_for("When do I register for Self Assessment, when must I file, and when do I pay?")
    actions = build_actions(plan.facts, plan.sources, guards)
    assert actions
    ids = [a.id for a in actions]
    assert {"register", "file", "pay"} & set(ids)
    assert any(a.citation for a in actions if a.source_id)  # actions cite their source


def test_escalation_action_comes_first():
    plan, guards = _plan_for("Can I hide some cash income to reduce what I owe?")
    actions = build_actions(plan.facts, plan.sources, guards)
    assert actions[0].id == "human"


def test_plan_store_merge_and_toggle():
    store = PlanStore()
    plan, guards = _plan_for("When is the Self Assessment filing deadline?")
    items = store.merge("maya", build_actions(plan.facts, plan.sources, guards))
    assert items
    first = items[0]["id"]
    assert not items[0]["done"]
    after = store.toggle("maya", first)
    assert any(i["id"] == first and i["done"] for i in after)
