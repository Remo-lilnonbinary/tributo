"""One tokenizer, shared by retrieval ranking, agentic coverage grading, and fact matching.

A single regex and stop-word list, so the three call sites never drift out of sync.
"""

from __future__ import annotations

import re

TOKEN_RE = re.compile(r"[a-z0-9£]+")

STOPWORDS = {
    "a", "an", "and", "are", "as", "at", "be", "by", "can", "do", "does", "for", "from", "have",
    "how", "i", "if", "in", "is", "it", "me", "my", "need", "of", "on", "or", "should", "so",
    "that", "the", "this", "to", "was", "what", "when", "where", "which", "who", "will", "with",
    "you", "your", "am", "we", "they", "but", "not", "any", "about", "get", "got", "im", "ive",
}


def tokenize(text: str, drop_stopwords: bool = True) -> list[str]:
    toks = [t for t in TOKEN_RE.findall(text.lower()) if len(t) > 1]
    return [t for t in toks if t not in STOPWORDS] if drop_stopwords else toks
