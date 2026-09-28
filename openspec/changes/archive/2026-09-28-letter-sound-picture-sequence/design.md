# Design

## Context

See `proposal.md` for motivation and `specs/alphabet-audiovisual-content/spec.md` for the observable behavior. The app is a static HTML/CSS/JavaScript application: `alphabet-content.js` holds letter-to-example data, while `app.js` preloads audio and updates the learning screen. Existing visuals use emoji, and existing audio is served as local files rather than generated at runtime.

## Goals / Non-Goals

**Goals:**

- Keep the browser runtime independent of TTS credentials, network availability, and API behavior.
- Preserve natural phrasing while revealing the example visual at the spoken-word cue.
- Keep the alphabet feature self-contained and leave digit learning behavior unchanged.

**Non-Goals:**

- Generate speech dynamically in the browser.
- Add a carousel, simultaneous example list, or new navigation controls.
- Replace the app's digit content or digit audio.

## Decisions

### Generate a complete Kokoro utterance for each letter-example pair

Generate 78 static voice tracks (26 letters × 3 examples) locally with Kokoro ONNX, using a single continuous phoneme sequence for the letter name, “for,” and the example word. The approved voice and delivery are the `af_heart` sample with an excited example word, no spoken “is,” a short pause after the letter, and a longer pause before the example. Include a cue time for the example word and store cue metadata alongside the audio assets.

At runtime, select the matching track and use its cue time to reveal the picture. The cue is estimated by synthesizing the identical utterance prefix ending immediately before the example word with the same Kokoro model, voice, and speed. Keep the utterance prefix intact in the full phrase; do not concatenate separately synthesized words, which sounded disconnected in the listening sample. The browser uses only generated static assets; no model runtime or API credentials are needed in the client.

ElevenLabs was considered but the selected library voice was not available through the account's API plan. Cloud TTS APIs were also considered; local Kokoro reuses the already cached model and avoids account entitlements, credentials, network access, and per-request costs. A single phrase without cue metadata was rejected because it cannot synchronize the visual reveal.

### Keep audio and cue metadata as local, keyed assets

Key each active phrase asset and its cue by letter and example identifier, using a consistent naming convention and browser-compatible WAV format. Extend the existing loading/progress flow to account for 78 phrase tracks while preserving the current 10 digit tracks. Missing tracks or invalid cue metadata must be surfaced as loading errors, not silently substituted with unrelated audio.

Preloading all phrase tracks follows the existing app's loading-before-interaction model and makes the selected phrase available immediately. The additional payload is a trade-off; use mono 16-bit PCM at the model's 24 kHz sample rate and avoid unnecessarily long silence or excess duration.

### Use one featured visual and a per-letter example cycle

Keep the letter content mapping as the source of words and use the associated Unicode emoji for each example. Show one emoji at a time, with its word label, in the existing learning area; reveal both at the example-word cue. Scale the emoji with responsive CSS font sizing in a fixed area so it remains prominent without moving the letter header. Do not construct an example box, grid, or list.

Use a fixed grid row for the letter and sound control, with the image occupying a separate reserved row. Hiding or revealing the image must not change the letter row's dimensions or position.

Advance through the three examples in their supplied order on repeated selection of the same letter, maintaining a separate index per letter. This makes repeated practice predictable and ensures a child can encounter all three words; a random choice could repeat an item and obscure whether the set is being covered. This choice does not change digit selection or display.

### Treat each selection as an interruptible playback session

On selection, stop the previous phrase, update the prominent letter, hide the previous example, and start the chosen phrase. Schedule the reveal from that track's cue time. Associate the cue with the active playback so that a callback from an interrupted track cannot reveal a stale picture. If playback fails, report the failure through the existing error surface and do not claim that the example audio played.

The icon indicates the letter's sound and can replay the current sequence when activated; keyboard selection remains the primary interaction. The icon must be a real accessible control with a descriptive label, not a decorative symbol.

## Risks / Trade-offs

- [78 phrase tracks increase initial download time and memory use] → Encode concise speech assets, update progress to reflect the full asset set, and verify loading behavior on a typical connection and target device.
- [Kokoro v1.0 does not report phoneme timing; the prefix-duration cue may differ slightly from actual word onset in the full phrase] → Store per-track cue times and listen-check each phrase and reveal timing against the final rendered audio.
- [Some requested examples, especially words that do not begin with their listed letter, teach a sound rather than initial-letter correspondence] → Preserve the supplied list and make the intended ending /ks/ learning goal explicit for Fox, Box, and Six.
- [Emoji artwork can vary across platforms] → Use clear, widely supported Unicode emoji and keep the word label visible alongside the emoji.

## Migration Plan

1. Generate the 78 Kokoro phrase tracks and cue metadata locally, and extend example data without changing digit assets.
2. Use three emoji-backed examples for each letter and size the featured emoji responsively.
3. Update loading progress and the learning view to use the new tracks and single featured emoji.
4. Verify all letters and example cues, keyboard interruption, and existing digit learning.
5. Roll back by restoring the previous alphabet mapping, display, and audio loader; the digit content and assets remain independent.
