---
tags:
  - gm-ai
  - runtime
  - setup
aliases:
  - Live Capture Setup
  - Live Session Setup
---

# Live Dashboard Setup

End-to-end install + usage guide for the at-table live capture pipeline.

## What it does

| Component | Output file | Purpose |
|-----------|-------------|---------|
| `live_capture.py` | `Sessions/Session N/Live Transcript.md` | Continuous Whisper transcription, timestamped lines |
| `event_dispatcher.py` | `Sessions/Session N/Live Dashboard.md` | Detected entity/rule mentions → batched `claude -p` → actionable dashboard entries |
| Overflow | `Sessions/Session N/Live Dashboard Archive.md` | Older dashboard items beyond the 10-entry rolling window |

The dashboard is what you glance at during play. The transcript is the raw artifact for post-session log generation.

## One-time install

```powershell
# 1. Install Python deps (Python 3.10+)
cd _Assets/Scripts
pip install -r requirements.txt

# 2. Verify Claude Code CLI is available (you should already have this)
claude --version

# 3. Confirm your mic shows up
pwsh ./Start-LiveSession.ps1 -ListDevices
```

The first run downloads:
- `faster-whisper` model `small.en` (~500MB) — set via `-WhisperModel` (`tiny.en` / `base.en` / `medium.en`)
- `sentence-transformers/all-MiniLM-L6-v2` (~90MB) for the semantic detector

## Per-session usage

```powershell
# Default: session 9, picks audio device on first run
pwsh _Assets/Scripts/Start-LiveSession.ps1 -Session 9

# Custom batch interval (faster on Max 20x; slower on Pro)
pwsh _Assets/Scripts/Start-LiveSession.ps1 -Session 9 -BatchSeconds 20

# Skip rebuilding the index (if you only edited transcripts, not entity cards)
pwsh _Assets/Scripts/Start-LiveSession.ps1 -Session 9 -SkipIndex
```

Open `Sessions/Session 9/Live Dashboard.md` in Obsidian. Live preview auto-refreshes as the dispatcher writes new entries.

## Controls during a session

| Action | How |
|--------|-----|
| Pause dashboard updates | `New-Item Sessions/Session 9/.dashboard_paused` (or `touch` on Mac/Linux) |
| Resume | Delete that file |
| Stop everything | Ctrl+C in the `Start-LiveSession.ps1` terminal |
| Rebuild index mid-session | Stop, then re-run without `-SkipIndex` |

## What gets detected (and how)

| Layer | Library | Catches | Cost |
|-------|---------|---------|------|
| 0. OOC filter | regex | "pass the chips," "bathroom break," `lol` | free |
| 1. Aho-Corasick | `pyahocorasick` | Explicit names + aliases from vault frontmatter | free, sub-ms |
| 2. Phonetic | `jellyfish` (Double Metaphone) | "Sarah" → Cere when Whisper mishears | free |
| 3. Semantic embeddings | `sentence-transformers` + `faiss-cpu` | "the noble house" → House Silva | local, ~100ms |
| 4. Rule patterns | regex | "how does compel work" → Compels and Fate Points | free |
| → Synthesis | `claude -p` (Sonnet) | Turns detected events into actionable dashboard entries | subscription |
| → Corrections | `claude -p` (Haiku) | Confirms phonetic corrections, drops false positives | subscription |

## Rate-limit notes (Claude Max plan)

- **Default batch interval: 30s.** Average session fires 50–100 Sonnet calls, well within Max 20x's 5-hour budget.
- **Max 5x**: tighten batch to 45s if you see throttling.
- **Pro plan**: raise batch to 60s and consider dropping embeddings.
- The dispatcher prints `[dispatch]` lines to stderr — watch for any 429 / rate-limit messages.

## Files this writes

```
_Assets/Cache/
  audio_device.json          # last-used mic index
  entity_index.json
  aliases.json
  phonetic_index.json
  gm_snippets.json
  rule_patterns.json
  ignore_terms.json          # edit by hand to suppress false positives
  embeddings.npy             # optional
  embeddings_meta.json       # optional
  faiss.index                # optional

Sessions/Session {N}/
  Live Transcript.md
  Live Dashboard.md
  Live Dashboard Archive.md
  .dashboard_paused          # toggle file (delete to resume)
```

## j5create JVU368 (360° conference webcam) — recommended placement

- Center of the table, ~1m from each speaker.
- Disable Windows audio "enhancements" if you see transcript artifacts (Settings → Sound → Properties → Enhancements).
- The 360° array's built-in echo cancellation and noise suppression is usually a net positive for Whisper.

## Troubleshooting

**No dashboard entries appearing.**
- Check that `Live Transcript.md` is gaining new lines — if not, mic or Whisper issue.
- Try `--model base.en` (faster on slower machines).
- Watch the dispatcher stderr for `[dispatch] claude -p exit N` errors.

**False positives flooding the dashboard.**
- Edit `_Assets/Cache/ignore_terms.json` — add the offending common word.
- Restart dispatcher (no need to rebuild index unless you also edited entity cards).

**Transcription mangling proper nouns badly.**
- Try a larger Whisper model (`-WhisperModel medium.en`).
- The phonetic + correction layer is designed to catch these; check `Live Dashboard.md` for 🔧 entries.

**`claude` not found.**
- The CLI must be on PATH. `Get-Command claude` should return a path.
- Run `claude login` if you haven't already.

## Post-session workflow

1. Stop the capture (Ctrl+C).
2. `Sessions/Session N/Live Transcript.md` now has the full timestamped run.
3. Use the existing `nova-praxis-gm` plugin's `/recap` or feed the transcript to Claude with your vault open to generate `Session N - Game Summary.md`.

## Related notes

- [[GM Dashboard]]
- [[GM AI/Claude Code - GM Runtime System]]
- [[Rules and Mechanics/Rules Quick Reference - Unified]]
