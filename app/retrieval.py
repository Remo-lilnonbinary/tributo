"""Grounded retrieval over the UK tax corpus.

Default backend is BM25 (lightweight, instant, no model download). An optional embeddings
backend (sentence-transformers) is used when RETRIEVER=embeddings and the package is present,
falling back to BM25 otherwise. Either way we compute lexical term overlap, which the
guardrails use to decide how confident/grounded an answer is.
"""

from __future__ import annotations

from dataclasses import dataclass
from functools import lru_cache

from rank_bm25 import BM25Okapi

from .config import get_settings
from .corpus.sources import TaxSource, all_sources
from .tokenization import tokenize


@dataclass
class RetrievedSource:
    source: TaxSource
    score: float  # normalised 0..1
    matched_terms: int
    citation: str  # "S1", "S2", ...

    def to_dict(self) -> dict:
        return {
            "id": self.source.id,
            "citation": self.citation,
            "title": self.source.title,
            "url": self.source.url,
            "publisher": self.source.publisher,
            "updated": self.source.updated,
            "snippet": self.source.body,
            "score": round(self.score, 3),
            "matched_terms": self.matched_terms,
        }


class Retriever:
    def __init__(self, backend: str = "bm25") -> None:
        self.backend = backend
        self.docs = all_sources()
        self.doc_tokens = [
            tokenize(f"{d.title} {d.body} {' '.join(d.keywords)}") for d in self.docs
        ]
        self.doc_token_sets = [set(t) for t in self.doc_tokens]
        self.bm25 = BM25Okapi(self.doc_tokens)
        self._embed_model = None
        self._doc_embeddings = None
        if backend == "embeddings":
            self._try_load_embeddings()

    def _try_load_embeddings(self) -> None:
        try:
            from sentence_transformers import SentenceTransformer

            model = SentenceTransformer(get_settings().embedding_model)
            corpus = [f"{d.title}. {d.body}" for d in self.docs]
            self._embed_model = model
            self._doc_embeddings = model.encode(corpus, normalize_embeddings=True)
        except Exception:
            self.backend = "bm25"
            self._embed_model = None

    def retrieve(self, query: str, top_k: int | None = None) -> list[RetrievedSource]:
        top_k = top_k or get_settings().retrieval_top_k
        q_set = set(tokenize(query))

        if self.backend == "embeddings" and self._embed_model is not None:
            qv = self._embed_model.encode([query], normalize_embeddings=True)[0]
            sims = self._doc_embeddings @ qv
            ranked = sorted(
                ((i, float(sims[i])) for i in range(len(self.docs))), key=lambda x: x[1], reverse=True
            )
            ranked = [r for r in ranked if r[1] > 0.15]
        else:
            scores = self.bm25.get_scores(tokenize(query))
            ranked = sorted(
                ((i, float(scores[i])) for i in range(len(self.docs))), key=lambda x: x[1], reverse=True
            )
            ranked = [r for r in ranked if r[1] > 0]

        if not ranked:
            return []

        max_score = max(r[1] for r in ranked) or 1.0
        out: list[RetrievedSource] = []
        for rank, (i, raw) in enumerate(ranked[:top_k], start=1):
            matched = len(q_set & self.doc_token_sets[i])
            out.append(RetrievedSource(self.docs[i], raw / max_score, matched, f"S{rank}"))
        return out


@lru_cache
def get_retriever() -> Retriever:
    return Retriever(backend=get_settings().retriever)


def retrieve(query: str, top_k: int | None = None) -> list[RetrievedSource]:
    return get_retriever().retrieve(query, top_k)
