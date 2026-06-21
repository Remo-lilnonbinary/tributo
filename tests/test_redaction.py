from app.redaction import redact

PERSONA = (
    "My name is Priya Shah, my NI number is QQ 12 34 56 A and I earned £34,500 from Deliveroo. "
    "Email me at priya@example.com or call 07911 123456."
)


def test_redacts_all_identifier_types():
    result = redact(PERSONA, backend="regex")
    types = {f.type for f in result.findings}
    assert "National Insurance number" in types
    assert "money amount" in types
    assert "email address" in types
    assert "phone number" in types
    assert "name" in types


def test_raw_pii_not_present_in_output():
    result = redact(PERSONA, backend="regex")
    text = result.redacted_text
    assert "QQ 12 34 56 A" not in text
    assert "34,500" not in text
    assert "priya@example.com" not in text
    assert "Priya Shah" not in text


def test_clean_text_is_untouched():
    result = redact("When is the Self Assessment deadline?", backend="regex")
    assert result.findings == []
    assert result.redacted_text == "When is the Self Assessment deadline?"


def test_placeholders_are_numbered_per_type():
    result = redact("Email a@b.com and c@d.com please", backend="regex")
    assert "[EMAIL_1]" in result.redacted_text
    assert "[EMAIL_2]" in result.redacted_text


def test_redacts_word_form_amounts():
    # "pounds"/"gbp" with no £ symbol (how voice + plain typing usually phrase it) must redact.
    for raw, figure in [
        ("I made about 10,000 pounds last year", "10,000"),
        ("I earned 10000 gbp from freelancing", "10000"),
        ("my side income was £10k", "10k"),
    ]:
        result = redact(raw, backend="regex")
        assert any(f.type == "money amount" for f in result.findings), raw
        assert figure not in result.redacted_text, raw
