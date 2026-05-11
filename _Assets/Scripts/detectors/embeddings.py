"""Semantic similarity matcher for paraphrased entity references.

Only runs when faster detectors return no hits for the chunk.
"""

from __future__ import annotations

import json
from pathlib import Path

from . import Event


class EmbeddingMatcher:
    def __init__(self, cache_dir: Path, threshold: float = 0.55, top_k: int = 2) -> None:
        self.threshold = threshold
        self.top_k = top_k
        self.cache_dir = cache_dir
        self._ready = False
        self._load()

    def _load(self) -> None:
        meta_path = self.cache_dir / "embeddings_meta.json"
        emb_path = self.cache_dir / "embeddings.npy"
        if not meta_path.exists() or not emb_path.exists():
            return
        try:
            import numpy as np
            from sentence_transformers import SentenceTransformer
        except ImportError:
            return
        self.meta = json.loads(meta_path.read_text(encoding="utf-8"))
        self.vectors = np.load(str(emb_path))
        self.model = SentenceTransformer("sentence-transformers/all-MiniLM-L6-v2")
        try:
            import faiss  # type: ignore
            self.faiss_index = faiss.read_index(str(self.cache_dir / "faiss.index"))
        except (ImportError, RuntimeError):
            self.faiss_index = None
        self._np = np
        self._ready = True

    def scan(self, text: str, timestamp: str) -> list[Event]:
        if not self._ready or len(text.split()) < 5:
            return []
        query = self.model.encode([text], normalize_embeddings=True)
        np = self._np
        if self.faiss_index is not None:
            scores, idx = self.faiss_index.search(query, self.top_k)
            scores, idx = scores[0], idx[0]
        else:
            sims = (query @ self.vectors.T)[0]
            idx = np.argsort(-sims)[: self.top_k]
            scores = sims[idx]
        events: list[Event] = []
        for score, i in zip(scores, idx):
            if score < self.threshold:
                continue
            chunk = self.meta[int(i)]
            events.append(Event(
                kind=self._kind_for(chunk.get("kind", "glossary")),
                canonical=chunk["canonical"],
                path=chunk["path"],
                confidence=float(score),
                span=text,
                timestamp=timestamp,
                source_layer="embedding",
            ))
        return events

    @staticmethod
    def _kind_for(folder_kind: str) -> str:
        mapping = {
            "npc": "npc", "entity_card": "npc", "faction": "faction",
            "location": "location", "glossary": "glossary", "rule": "rule",
        }
        return mapping.get(folder_kind, "glossary")  # type: ignore[return-value]
