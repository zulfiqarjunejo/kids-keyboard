# Tasks

## 1. Alphabet Example Data

- [x] 1.1 Replace the alphabet example mapping with the three specified words for every letter A-Z, add one recognizable emoji per word, and add tests verifying exact coverage, order, and uniqueness against the spec.

## 2. Kokoro Audio Assets

- [x] 2.1 Add a reproducible local Kokoro asset-generation utility that creates one natural phoneme-sequence phrase per letter-example pair and records the example-word cue time; verify using a mocked synthesis engine and document local model setup.
- [x] 2.2 Generate and add browser-compatible phrase tracks and cue metadata for the active letter-example set using the approved `af_heart` voice; verify the manifest contains one valid track and cue for every active pair and listen-check phrase order, pause timing, and cue placement.

## 3. Learning Screen and Playback

- [x] 3.1 Replace the multi-example display with a prominent letter and one large example visual with its word label; reveal the example only at its audio cue and add UI tests confirming no other examples or boxes appear.
- [x] 3.2 Implement ordered per-letter example rotation, interruptible phrase playback, and cue cancellation for stale playback; add tests for repeat selection, letter changes mid-phrase, and synchronized picture reveal.
- [x] 3.3 Update audio preload accounting, progress and error reporting for alphabet tracks while preserving digit audio and behavior; add tests for successful preload, missing alphabet tracks, and unchanged digit support.
- [x] 3.4 Display each selected example as a large responsive emoji; preserve the fixed letter-header row and verify emoji scaling and stable positioning on reveal.
- [x] 3.5 Limit each letter to three examples, applying the supplied final choices for A-G; verify the data and phrase-audio selection use the same set.

## 4. Integration Verification

- [x] 4.1 Run the project test suite and verify all active phrase tracks load, emoji reveal uses the example cue, emoji sizing and replay-control labels are accessible, missing audio is reported, and existing digit learning remains unchanged; listen-check the approved sample and representative generated phrases.
