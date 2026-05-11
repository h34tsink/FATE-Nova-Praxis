"""Build the entity/alias/phonetic/embedding indexes the live dashboard relies on.

Run once at session start. Outputs go to _Assets/Cache/.

Folders scanned:
  Characters/Named NPCs/
  GM AI/Entity Cards/
  Factions/
  Locations/
  Glossary/
  Rules and Mechanics/

Outputs:
  entity_index.json     - canonical entity name -> metadata
  aliases.json          - alias -> canonical name
  phonetic_index.json   - double-metaphone code -> [canonical names]
  gm_snippets.json      - canonical name -> short GM-relevant snippet
  rule_patterns.json    - regex pattern -> rules file path
  ignore_terms.json     - hand-curated stoplist (loaded if present, else created)
  embeddings.npy        - numpy array, optional (skipped if sentence-transformers missing)
  embeddings_meta.json  - chunk metadata for embeddings, optional
  faiss.index           - FAISS HNSW index, optional
"""

from __future__ import annotations

import json
import re
import sys
from dataclasses import asdict, dataclass, field
from pathlib import Path

import yaml

VAULT_ROOT = Path(__file__).resolve().parents[2]
CACHE_DIR = VAULT_ROOT / "_Assets" / "Cache"
CACHE_DIR.mkdir(parents=True, exist_ok=True)

ENTITY_FOLDERS = {
    "npc": ["Characters/Named NPCs"],
    "entity_card": ["GM AI/Entity Cards"],
    "faction": ["Factions"],
    "location": ["Locations"],
    "glossary": ["Glossary"],
    "rule": ["Rules and Mechanics"],
}

DEFAULT_IGNORE_TERMS = {
    "the", "a", "an", "is", "it", "to", "of", "in", "on", "at", "for", "and", "or",
    "but", "if", "with", "by", "from", "as", "be", "are", "was", "were",
    "armor", "agent", "gameplay", "equipment", "assets", "fate",
}

FRONTMATTER_RE = re.compile(r"^---\s*\n(.*?)\n---\s*\n", re.DOTALL)


@dataclass
class Entity:
    canonical: str
    path: str
    kind: str
    aliases: list[str] = field(default_factory=list)
    token: str | None = None
    rank: str | None = None
    klass: str | None = None
    faction: str | None = None
    summary: str = ""
    snippet: str = ""


def parse_frontmatter(text: str) -> tuple[dict, str]:
    m = FRONTMATTER_RE.match(text)
    if not m:
        return {}, text
    try:
        fm = yaml.safe_load(m.group(1)) or {}
    except yaml.YAMLError:
        fm = {}
    return fm, text[m.end():]


def extract_snippet(body: str, max_chars: int = 360) -> str:
    """Pull the most GM-useful chunk: summary line + first paragraph."""
    lines = [ln.strip() for ln in body.splitlines() if ln.strip()]
    pieces: list[str] = []
    chars = 0
    for ln in lines:
        if ln.startswith("#"):
            continue
        if ln.startswith(">"):
            ln = ln.lstrip("> ").strip()
        ln = re.sub(r"\[\[([^\]|]+\|)?([^\]]+)\]\]", r"\2", ln)
        ln = re.sub(r"\*\*([^*]+)\*\*", r"\1", ln)
        ln = re.sub(r"\*([^*]+)\*", r"\1", ln)
        pieces.append(ln)
        chars += len(ln)
        if chars >= max_chars:
            break
    snippet = " ".join(pieces)
    return snippet[:max_chars].rstrip() + ("..." if len(snippet) > max_chars else "")


def canonical_from_filename(p: Path) -> str:
    name = p.stem
    # Strip " (R3 Class)" or similar parens from entity cards
    return re.sub(r"\s*\([^)]*\)\s*$", "", name).strip()


def scan_folder(kind: str, folder: Path) -> list[Entity]:
    out: list[Entity] = []
    if not folder.exists():
        return out
    for md in folder.rglob("*.md"):
        if md.name.lower() in {"index.md", "readme.md"}:
            continue
        try:
            text = md.read_text(encoding="utf-8", errors="replace")
        except OSError:
            continue
        fm, body = parse_frontmatter(text)
        canonical = (fm.get("title") or canonical_from_filename(md)).strip()
        if not canonical:
            continue
        aliases_raw = fm.get("aliases") or []
        if isinstance(aliases_raw, str):
            aliases_raw = [aliases_raw]
        aliases = [str(a).strip() for a in aliases_raw if str(a).strip()]
        # Drop slash-command tokens like "/npc kal" from string-match aliases
        aliases = [a for a in aliases if not a.startswith("/")]
        ent = Entity(
            canonical=canonical,
            path=str(md.relative_to(VAULT_ROOT)).replace("\\", "/"),
            kind=kind,
            aliases=aliases,
            token=str(fm.get("token")) if fm.get("token") else None,
            rank=str(fm.get("rank")) if fm.get("rank") else None,
            klass=str(fm.get("class")) if fm.get("class") else None,
            faction=str(fm.get("faction")) if fm.get("faction") else None,
            summary=str(fm.get("summary") or ""),
        )
        ent.snippet = (ent.summary + " — " + extract_snippet(body)) if ent.summary else extract_snippet(body)
        out.append(ent)
    return out


def build_entity_indexes(entities: list[Entity]) -> tuple[dict, dict, dict]:
    entity_index: dict[str, dict] = {}
    aliases_index: dict[str, str] = {}
    gm_snippets: dict[str, str] = {}
    for e in entities:
        entity_index[e.canonical] = asdict(e)
        gm_snippets[e.canonical] = e.snippet
        aliases_index.setdefault(e.canonical.lower(), e.canonical)
        for a in e.aliases:
            aliases_index.setdefault(a.lower(), e.canonical)
    return entity_index, aliases_index, gm_snippets


def build_phonetic_index(aliases_index: dict[str, str]) -> dict[str, list[str]]:
    try:
        import jellyfish
    except ImportError:
        print("[index] jellyfish not installed — skipping phonetic index", file=sys.stderr)
        return {}
    phonetic: dict[str, list[str]] = {}
    for alias_lower, canonical in aliases_index.items():
        if len(alias_lower) < 3:
            continue
        # Only use the first token for short names; full string for compound names
        tokens = alias_lower.split()
        for tok in tokens:
            if len(tok) < 3:
                continue
            try:
                code = jellyfish.metaphone(tok)
            except Exception:
                continue
            if not code:
                continue
            bucket = phonetic.setdefault(code, [])
            if canonical not in bucket:
                bucket.append(canonical)
    return phonetic


def build_rule_patterns() -> dict[str, str]:
    """Map regex patterns to rules-file paths."""
    rules_root = VAULT_ROOT / "Rules and Mechanics"
    patterns: dict[str, str] = {}
    keyword_to_file = {
        r"\bcompel(s|ling|led)?\b": "Compels and Fate Points.md",
        r"\bfate\s*point(s)?\b": "Compels and Fate Points.md",
        r"\binvok(e|ing|ed)\b": "Compels and Fate Points.md",
        r"\brefresh\b": "Refresh and Recovery.md",
        r"\bstress\b": "Stress and Consequences.md",
        r"\bconsequence(s)?\b": "Stress and Consequences.md",
        r"\bstunt(s)?\b": "Stunts.md",
        r"\baspect(s)?\b": "Aspects.md",
        r"\bcontest\b": "Contests and Conflicts.md",
        r"\bconflict\b": "Contests and Conflicts.md",
        r"\battack\s+roll\b": "Contests and Conflicts.md",
        r"\bcreate\s+(an?\s+)?advantage\b": "Four Actions.md",
        r"\bovercome\b": "Four Actions.md",
        r"\bdefend\b": "Four Actions.md",
        r"\b(zone|zones)\b": "Zones and Movement.md",
        r"\bskill\b": "Skills.md",
        r"\bapproach(es)?\b": "Skills.md",
        r"\btaken\s+out\b": "Stress and Consequences.md",
        r"\bconcede\b": "Stress and Consequences.md",
        r"\b4dF\b|\bfate\s+dice\b": "Dice and Ladder.md",
    }
    for pat, target in keyword_to_file.items():
        full_path = rules_root / target
        if full_path.exists():
            patterns[pat] = str(full_path.relative_to(VAULT_ROOT)).replace("\\", "/")
        else:
            # Still register the pattern; dispatcher will fall back to keyword search
            patterns[pat] = f"Rules and Mechanics/{target}"
    return patterns


def build_embeddings(entities: list[Entity]) -> bool:
    try:
        from sentence_transformers import SentenceTransformer
        import numpy as np
    except ImportError:
        print("[index] sentence-transformers not installed — skipping embeddings", file=sys.stderr)
        return False
    chunks: list[dict] = []
    texts: list[str] = []
    for e in entities:
        if not e.snippet:
            continue
        chunks.append({
            "canonical": e.canonical,
            "path": e.path,
            "kind": e.kind,
            "text": e.snippet,
        })
        texts.append(f"{e.canonical}. {e.snippet}")
    if not texts:
        return False
    print(f"[index] embedding {len(texts)} entity snippets...", file=sys.stderr)
    model = SentenceTransformer("sentence-transformers/all-MiniLM-L6-v2")
    vectors = model.encode(texts, normalize_embeddings=True, show_progress_bar=False)
    vectors = np.asarray(vectors, dtype="float32")
    np.save(CACHE_DIR / "embeddings.npy", vectors)
    (CACHE_DIR / "embeddings_meta.json").write_text(
        json.dumps(chunks, indent=2), encoding="utf-8"
    )
    try:
        import faiss  # type: ignore
        index = faiss.IndexFlatIP(vectors.shape[1])
        index.add(vectors)
        faiss.write_index(index, str(CACHE_DIR / "faiss.index"))
    except ImportError:
        print("[index] faiss not installed — embeddings will use numpy nearest-neighbor", file=sys.stderr)
    return True


def load_or_init_ignore() -> set[str]:
    path = CACHE_DIR / "ignore_terms.json"
    if path.exists():
        try:
            return set(json.loads(path.read_text(encoding="utf-8")))
        except json.JSONDecodeError:
            pass
    path.write_text(json.dumps(sorted(DEFAULT_IGNORE_TERMS), indent=2), encoding="utf-8")
    return set(DEFAULT_IGNORE_TERMS)


def main() -> int:
    entities: list[Entity] = []
    for kind, folders in ENTITY_FOLDERS.items():
        for f in folders:
            entities.extend(scan_folder(kind, VAULT_ROOT / f))

    if not entities:
        print("[index] no entities found — check folder layout", file=sys.stderr)
        return 1

    entity_index, aliases_index, gm_snippets = build_entity_indexes(entities)
    phonetic_index = build_phonetic_index(aliases_index)
    rule_patterns = build_rule_patterns()
    ignore_terms = load_or_init_ignore()

    # Strip ignore terms from aliases to avoid bad matches
    aliases_index = {
        a: c for a, c in aliases_index.items()
        if a not in ignore_terms and len(a) >= 3
    }

    (CACHE_DIR / "entity_index.json").write_text(
        json.dumps(entity_index, indent=2, ensure_ascii=False), encoding="utf-8"
    )
    (CACHE_DIR / "aliases.json").write_text(
        json.dumps(aliases_index, indent=2, ensure_ascii=False), encoding="utf-8"
    )
    (CACHE_DIR / "phonetic_index.json").write_text(
        json.dumps(phonetic_index, indent=2, ensure_ascii=False), encoding="utf-8"
    )
    (CACHE_DIR / "gm_snippets.json").write_text(
        json.dumps(gm_snippets, indent=2, ensure_ascii=False), encoding="utf-8"
    )
    (CACHE_DIR / "rule_patterns.json").write_text(
        json.dumps(rule_patterns, indent=2, ensure_ascii=False), encoding="utf-8"
    )

    build_embeddings(entities)

    print(f"[index] indexed {len(entities)} entities, {len(aliases_index)} aliases, "
          f"{len(phonetic_index)} phonetic buckets", file=sys.stderr)
    return 0


if __name__ == "__main__":
    sys.exit(main())
