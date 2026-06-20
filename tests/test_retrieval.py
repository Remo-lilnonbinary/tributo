from app.guardrails import evaluate
from app.retrieval import retrieve


def test_register_question_retrieves_registration_source():
    sources = retrieve("when do I register for Self Assessment as a new freelancer")
    assert sources, "expected at least one source"
    assert sources[0].citation == "S1"
    ids = {s.source.id for s in sources}
    assert "register-self-assessment" in ids


def test_off_topic_question_finds_nothing_and_escalates():
    sources = retrieve("what is the best recipe for a chocolate cake")
    assert sources == []
    guards = evaluate("what is the best recipe for a chocolate cake", sources)
    assert guards.escalated is True
    assert guards.confidence == "needs-human"


def test_grounded_question_is_high_confidence():
    sources = retrieve("how much is the personal allowance and income tax rates")
    guards = evaluate("how much is the personal allowance and income tax rates", sources)
    assert guards.escalated is False
    assert guards.confidence == "grounded"
