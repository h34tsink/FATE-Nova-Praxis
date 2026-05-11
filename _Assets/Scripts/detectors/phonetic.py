"""Phonetic matcher for catching Whisper transcription errors on proper nouns.

Only fires for tokens that:
  - are at least 4 chars long
  - look like names (capitalized in source, or follow a name-context cue)
  - do not already match the Aho-Corasick alias index
"""

from __future__ import annotations

import json
import re
from pathlib import Path

from . import Event

NAME_CONTEXT = re.compile(
    r"\b(?:talk\s+to|ask|find|tell|with|to|from|about|like)\s+([A-Z][a-zA-Z]{3,})",
)
CAPITALIZED = re.compile(r"\b([A-Z][a-zA-Z]{3,})\b")


class PhoneticMatcher:
    def __init__(self, cache_dir: Path, active_context: dict | None = None) -> None:
        self.phonetic = json.loads((cache_dir / "phonetic_index.json").read_text(encoding="utf-8"))
        self.aliases = set(json.loads((cache_dir / "aliases.json").read_text(encoding="utf-8")).keys())
        self.entities = json.loads((cache_dir / "entity_index.json").read_text(encoding="utf-8"))
        self.active_context = active_context or {}
        try:
            import jellyfish  # type: ignore
            self._metaphone = jellyfish.metaphone
        except ImportError:
            self._metaphone = None

    def _candidate_tokens(self, text: str) -> list[str]:
        tokens: list[str] = []
        for m in NAME_CONTEXT.finditer(text):
            tokens.append(m.group(1))
        for m in CAPITALIZED.finditer(text):
            tokens.append(m.group(1))
        return list(dict.fromkeys(tokens))

    def scan(self, text: str, timestamp: str) -> list[Event]:
        if self._metaphone is None or not text.strip():
            return []
        events: list[Event] = []
        seen: set[str] = set()
        active_npcs = {n.lower() for n in self.active_context.get("scene_npcs", [])}

        for tok in self._candidate_tokens(text):
            if tok.lower() in self.aliases:
                continue
            try:
                code = self._metaphone(tok.lower())
            except Exception:
                continue
            if not code or code not in self.phonetic:
                continue
            candidates = self.phonetic[code]
            # Prefer active-scene NPCs to break ties
            ranked = sorted(
                candidates,
                key=lambda c: (0 if c.lower() in active_npcs else 1, c),
            )
            target = ranked[0]
            if target in seen:
                continue
            seen.add(target)
            ent = self.entities.get(target, {})
            in_scene = target.lower() in active_npcs
            events.append(Event(
                kind="correction",
                canonical=target,
                path=ent.get("path", ""),
                confidence=0.7 if in_scene else 0.5,
                span=text,
                timestamp=timestamp,
                source_layer="phonetic",
                extra={"heard": tok, "suggested": target},
            ))
        return events
