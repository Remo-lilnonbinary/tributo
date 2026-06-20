"""PII minimisation: scrub personal identifiers BEFORE anything reaches inference.

Two backends:
  - regex   : always available, UK-specific (NI number, UTR, postcode, £ amounts, phone, email).
  - presidio: Microsoft Presidio NER (names, locations, etc.) merged with the UK regex above.
              ICO data-minimisation guidance names this kind of redaction explicitly.

The raw text is never stored or returned; callers only ever see `redacted_text` plus the
*types* and *counts* of what was removed. That is the privacy guarantee Tributo can show.
"""

from __future__ import annotations

import re
from dataclasses import dataclass

from .config import get_settings

# label -> (human-friendly name, placeholder base)
_LABELS: dict[str, tuple[str, str]] = {
    "NINO": ("National Insurance number", "NI_NUMBER"),
    "UTR": ("Unique Taxpayer Reference", "UTR"),
    "EMAIL": ("email address", "EMAIL"),
    "PHONE": ("phone number", "PHONE"),
    "AMOUNT": ("money amount", "AMOUNT"),
    "PERSON": ("name", "NAME"),
    "POSTCODE": ("postcode", "POSTCODE"),
    "LOCATION": ("location", "LOCATION"),
}

# Order matters only for readability; overlaps are resolved in _apply().
_REGEX_PATTERNS: list[tuple[str, re.Pattern]] = [
    # Deliberately over-matches the strict NINO letter rules: a redactor should err towards
    # redacting anything shaped like a NI number (incl. the GOV.UK "QQ..." placeholder).
    ("NINO", re.compile(r"\b[A-Z]{2}\s?\d{2}\s?\d{2}\s?\d{2}\s?[A-Z]\b", re.I)),
    ("UTR", re.compile(r"\b\d{10}\b")),
    ("EMAIL", re.compile(r"\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b")),
    ("PHONE", re.compile(r"(?:\+44\s?7\d{3}|\b07\d{3})\s?\d{3}\s?\d{3}\b")),
    ("POSTCODE", re.compile(r"\b[A-Z]{1,2}\d[A-Z\d]?\s?\d[A-Z]{2}\b")),
    ("AMOUNT", re.compile(r"£\s?\d{1,3}(?:,\d{3})+(?:\.\d{1,2})?|£\s?\d+(?:\.\d{1,2})?")),
    # Trigger phrase is case-insensitive; the captured name must stay capitalised.
    ("PERSON", re.compile(r"\b(?i:my name is|i am called|i'?m called|call me|name'?s)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+){0,2})")),
]


@dataclass
class RedactionFinding:
    type: str
    placeholder: str
    count: int

    def to_dict(self) -> dict:
        return {"type": self.type, "placeholder": self.placeholder, "count": self.count}


@dataclass
class RedactionResult:
    redacted_text: str
    findings: list[RedactionFinding]
    backend: str

    def to_dict(self) -> dict:
        return {
            "redacted_text": self.redacted_text,
            "findings": [f.to_dict() for f in self.findings],
            "backend": self.backend,
        }


def _regex_spans(text: str) -> list[tuple[int, int, str]]:
    spans: list[tuple[int, int, str]] = []
    for label, rx in _REGEX_PATTERNS:
        for m in rx.finditer(text):
            if label == "PERSON":
                if m.group(1):
                    spans.append((m.start(1), m.end(1), label))
            else:
                spans.append((m.start(), m.end(), label))
    return spans


def _apply(text: str, spans: list[tuple[int, int, str]], backend: str) -> RedactionResult:
    # Resolve overlaps: prefer earlier start, then longer match.
    ordered = sorted(spans, key=lambda s: (s[0], -(s[1] - s[0])))
    chosen: list[tuple[int, int, str]] = []
    last_end = -1
    for start, end, label in ordered:
        if start >= last_end and end > start:
            chosen.append((start, end, label))
            last_end = end

    # Number each type left-to-right: [NI_NUMBER_1], [EMAIL_1], [EMAIL_2] ...
    counts: dict[str, int] = {}
    numbered: list[tuple[int, int, str]] = []
    for start, end, label in sorted(chosen, key=lambda s: s[0]):
        counts[label] = counts.get(label, 0) + 1
        base = _LABELS.get(label, (label, label))[1]
        numbered.append((start, end, f"[{base}_{counts[label]}]"))

    out = text
    for start, end, placeholder in sorted(numbered, key=lambda s: s[0], reverse=True):
        out = out[:start] + placeholder + out[end:]

    findings = []
    for label, n in counts.items():
        name, base = _LABELS.get(label, (label, label))
        findings.append(RedactionFinding(name, f"[{base}]", n))
    return RedactionResult(out, findings, backend)


# Presidio is lazy + cached: None=not tried, False=unavailable, else the analyzer engine.
_PRESIDIO_ENGINE = None


def _presidio_spans(text: str) -> list[tuple[int, int, str]] | None:
    global _PRESIDIO_ENGINE
    if _PRESIDIO_ENGINE is False:
        return None
    if _PRESIDIO_ENGINE is None:
        try:
            from presidio_analyzer import AnalyzerEngine, Pattern, PatternRecognizer

            engine = AnalyzerEngine()
            engine.registry.add_recognizer(PatternRecognizer(
                supported_entity="UK_NINO",
                patterns=[Pattern("nino", r"\b[A-Za-z]{2}\s?\d{2}\s?\d{2}\s?\d{2}\s?[A-Za-z]\b", 0.85)],
            ))
            engine.registry.add_recognizer(PatternRecognizer(
                supported_entity="UK_UTR",
                patterns=[Pattern("utr", r"\b\d{10}\b", 0.6)],
            ))
            _PRESIDIO_ENGINE = engine
        except Exception:
            _PRESIDIO_ENGINE = False
            return None

    try:
        ent_map = {
            "PERSON": "PERSON", "EMAIL_ADDRESS": "EMAIL", "PHONE_NUMBER": "PHONE",
            "LOCATION": "LOCATION", "UK_NINO": "NINO", "UK_UTR": "UTR",
        }
        results = _PRESIDIO_ENGINE.analyze(text=text, language="en", entities=list(ent_map))
        spans = [(r.start, r.end, ent_map[r.entity_type])
                 for r in results if r.entity_type in ent_map and r.score >= 0.4]
        # Presidio does not treat £ amounts as PII; keep the UK regex set alongside it.
        spans += _regex_spans(text)
        return spans
    except Exception:
        return None


def redact(text: str, backend: str | None = None) -> RedactionResult:
    backend = backend or get_settings().redactor
    if backend in ("auto", "presidio"):
        spans = _presidio_spans(text)
        if spans is not None:
            return _apply(text, spans, "presidio (Microsoft) + UK regex")
        if backend == "presidio":
            return _apply(text, _regex_spans(text), "regex (presidio unavailable)")
    return _apply(text, _regex_spans(text), "regex")
