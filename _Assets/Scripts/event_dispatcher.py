"""Event dispatcher: tail Live Transcript.md, run detection stack, batch -> claude -p.

Process model: long-lived loop, runs alongside live_capture.py.

Flow:
  1. Tail the transcript file for new lines.
  2. For each new line: OOC filter -> Aho -> Phonetic -> Embedding (fallback) -> Rules.
  3. Dedupe events within a sliding 60s window.
  4. Every --batch-seconds, if queue non-empty, build a single prompt and call claude -p.
  5. Prepend the returned markdown blocks to Live Dashboard.md (archive overflow).

CLI:
    python event_dispatcher.py --session 9 --batch-seconds 30 --model claude-sonnet-4-6

Pause mechanism: create a file named ".dashboard_paused" in the session folder.
"""

from __future__ import annotations

import argparse
import datetime as dt
import json
import os
import re
import subprocess
import sys
import time
from collections import deque
from pathlib import Path

VAULT_ROOT = Path(__file__).resolve().parents[2]
CACHE_DIR = VAULT_ROOT / "_Assets" / "Cache"
PROMPTS_DIR = Path(__file__).resolve().parent / "prompts"

sys.path.insert(0, str(Path(__file__).resolve().parent))
from detectors import Event  # noqa: E402
from detectors.aho import AhoMatcher  # noqa: E402
from detectors.embeddings import EmbeddingMatcher  # noqa: E402
from detectors.ooc_filter import is_ooc  # noqa: E402
from detectors.phonetic import PhoneticMatcher  # noqa: E402
from detectors.rules_regex import RulesRegexMatcher  # noqa: E402

LINE_RE = re.compile(r"^\[(\d{2}:\d{2}:\d{2})\]\s+(.*)$")
DASHBOARD_HEAD = (
    "# Session {n} — Live Dashboard\n"
    "> auto-updating · pause: touch `.dashboard_paused` in this folder\n\n"
)
DEDUPE_WINDOW_SEC = 60
DASHBOARD_MAX_ITEMS = 10


def session_dir(vault: Path, session: int) -> Path:
    return vault / "Sessions" / f"Session {session}"


def load_active_context(vault: Path, session: int) -> dict:
    """Load NPC/location context from the most recent scene file, if any."""
    scenes = sorted(session_dir(vault, session).glob("Scenes/Scene *.md"))
    if not scenes:
        return {}
    latest = scenes[-1]
    text = latest.read_text(encoding="utf-8", errors="replace")
    npcs = re.findall(r"\[\[(?:Characters/Named NPCs|GM AI/Entity Cards/[^/]+)/([^|\]]+?)\]\]", text)
    factions = re.findall(r"\[\[Factions/[^/]+/([^|\]]+?)\]\]", text)
    locations = re.findall(r"\[\[Locations/[^/]+/([^|\]]+?)\]\]", text)
    return {
        "scene_npcs": list(dict.fromkeys(npcs))[:10],
        "scene_factions": list(dict.fromkeys(factions))[:10],
        "scene_location": locations[0] if locations else "",
        "source_scene": str(latest.relative_to(vault)),
    }


def tail_lines(path: Path, stop_check):
    """Yield new lines appended to path until stop_check() returns True."""
    pos = 0
    if path.exists():
        pos = path.stat().st_size
    buffer = ""
    while not stop_check():
        if not path.exists():
            time.sleep(0.5)
            continue
        size = path.stat().st_size
        if size < pos:
            pos = 0
            buffer = ""
        if size > pos:
            with path.open("r", encoding="utf-8", errors="replace") as f:
                f.seek(pos)
                chunk = f.read()
                pos = f.tell()
            buffer += chunk
            while "\n" in buffer:
                line, buffer = buffer.split("\n", 1)
                yield line
        time.sleep(0.5)


def detect(line: str, ts: str, matchers: dict) -> list[Event]:
    if is_ooc(line):
        return []
    events: list[Event] = []
    events.extend(matchers["aho"].scan(line, ts))
    events.extend(matchers["phonetic"].scan(line, ts))
    events.extend(matchers["rules"].scan(line, ts))
    # Only invoke embeddings if string layers found nothing (cost saver)
    if not events and matchers.get("embeddings") is not None:
        events.extend(matchers["embeddings"].scan(line, ts))
    return events


def dedupe(events: list[Event], recent: deque) -> list[Event]:
    out: list[Event] = []
    now = time.time()
    while recent and recent[0][1] < now - DEDUPE_WINDOW_SEC:
        recent.popleft()
    keys_in_window = {k for k, _ in recent}
    for e in events:
        k = e.dedupe_key()
        if k in keys_in_window:
            continue
        keys_in_window.add(k)
        recent.append((k, now))
        out.append(e)
    return out


def build_batch_prompt(
    events: list[Event],
    transcript_window: list[str],
    snippets: dict[str, str],
    active_context: dict,
) -> str:
    lines: list[str] = []
    lines.append("## Recent transcript (last few lines):")
    for ln in transcript_window:
        lines.append(ln)
    lines.append("")
    lines.append("## Detected events to address:")
    for e in events:
        snip = snippets.get(e.canonical, "")
        emoji = {
            "npc": "🎭", "faction": "🧠", "location": "📍",
            "glossary": "📖", "rule": "📜", "correction": "🔧",
        }.get(e.kind, "🔹")
        lines.append(
            f"- [{e.timestamp}] {emoji} **{e.kind}**: `{e.canonical}` "
            f"(confidence={e.confidence:.2f}, layer={e.source_layer})"
        )
        if e.path:
            lines.append(f"  - vault path: `{e.path}`")
        if snip:
            lines.append(f"  - snippet: {snip}")
        if e.extra:
            lines.append(f"  - extra: {json.dumps(e.extra)}")
        lines.append(f"  - heard: \"{e.span}\"")
    lines.append("")
    if active_context:
        lines.append("## Current scene context:")
        if active_context.get("scene_location"):
            lines.append(f"- Location: {active_context['scene_location']}")
        if active_context.get("scene_npcs"):
            lines.append(f"- Active NPCs: {', '.join(active_context['scene_npcs'])}")
        if active_context.get("scene_factions"):
            lines.append(f"- Active factions: {', '.join(active_context['scene_factions'])}")
        lines.append("")
    lines.append(
        "For each detected event, emit one dashboard entry in the exact format "
        "specified in the system prompt. Output nothing else."
    )
    return "\n".join(lines)


def call_claude(prompt: str, system_prompt_path: Path, model: str, allowed_tools: str) -> str:
    """Invoke `claude -p` and return stdout."""
    if not system_prompt_path.exists():
        print(f"[dispatch] system prompt missing: {system_prompt_path}", file=sys.stderr)
        return ""
    system_text = system_prompt_path.read_text(encoding="utf-8")
    cmd = [
        "claude", "-p",
        "--model", model,
        "--append-system-prompt", system_text,
        "--allowed-tools", allowed_tools,
    ]
    try:
        result = subprocess.run(
            cmd,
            input=prompt,
            capture_output=True,
            text=True,
            timeout=120,
            check=False,
        )
        if result.returncode != 0:
            print(f"[dispatch] claude -p exit {result.returncode}: {result.stderr.strip()}", file=sys.stderr)
        return result.stdout.strip()
    except FileNotFoundError:
        print("[dispatch] `claude` CLI not found in PATH", file=sys.stderr)
        return ""
    except subprocess.TimeoutExpired:
        print("[dispatch] claude -p timed out", file=sys.stderr)
        return ""


def prepend_to_dashboard(dashboard_path: Path, archive_path: Path, new_blocks: str, session: int) -> None:
    dashboard_path.parent.mkdir(parents=True, exist_ok=True)
    head = DASHBOARD_HEAD.format(n=session)
    existing = ""
    if dashboard_path.exists():
        existing = dashboard_path.read_text(encoding="utf-8")
        if existing.startswith(head):
            existing = existing[len(head):]
    combined = new_blocks.strip() + "\n\n" + existing.strip() + "\n"
    blocks = re.split(r"\n(?=##\s+\d{2}:\d{2}:\d{2}\s)", combined.strip())
    blocks = [b for b in blocks if b.strip()]
    keep = blocks[:DASHBOARD_MAX_ITEMS]
    overflow = blocks[DASHBOARD_MAX_ITEMS:]
    dashboard_path.write_text(head + "\n\n".join(keep) + "\n", encoding="utf-8")
    if overflow:
        archive_path.parent.mkdir(parents=True, exist_ok=True)
        archive_existing = archive_path.read_text(encoding="utf-8") if archive_path.exists() else f"# Session {session} — Dashboard Archive\n\n"
        archive_path.write_text(archive_existing + "\n\n" + "\n\n".join(overflow) + "\n", encoding="utf-8")


def is_paused(session_dir_path: Path) -> bool:
    return (session_dir_path / ".dashboard_paused").exists()


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--session", type=int, required=True)
    ap.add_argument("--batch-seconds", type=float, default=30.0)
    ap.add_argument("--model", default="claude-sonnet-4-6")
    ap.add_argument("--correction-model", default="claude-haiku-4-5-20251001")
    ap.add_argument("--allowed-tools", default="Read")
    ap.add_argument("--vault", default=str(VAULT_ROOT))
    args = ap.parse_args()

    vault = Path(args.vault)
    sess = args.session
    sdir = session_dir(vault, sess)
    transcript = sdir / "Live Transcript.md"
    dashboard = sdir / "Live Dashboard.md"
    archive = sdir / "Live Dashboard Archive.md"
    active_context = load_active_context(vault, sess)

    matchers = {
        "aho": AhoMatcher(CACHE_DIR),
        "phonetic": PhoneticMatcher(CACHE_DIR, active_context),
        "rules": RulesRegexMatcher(CACHE_DIR),
        "embeddings": None,
    }
    try:
        em = EmbeddingMatcher(CACHE_DIR)
        if em._ready:
            matchers["embeddings"] = em
    except Exception as e:
        print(f"[dispatch] embeddings unavailable: {e}", file=sys.stderr)

    snippets = json.loads((CACHE_DIR / "gm_snippets.json").read_text(encoding="utf-8"))

    if not dashboard.exists():
        dashboard.write_text(DASHBOARD_HEAD.format(n=sess), encoding="utf-8")

    print(f"[dispatch] watching {transcript}", file=sys.stderr)
    print(f"[dispatch] batching every {args.batch_seconds}s -> {args.model}", file=sys.stderr)
    print(f"[dispatch] active scene NPCs: {active_context.get('scene_npcs', [])}", file=sys.stderr)

    event_queue: list[Event] = []
    correction_queue: list[Event] = []
    transcript_window: deque[str] = deque(maxlen=12)
    recent_events: deque = deque()
    stop_flag = {"stop": False}

    last_flush = time.time()
    for line in tail_lines(transcript, lambda: stop_flag["stop"]):
        m = LINE_RE.match(line)
        if not m:
            continue
        ts, text = m.group(1), m.group(2)
        transcript_window.append(line)
        events = detect(text, ts, matchers)
        events = dedupe(events, recent_events)
        for e in events:
            if e.kind == "correction":
                correction_queue.append(e)
            else:
                event_queue.append(e)

        now = time.time()
        if now - last_flush >= args.batch_seconds:
            if is_paused(sdir):
                last_flush = now
                event_queue.clear()
                correction_queue.clear()
                continue
            if event_queue:
                prompt = build_batch_prompt(
                    event_queue, list(transcript_window), snippets, active_context
                )
                output = call_claude(
                    prompt,
                    PROMPTS_DIR / "dashboard_system.md",
                    args.model,
                    args.allowed_tools,
                )
                if output:
                    prepend_to_dashboard(dashboard, archive, output, sess)
                event_queue.clear()
            if correction_queue:
                cprompt = "Likely transcription errors:\n" + "\n".join(
                    f"- heard: \"{e.extra.get('heard', '')}\" near \"{e.span}\" "
                    f"(active candidates: {e.canonical})"
                    for e in correction_queue
                )
                coutput = call_claude(
                    cprompt,
                    PROMPTS_DIR / "correction_system.md",
                    args.correction_model,
                    "Read",
                )
                if coutput:
                    prepend_to_dashboard(dashboard, archive, coutput, sess)
                correction_queue.clear()
            last_flush = now

    return 0


if __name__ == "__main__":
    try:
        sys.exit(main())
    except KeyboardInterrupt:
        print("\n[dispatch] interrupted.", file=sys.stderr)
        sys.exit(0)
