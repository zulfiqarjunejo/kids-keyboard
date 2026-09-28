# Proposal

## Why

The current alphabet experience shows several examples at once and plays an isolated letter sound. A single prominent example paired with a natural spoken sequence will give children clearer, more focused letter-to-word practice.

## What Changes

- Use three examples for each letter A-Z, including the user's supplied choices where provided.
- When a letter is selected, choose one example from its three-word set and show only that example's prominent, scalable emoji; do not show example boxes or a list.
- Keep the selected uppercase letter prominent; play audio on letter-key selection without displaying a sound icon.
- Play a natural spoken sequence: the letter sound, a short pause, “for,” a longer pause, then the example word. Reveal the matching picture when the example word is spoken.
- Use one continuous, locally generated Kokoro voice utterance for each letter/example pair, with a clear example-word cue for picture reveal.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `alphabet-audiovisual-content`: Replace multiple simultaneously displayed examples and isolated letter playback with one selected example, synchronized picture reveal, and a spoken letter-to-word sequence.

## Impact

- `kids-keyboard/alphabet-content.js`: alphabet example data and corresponding visual content.
- `kids-keyboard/app.js` and `kids-keyboard/index.html`: alphabet presentation and synchronized audio playback.
- `kids-keyboard/assets/audio/`: generated Kokoro alphabet voice audio assets and cue metadata.
- `kids-keyboard/styles.css`: responsive emoji sizing for the featured example.
- Local Kokoro model and voice files are required for generation; synthesis does not use a runtime API.
- Existing digit learning behavior remains out of scope.
