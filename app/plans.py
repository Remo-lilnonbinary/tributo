"""Per-citizen action plans, so Tributo helps you *run* your tax over time, not just answer once.

A citizen accumulates next-steps across questions and ticks them off. In-memory (hackathon);
swap for a real per-user store before any deployment with real people.
"""

from __future__ import annotations

from dataclasses import dataclass

from .actions import Action


@dataclass
class PlanItem:
    id: str
    title: str
    detail: str
    deadline: str | None
    source_id: str | None
    citation: str | None
    done: bool = False

    def to_dict(self) -> dict:
        return {
            "id": self.id, "title": self.title, "detail": self.detail, "deadline": self.deadline,
            "source_id": self.source_id, "citation": self.citation, "done": self.done,
        }


class PlanStore:
    def __init__(self) -> None:
        self._plans: dict[str, dict[str, PlanItem]] = {}

    def merge(self, citizen: str, actions: list[Action]) -> list[dict]:
        plan = self._plans.setdefault(citizen, {})
        for a in actions:
            if a.id not in plan:
                plan[a.id] = PlanItem(a.id, a.title, a.detail, a.deadline, a.source_id, a.citation)
            else:
                # refresh citation if a later answer cited the source
                if a.citation:
                    plan[a.id].citation = a.citation
        return self.get(citizen)

    def get(self, citizen: str) -> list[dict]:
        return [item.to_dict() for item in self._plans.get(citizen, {}).values()]

    def toggle(self, citizen: str, item_id: str) -> list[dict]:
        plan = self._plans.get(citizen, {})
        if item_id in plan:
            plan[item_id].done = not plan[item_id].done
        return self.get(citizen)


plan_store = PlanStore()
