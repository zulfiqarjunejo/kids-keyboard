import json
import sys
from pathlib import Path
from types import SimpleNamespace
from unittest.mock import patch


SCRIPT_DIRECTORY = Path(__file__).parents[1] / "kids-keyboard" / "scripts"
sys.path.insert(0, str(SCRIPT_DIRECTORY))

import generate_alphabet_audio as generator


class FakeTokenizer:
    def phonemize(self, text, language):
        assert language == "en-us"
        return {
            "ay": "ˈeɪ",
            "bee": "ˈbiː",
            "for": "fɔːɹ",
            "Apple": "ˈæpəl",
        }.get(text, f"/{text.lower()}/")


class FakeEngine:
    tokenizer = FakeTokenizer()

    def create(self, text, voice, speed, lang, is_phonemes):
        assert voice == generator.VOICE
        assert speed == generator.SPEED
        assert lang == "en-us"
        assert is_phonemes
        return [0.0] * (24000 if text.endswith("...") else 48000), 24000


def test_load_dotenv_reads_values_without_overriding_existing_environment(tmp_path):
    env_file = tmp_path / ".env"
    env_file.write_text(
        "# local Kokoro configuration\n"
        "KOKORO_MODEL_PATH='model.onnx'\n"
        "export KOKORO_VOICE=af_heart # selected voice\n",
        encoding="utf-8",
    )
    environment = {"KOKORO_VOICE": "existing-voice"}

    generator.load_dotenv(env_file, environ=environment)

    assert environment["KOKORO_MODEL_PATH"] == "model.onnx"
    assert environment["KOKORO_VOICE"] == "existing-voice"


def test_example_source_has_three_ordered_words_per_letter():
    examples = generator.load_examples()
    spec_path = (
        Path(__file__).parents[1]
        / "openspec"
        / "specs"
        / "alphabet-audiovisual-content"
        / "spec.md"
    )
    spec_examples = {}
    for line in spec_path.read_text(encoding="utf-8").splitlines():
        if line.startswith("| ") and len(line) > 4 and line[2].isalpha():
            letter, words = line[2:-1].split(" | ", maxsplit=1)
            if len(letter) == 1 and letter.isupper():
                spec_examples[letter] = [word.strip() for word in words.split(",")]

    assert list(examples) == list("ABCDEFGHIJKLMNOPQRSTUVWXYZ")
    assert all(len(words) == 3 and len(set(words)) == 3 for words in examples.values())
    assert examples == spec_examples


def test_generate_phrase_uses_one_phoneme_sequence_without_is():
    audio, sample_rate, cue, phrase = generator.generate_phrase(
        FakeEngine(), "A", "Apple"
    )

    assert sample_rate == 24000
    assert len(audio) == 48000
    assert cue == 1.0
    assert phrase == "ˈeɪ, fɔːːɹ... ˈæpəl!"
    assert " is " not in phrase


def test_generate_assets_writes_local_wav_and_cue_metadata(tmp_path):
    fake_soundfile = SimpleNamespace(
        write=lambda path, audio, sample_rate, subtype, format: Path(path).write_bytes(b"wav-data")
    )
    with patch.dict(sys.modules, {"soundfile": fake_soundfile}):
        manifest_path = generator.generate_assets(
            FakeEngine(),
            tmp_path,
            examples={"A": ["Apple"]},
        )

    manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
    assert manifest["tracks"]["A:apple"] == {
        "file": "a-apple.wav",
        "word_start_seconds": 1.0,
        "sample_rate": 24000,
        "voice": "af_heart",
        "model": "kokoro-onnx",
    }
    assert (tmp_path / "a-apple.wav").read_bytes() == b"wav-data"
