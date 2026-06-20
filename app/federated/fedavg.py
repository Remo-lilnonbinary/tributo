"""A real federated-averaging round (FedAvg), small enough to run live in well under a second.

The pattern mirrors FLock's FL Alliance: every institution trains a model on its own private
data and shares only *model weights*; a coordinator averages the weights; the aggregated model
is evaluated on a held-out set. Raw rows never leave a node.

Implementation: multinomial logistic regression on TF-IDF features. The feature space (vocab)
is derived from the PUBLIC GOV.UK corpus, never from citizen questions, so nodes share a
feature space without pooling data. This is genuinely federated learning, just small — the
honest "real, not theatre" version of the demo. For the heavier real-FLock-toolkit artifact
(LoRA over a small LLM), see scripts/run_flockit.md.
"""

from __future__ import annotations

import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer

from ..corpus.sources import all_sources
from .data import CLASSES, NODES, TEST_SET


def _softmax(z: np.ndarray) -> np.ndarray:
    z = z - z.max(axis=1, keepdims=True)
    e = np.exp(z)
    return e / e.sum(axis=1, keepdims=True)


def _onehot(y: np.ndarray, n_classes: int) -> np.ndarray:
    m = np.zeros((len(y), n_classes))
    m[np.arange(len(y)), y] = 1.0
    return m


class SoftmaxModel:
    """Plain numpy multinomial logistic regression so FedAvg = literally averaging W and b."""

    def __init__(self, n_features: int, n_classes: int, rng: np.random.Generator | None = None):
        rng = rng or np.random.default_rng()
        self.W = rng.normal(0.0, 0.01, size=(n_features, n_classes))
        self.b = np.zeros(n_classes)

    def copy(self) -> "SoftmaxModel":
        c = SoftmaxModel(self.W.shape[0], self.W.shape[1])
        c.W, c.b = self.W.copy(), self.b.copy()
        return c

    def train(self, x: np.ndarray, y: np.ndarray, epochs: int = 200, lr: float = 0.5, l2: float = 1e-3) -> None:
        yoh = _onehot(y, self.W.shape[1])
        n = max(len(y), 1)
        for _ in range(epochs):
            grad_z = (_softmax(x @ self.W + self.b) - yoh) / n
            self.W -= lr * (x.T @ grad_z + l2 * self.W)
            self.b -= lr * grad_z.sum(axis=0)

    def predict(self, x: np.ndarray) -> np.ndarray:
        return np.argmax(x @ self.W + self.b, axis=1)

    def accuracy(self, x: np.ndarray, y: np.ndarray) -> float:
        return float((self.predict(x) == y).mean())


def _fedavg(models: list[SoftmaxModel], sizes: list[int]) -> SoftmaxModel:
    total = float(sum(sizes)) or 1.0
    agg = models[0].copy()
    agg.W = sum(m.W * (s / total) for m, s in zip(models, sizes))
    agg.b = sum(m.b * (s / total) for m, s in zip(models, sizes))
    return agg


def _build_feature_space() -> TfidfVectorizer:
    # Fit ONLY on the public GOV.UK corpus — citizen Q&A is never pooled to build the vocab.
    corpus = [f"{s.title} {s.body} {' '.join(s.keywords)}" for s in all_sources()]
    vec = TfidfVectorizer(stop_words="english", ngram_range=(1, 2), min_df=1)
    vec.fit(corpus)
    return vec


def run_federated_round(num_rounds: int = 3) -> dict:
    """Run a real FedAvg round across the institution nodes. Returns a JSON-able report."""
    rng = np.random.default_rng()  # unseeded: training is real, so numbers vary run-to-run
    vec = _build_feature_space()

    def featurise(pairs: list[tuple[str, str]]) -> tuple[np.ndarray, np.ndarray]:
        x = vec.transform([q for q, _ in pairs]).toarray()
        y = np.array([CLASSES.index(c) for _, c in pairs])
        return x, y

    test_x, test_y = featurise(TEST_SET)
    n_features, n_classes = test_x.shape[1], len(CLASSES)

    node_xy = [(name, focus, *featurise(rows)) for name, focus, rows in NODES]

    global_model = SoftmaxModel(n_features, n_classes, rng)
    chance = global_model.accuracy(test_x, test_y)

    local_global_accs: list[float] = []  # each node's local-only model, scored on the global test
    node_reports: list[dict] = []
    rounds_out: list[dict] = []

    for r in range(1, num_rounds + 1):
        local_models, sizes = [], []
        for name, focus, x, y in node_xy:
            m = global_model.copy()
            m.train(x, y, epochs=150, lr=0.5)
            local_models.append(m)
            sizes.append(len(y))
            if r == 1:
                local_acc = m.accuracy(test_x, test_y)
                local_global_accs.append(local_acc)
                update_norm = float(np.sqrt(((m.W - global_model.W) ** 2).sum() + ((m.b - global_model.b) ** 2).sum()))
                node_reports.append({
                    "name": name,
                    "focus": focus,
                    "local_examples": int(len(y)),
                    "local_only_accuracy": round(local_acc, 3),
                    "update_norm": round(update_norm, 3),
                    "raw_rows_shared": 0,
                })
        global_model = _fedavg(local_models, sizes)
        rounds_out.append({"round": r, "global_accuracy": round(global_model.accuracy(test_x, test_y), 3)})

    before = round(float(np.mean(local_global_accs)), 3)
    after = rounds_out[-1]["global_accuracy"]

    return {
        "round_id": f"fl-{int(after * 1000):03d}-{rng.integers(1000, 9999)}",
        "aggregate_method": "FedAvg",
        "raw_data_shared": False,
        "feature_space": "TF-IDF over the public GOV.UK corpus (citizen Q&A never pooled)",
        "model": "multinomial logistic regression (LoRA-over-LLM variant available via FLocKit)",
        "num_nodes": len(NODES),
        "num_rounds": num_rounds,
        "test_examples": int(len(TEST_SET)),
        "chance_accuracy": round(chance, 3),
        "before_accuracy": before,  # mean single-institution model on the global test
        "after_accuracy": after,  # federated model on the global test
        "improvement_points": round((after - before) * 100, 1),
        "nodes": node_reports,
        "rounds": rounds_out,
        "timeline": [
            "Each institution trains a local model on its own private, specialised Q&A.",
            "Only model weight updates leave each node — never the raw questions.",
            "The coordinator aggregates the updates with FedAvg.",
            "The federated model is scored on a held-out test set spanning every topic.",
        ],
    }
