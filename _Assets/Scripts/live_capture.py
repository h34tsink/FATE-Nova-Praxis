"""Continuous audio capture -> faster-whisper transcription -> Live Transcript.md.

Runs as a long-lived process. Writes timestamped lines to:
    Sessions/Session {N}/Live Transcript.md

CLI:
    python live_capture.py --session 9 --device 5 --model small.en

Tunables (env or CLI):
    --chunk-seconds      audio chunk length fed to Whisper (default 8)
    --device             sounddevice input index (default: system default)
    --model              faster-whisper model size (default small.en)
    --language           language code (default en)
    --vault              vault root (default: auto-detect from script location)
"""

from __future__ import annotations

import argparse
import datetime as dt
import queue
import signal
import sys
import threading
import time
from pathlib import Path

import numpy as np

VAULT_ROOT = Path(__file__).resolve().parents[2]
SAMPLE_RATE = 16000


def session_dir(vault: Path, session: int) -> Path:
    return vault / "Sessions" / f"Session {session}"


def transcript_path(vault: Path, session: int) -> Path:
    return session_dir(vault, session) / "Live Transcript.md"


def init_transcript(path: Path, session: int) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    if not path.exists():
        path.write_text(
            f"# Session {session} — Live Transcript\n"
            f"> Auto-captured. Started {dt.datetime.now().isoformat(timespec='seconds')}.\n\n",
            encoding="utf-8",
        )


def fmt_ts(elapsed: float) -> str:
    return f"{int(elapsed // 3600):02d}:{int((elapsed % 3600) // 60):02d}:{int(elapsed % 60):02d}"


def list_devices() -> None:
    import sounddevice as sd
    print("Available audio input devices:")
    for i, d in enumerate(sd.query_devices()):
        if d["max_input_channels"] > 0:
            default = " (default)" if i == sd.default.device[0] else ""
            print(f"  [{i}] {d['name']}  — {d['max_input_channels']}ch @ {int(d['default_samplerate'])}Hz{default}")


def capture_loop(args: argparse.Namespace) -> int:
    import sounddevice as sd
    from faster_whisper import WhisperModel

    out_path = transcript_path(Path(args.vault), args.session)
    init_transcript(out_path, args.session)

    print(f"[capture] loading faster-whisper model={args.model}...", file=sys.stderr)
    model = WhisperModel(args.model, device="cpu", compute_type="int8")
    print(f"[capture] model ready. writing to {out_path}", file=sys.stderr)

    audio_q: queue.Queue[np.ndarray] = queue.Queue()
    stop = threading.Event()

    def on_audio(indata, frames, time_info, status):
        if status:
            print(f"[capture] sd status: {status}", file=sys.stderr)
        # Convert to mono float32 in [-1, 1]
        block = indata[:, 0] if indata.ndim > 1 else indata
        audio_q.put(block.copy())

    def writer():
        start_ts = time.time()
        buffer = np.zeros(0, dtype=np.float32)
        chunk_samples = int(args.chunk_seconds * SAMPLE_RATE)
        while not stop.is_set():
            try:
                block = audio_q.get(timeout=0.5)
            except queue.Empty:
                continue
            buffer = np.concatenate([buffer, block.astype(np.float32)])
            while len(buffer) >= chunk_samples:
                chunk = buffer[:chunk_samples]
                buffer = buffer[chunk_samples:]
                elapsed = time.time() - start_ts
                _transcribe_chunk(model, chunk, elapsed, out_path, args.language)

    def _shutdown(signum, frame):
        print(f"\n[capture] signal {signum}, stopping...", file=sys.stderr)
        stop.set()

    signal.signal(signal.SIGINT, _shutdown)
    signal.signal(signal.SIGTERM, _shutdown)

    writer_thread = threading.Thread(target=writer, daemon=True)
    writer_thread.start()

    try:
        with sd.InputStream(
            samplerate=SAMPLE_RATE,
            channels=1,
            dtype="float32",
            blocksize=int(SAMPLE_RATE * 0.5),
            device=args.device,
            callback=on_audio,
        ):
            print("[capture] recording. Ctrl+C to stop.", file=sys.stderr)
            while not stop.is_set():
                time.sleep(0.25)
    except Exception as e:
        print(f"[capture] stream error: {e}", file=sys.stderr)
        return 2

    writer_thread.join(timeout=5)
    print("[capture] stopped.", file=sys.stderr)
    return 0


def _transcribe_chunk(model, chunk: np.ndarray, elapsed: float, out_path: Path, language: str) -> None:
    # Skip near-silence
    rms = float(np.sqrt(np.mean(chunk ** 2)))
    if rms < 0.005:
        return
    try:
        segments, _info = model.transcribe(
            chunk,
            language=language,
            vad_filter=True,
            beam_size=1,
            condition_on_previous_text=False,
        )
        text = " ".join(seg.text.strip() for seg in segments).strip()
    except Exception as e:
        print(f"[capture] transcription error: {e}", file=sys.stderr)
        return
    if not text:
        return
    line = f"[{fmt_ts(elapsed)}] {text}\n"
    with out_path.open("a", encoding="utf-8") as f:
        f.write(line)


def main() -> int:
    ap = argparse.ArgumentParser(description="Continuous Whisper capture for Nova Praxis sessions")
    ap.add_argument("--session", type=int, help="Session number (creates Sessions/Session N/)")
    ap.add_argument("--device", type=int, default=None, help="sounddevice input index")
    ap.add_argument("--model", default="small.en", help="faster-whisper model (tiny.en/base.en/small.en/medium.en)")
    ap.add_argument("--language", default="en")
    ap.add_argument("--chunk-seconds", type=float, default=8.0)
    ap.add_argument("--vault", default=str(VAULT_ROOT))
    ap.add_argument("--list-devices", action="store_true")
    args = ap.parse_args()

    if args.list_devices:
        list_devices()
        return 0
    if args.session is None:
        ap.error("--session required (or use --list-devices)")
    return capture_loop(args)


if __name__ == "__main__":
    sys.exit(main())
