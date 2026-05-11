"""Live dashboard detection stack. Each detector returns a list of Event dicts."""
from dataclasses import dataclass, field
from typing import Literal

EventKind = Literal["npc", "faction", "location", "glossary", "rule", "correction"]


@dataclass
class Event:
    kind: EventKind
    canonical: str
    path: str
    confidence: float
    span: str
    timestamp: str
    source_layer: str
    extra: dict = field(default_factory=dict)

    def dedupe_key(self) -> str:
        return f"{self.kind}:{self.canonical.lower()}"
