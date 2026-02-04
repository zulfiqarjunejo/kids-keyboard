## 1. Content and Data Structures

- [x] 1.1 Add `DIGIT_CONTENT` mapping to `alphabet-content.js` with counting examples for 0-9
- [x] 1.2 Update `getLetterGradient` in `alphabet-content.js` to provide distinct gradients for digits
- [x] 1.3 Export or expose `DIGIT_CONTENT` for use in the main application logic

## 2. State and Asset Loading

- [x] 2.1 Update `AppState.totalAudio` from 26 to 36 in `app.js`
- [x] 2.2 Refactor `preloadAudio` to load both alphabetic and digit audio assets from `assets/audio/`
- [x] 2.3 Update `updateLoadingProgress` to correctly report "X / 36 items loaded"

## 3. Keyboard Interaction Logic

- [x] 3.1 Update `handleKeyPress` in `app.js` to recognize digit keys (0-9)
- [x] 3.2 Implement random selection logic: create a helper to pick a random character from [A-Z, 0-9]
- [x] 3.3 Update `handleKeyPress` to trigger the random selection when a non-alphanumeric key is pressed
- [x] 3.4 Ensure `event.preventDefault()` is called for all captured interactive keys (including random fallback)

## 4. UI and Audio Feedback

- [x] 4.1 Update `showLetter` (or create `showContent`) to handle rendering of both letters and digits
- [x] 4.2 Refactor `displayExamples` to support digit-based counting (e.g., repeating the emoji N times)
- [x] 4.3 Update `playLetterAudio` to handle playback of digit audio files
- [x] 4.4 Verify transition animations work smoothly for both letters and digits

## 5. Verification

- [x] 5.1 Verify all digits 0-9 display correct counting icons and play audio
- [x] 5.2 Verify pressing Space or Enter triggers a random letter or digit
- [x] 5.3 Verify loading screen correctly tracks all 36 assets
