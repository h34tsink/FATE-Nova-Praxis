"""Pattern matcher for rule questions and rule-keyword mentions."""

from __future__ import annotations

import json
import re
from pathlib import Path

from . import Event

QUESTION_PREFIXES = re.compile(
    r"\b(?:how\s+does|how\s+do\s+i|can\s+i|do\s+i|"
    r"what(?:'s|s|\s+is)\s+(?:the\s+)?(?:rule|cost)|"
    r"wait[, ]+can\s+i|does\s+(?:that|this)\s+work)\b",
    re.IGNORECASE,
)


class RulesRegexMatcher:
    def __init__(self, cache_dir: Path) -> None:
        raw = json.loads((cache_dir / "rule_patterns.json").read_text(encoding="utf-8"))
        self._patterns: list[tuple[re.Pattern[str], str]] = [
            (re.compile(pat, re.IGNORECASE), target) for pat, target in raw.items()
        ]

    def scan(self, text: str, timestamp: str) -> list[Event]:
        events: list[Event] = []
        is_question = bool(QUESTION_PREFIXES.search(text))
        seen: set[str] = set()
        for pat, target in self._patterns:
            m = pat.search(text)
            if not m:
                continue
            if target in seen:
                continue
            seen.add(target)
            # Higher confidence when the rule keyword appears inside a question
            confidence = 0.9 if is_question else 0.55
            events.append(Event(
                kind="rule",
                canonical=Path(target).stem,
                path=target,
                confidence=confidence,
                span=text,
                timestamp=timestamp,
                source_layer="rules_regex",
                extra={"is_question": is_question, "matched": m.group(0)},
            ))
        return events
