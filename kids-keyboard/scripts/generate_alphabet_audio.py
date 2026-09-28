#!/usr/bin/env python3
"""Generate local alphabet phrase tracks and word-reveal timings with Kokoro."""

import argparse
import json
import os
import re
import sys
from pathlib import Path


APP_ROOT = Path(__file__).resolve().parents[1]
CONTENT_FILE = APP_ROOT / "alphabet-content.js"
DEFAULT_OUTPUT_DIR = APP_ROOT / "assets" / "audio" / "alphabet"
DEFAULT_MODEL_DIR = Path.home() / ".cache" / "roll-for-goal" / "kokoro"
LETTER_NAMES = {
    "A": "ay",
    "B": "bee",
    "C": "see",
    "D": "dee",
    "E": "ee",
    "F": "ef",
    "G": "gee",
    "H": "aitch",
    "I": "eye",
    "J": "jay",
    "K": "kay",
    "L": "el",
    "M": "em",
    "N": "en",
    "O": "oh",
    "P": "pee",
    "Q": "cue",
    "R": "ar",
    "S": "ess",
    "T": "tee",
    "U": "you",
    "V": "vee",
    "W": "double u",
    "X": "ex",
    "Y": "why",
    "Z": "zee",
}
FOR_PHONEMES = "fɔːːɹ"
FIRST_PAUSE = 0.2
EXAMPLE_PAUSE = 0.8
VOICE = "af_heart"
SPEED = 0.9


def load_dotenv(env_file=APP_ROOT / ".env", environ=None):
    env_path = Path(env_file)
    if not env_path.is_file():
        return
    environment = os.environ if environ is None else environ

    for line_number, line in enumerate(env_path.read_text(encoding="utf-8").splitlines(), start=1):
        stripped = line.strip()
        if not stripped or stripped.startswith("#"):
            continue
        if stripped.startswith("export "):
            stripped = stripped[7:].lstrip()
        if "=" not in stripped:
            raise ValueError(f"Invalid .env entry on line {line_number}")

        name, value = stripped.split("=", maxsplit=1)
        name = name.strip()
        value = value.strip()
        if not re.fullmatch(r"[A-Za-z_][A-Za-z0-9_]*", name):
            raise ValueError(f"Invalid .env variable name on line {line_number}")
        if value[:1] in ("'", '"'):
            quote = value[0]
            if len(value) < 2 or value[-1] != quote:
                raise ValueError(f"Unclosed quoted value on .env line {line_number}")
            value = value[1:-1]
        else:
            value = value.split("#", maxsplit=1)[0].rstrip()
        environment.setdefault(name, value)


def load_examples(content_file=CONTENT_FILE):
    examples = {}
    row_pattern = re.compile(r"^\s{4}([A-Z]): \[(.*)\],?$")
    example_pattern = re.compile(r"\['([^']+)',\s*'[^']*'\]")

    for line in Path(content_file).read_text(encoding="utf-8").splitlines():
        match = row_pattern.match(line)
        if not match:
            continue
        letter, row = match.groups()
        examples[letter] = example_pattern.findall(row)

    if list(examples) != list("ABCDEFGHIJKLMNOPQRSTUVWXYZ"):
        raise ValueError("alphabet-content.js must define letters A-Z in order")
    if any(len(words) != 3 or len(set(words)) != 3 for words in examples.values()):
        raise ValueError("Every letter must have exactly three unique examples")
    return examples


def slugify(word):
    return re.sub(r"[^a-z0-9]+", "-", word.lower()).strip("-")


def letter_phonemes(engine, letter):
    if letter == "A":
        return "ˈeɪ"
    name = LETTER_NAMES[letter]
    return engine.tokenizer.phonemize(name, "en-us")


def word_phonemes(engine, word):
    return engine.tokenizer.phonemize(word, "en-us")


def generate_phrase(engine, letter, word, voice=VOICE, speed=SPEED):
    prefix = f"{letter_phonemes(engine, letter)}, {FOR_PHONEMES}..."
    example = word_phonemes(engine, word)
    phrase = f"{prefix} {example}!"
    audio, sample_rate = engine.create(
        phrase,
        voice=voice,
        speed=speed,
        lang="en-us",
        is_phonemes=True,
    )
    prefix_audio, prefix_sample_rate = engine.create(
        prefix,
        voice=voice,
        speed=speed,
        lang="en-us",
        is_phonemes=True,
    )
    if sample_rate != prefix_sample_rate or sample_rate <= 0:
        raise ValueError("Kokoro returned inconsistent audio sample rates")
    word_start_seconds = len(prefix_audio) / sample_rate
    if not 0 < word_start_seconds < len(audio) / sample_rate:
        raise ValueError(f"Invalid example-word timing for {letter} for {word}")
    return audio, sample_rate, word_start_seconds, phrase


def write_manifest(manifest_path, tracks):
    manifest_path.parent.mkdir(parents=True, exist_ok=True)
    temporary_path = manifest_path.with_suffix(".json.tmp")
    temporary_path.write_text(
        json.dumps({"version": 1, "tracks": tracks}, indent=2) + "\n",
        encoding="utf-8",
    )
    temporary_path.replace(manifest_path)


def generate_assets(engine, output_dir, voice=VOICE, speed=SPEED, limit=None, examples=None, force=False):
    import soundfile

    examples = load_examples() if examples is None else examples
    output_dir.mkdir(parents=True, exist_ok=True)
    manifest_path = output_dir / "manifest.json"
    if manifest_path.exists():
        existing = json.loads(manifest_path.read_text(encoding="utf-8"))
        tracks = existing.get("tracks", {})
    else:
        tracks = {}

    jobs = [(letter, word) for letter, words in examples.items() for word in words]
    if limit is not None:
        jobs = jobs[:limit]

    for index, (letter, word) in enumerate(jobs):
        key = f"{letter}:{slugify(word)}"
        filename = f"{letter.lower()}-{slugify(word)}.wav"
        audio_path = output_dir / filename
        previous = tracks.get(key, {})
        if (not force and previous.get("file") == filename and
                previous.get("word_start_seconds") is not None and
                audio_path.is_file()):
            continue

        audio, sample_rate, word_start_seconds, phonemes = generate_phrase(
            engine, letter, word, voice=voice, speed=speed
        )
        temporary_audio = audio_path.with_suffix(".wav.tmp")
        soundfile.write(temporary_audio, audio, sample_rate, subtype="PCM_16", format="WAV")
        temporary_audio.replace(audio_path)
        tracks[key] = {
            "file": filename,
            "word_start_seconds": word_start_seconds,
            "sample_rate": sample_rate,
            "voice": voice,
            "model": "kokoro-onnx",
        }
        write_manifest(manifest_path, tracks)
        print(f"Generated {key} ({index + 1}/{len(jobs)}): {phonemes}")
    return manifest_path


def main(argv=None):
    try:
        load_dotenv()
    except (OSError, ValueError) as error:
        print(f"Could not load .env file: {error}", file=sys.stderr)
        return 1

    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--output-dir", type=Path, default=DEFAULT_OUTPUT_DIR)
    parser.add_argument(
        "--model-path",
        type=Path,
        default=Path(os.environ.get(
            "KOKORO_MODEL_PATH", DEFAULT_MODEL_DIR / "kokoro-v1.0.onnx"
        )),
    )
    parser.add_argument(
        "--voices-path",
        type=Path,
        default=Path(os.environ.get(
            "KOKORO_VOICES_PATH", DEFAULT_MODEL_DIR / "voices-v1.0.bin"
        )),
    )
    parser.add_argument("--voice", default=os.environ.get("KOKORO_VOICE", VOICE))
    parser.add_argument("--speed", type=float, default=SPEED)
    parser.add_argument("--limit", type=int, help="Generate only the first N tracks")
    parser.add_argument("--preview", action="store_true", help="Generate only A for Apple")
    parser.add_argument("--force", action="store_true", help="Regenerate tracks even when files already exist")
    args = parser.parse_args(argv)

    if args.preview:
        args.output_dir.mkdir(parents=True, exist_ok=True)
        args.limit = 1
    if args.speed < 0.5 or args.speed > 2.0:
        parser.error("--speed must be between 0.5 and 2.0")
    if args.limit is not None and args.limit < 1:
        parser.error("--limit must be positive")
    if not args.model_path.is_file():
        parser.error(f"Kokoro model not found: {args.model_path}")
    if not args.voices_path.is_file():
        parser.error(f"Kokoro voices file not found: {args.voices_path}")

    try:
        from kokoro_onnx import Kokoro
        import soundfile  # noqa: F401

        engine = Kokoro(str(args.model_path), str(args.voices_path))
        if args.voice not in engine.get_voices():
            parser.error(f"Kokoro voice is not available: {args.voice}")
        examples = {"A": ["Apple"]} if args.preview else None
        manifest_path = generate_assets(
            engine, args.output_dir, args.voice, args.speed, args.limit, examples,
            force=args.force or args.preview,
        )
    except ImportError as error:
        print("Install generator dependencies: python3 -m pip install -r scripts/requirements.txt", file=sys.stderr)
        print(f"Missing dependency: {error}", file=sys.stderr)
        return 1
    except (OSError, ValueError, RuntimeError) as error:
        print(f"Kokoro audio generation failed: {error}", file=sys.stderr)
        return 1

    print(f"Manifest written to {manifest_path}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
