"""Drop transcript chunks that are clearly out-of-character / meta chatter."""

from __future__ import annotations

import re

OOC_PATTERNS = [
    r"\b(?:pass|hand)\s+(?:me\s+)?(?:the\s+)?(?:chips|soda|water|pizza|beer)\b",
    r"\bbathroom\s+break\b",
    r"\bsmoke\s+break\b",
    r"\bwhat\s+time\s+is\s+it\b",
    r"\bdid\s+you\s+see\s+(?:the|that)\s+(?:game|movie|show)\b",
    r"\b(?:lol|lmao|haha|hahaha)\b",
    r"\border\s+(?:pizza|food|takeout)\b",
    r"\bcan\s+i\s+get\s+(?:a|the)\s+(?:drink|snack|water)\b",
]

OOC_RE = re.compile("|".join(OOC_PATTERNS), re.IGNORECASE)


def is_ooc(text: str) -> bool:
    """Return True if the chunk looks like out-of-character chatter.

    Short circuits: very short chunks (< 4 words) bypass the filter because
    they could be in-character commands or terse reactions.
    """
    if len(text.split()) < 4:
        return False
    return bool(OOC_RE.search(text))
