"""Aho-Corasick string matcher for vault entity names + aliases."""

from __future__ import annotations

import json
import re
from pathlib import Path

from . import Event

try:
    import ahocorasick  # type: ignore
except ImportError:
    ahocorasick = None  # type: ignore


class AhoMatcher:
    def __init__(self, cache_dir: Path) -> None:
        self.aliases = json.loads((cache_dir / "aliases.json").read_text(encoding="utf-8"))
        self.entities = json.loads((cache_dir / "entity_index.json").read_text(encoding="utf-8"))
        self._build()

    def _build(self) -> None:
        if ahocorasick is None:
            self._automaton = None
            return
        a = ahocorasick.Automaton()
        for alias_lower, canonical in self.aliases.items():
            a.add_word(alias_lower, (alias_lower, canonical))
        a.make_automaton()
        self._automaton = a

    def scan(self, text: str, timestamp: str) -> list[Event]:
        if not text.strip():
            return []
        events: list[Event] = []
        seen: set[str] = set()
        haystack = text.lower()
        if self._automaton is not None:
            for end_pos, (alias, canonical) in self._automaton.iter(haystack):
                start = end_pos - len(alias) + 1
                if not self._is_word_boundary(haystack, start, end_pos):
                    continue
                if canonical in seen:
                    continue
                seen.add(canonical)
                ent = self.entities.get(canonical, {})
                events.append(Event(
                    kind=self._kind_for(ent.get("kind", "glossary")),
                    canonical=canonical,
                    path=ent.get("path", ""),
                    confidence=0.95,
                    span=text[max(0, start - 20):min(len(text), end_pos + 21)].strip(),
                    timestamp=timestamp,
                    source_layer="aho",
                ))
        else:
            # Fallback: simple regex word-boundary search
            for alias, canonical in self.aliases.items():
                if canonical in seen:
                    continue
                if re.search(rf"\b{re.escape(alias)}\b", haystack):
                    seen.add(canonical)
                    ent = self.entities.get(canonical, {})
                    events.append(Event(
                        kind=self._kind_for(ent.get("kind", "glossary")),
                        canonical=canonical,
                        path=ent.get("path", ""),
                        confidence=0.85,
                        span=text,
                        timestamp=timestamp,
                        source_layer="aho-fallback",
                    ))
        return events

    @staticmethod
    def _is_word_boundary(text: str, start: int, end: int) -> bool:
        if start > 0 and text[start - 1].isalnum():
            return False
        if end + 1 < len(text) and text[end + 1].isalnum():
            return False
        return True

    @staticmethod
    def _kind_for(folder_kind: str) -> str:
        # Map indexer "kind" tags to Event kinds
        mapping = {
            "npc": "npc",
            "entity_card": "npc",
            "faction": "faction",
            "location": "location",
            "glossary": "glossary",
            "rule": "rule",
        }
        return mapping.get(folder_kind, "glossary")  # type: ignore[return-value]
