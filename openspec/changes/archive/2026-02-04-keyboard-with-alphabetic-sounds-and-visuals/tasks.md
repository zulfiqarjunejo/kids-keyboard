## 1. Project Setup

- [x] 1.1 Create HTML file structure (index.html) with semantic markup
- [x] 1.2 Create CSS file (styles.css) for child-friendly UI design
- [x] 1.3 Create JavaScript file (app.js) for application logic
- [x] 1.4 Set up directory structure for audio assets (/assets/audio/)
- [x] 1.5 Set up directory structure for data (alphabet-content.js with emoji/words mapping)

## 2. Audio Asset Generation & Integration

- [x] 2.1 Generate or source audio files for all 26 letters (A.mp3 through Z.mp3)
- [x] 2.2 Implement audio pre-loading system in JavaScript
- [x] 2.3 Create HTML5 audio elements programmatically for each letter
- [x] 2.4 Add loading progress indicator for audio files
- [x] 2.5 Implement error handling for failed audio loads
- [x] 2.6 Test audio playback across Chrome, Firefox, Safari, Edge

## 3. Alphabet Content Data

- [x] 3.1 Create data structure mapping each letter to 2-3 example words and emoji
- [x] 3.2 Populate example content for all 26 letters (e.g., D → Dog 🐕, Dinosaur 🦕, Duck 🦆)
- [x] 3.3 Ensure emoji/images are child-friendly and universally recognizable

## 4. Keyboard Interaction Implementation

- [x] 4.1 Implement keyboard event listener for keydown events
- [x] 4.2 Filter and normalize letter key detection (A-Z, case-insensitive)
- [x] 4.3 Ignore non-letter keys (numbers, symbols, function keys)
- [x] 4.4 Prevent default browser behavior for captured keys
- [x] 4.5 Implement audio restart on repeat key press
- [x] 4.6 Test keyboard detection consistency across browsers

## 5. Audio-Visual Synchronization

- [x] 5.1 Implement function to play letter audio on keystroke
- [x] 5.2 Implement function to update visual display on keystroke
- [x] 5.3 Ensure audio and visual updates trigger within 50-100ms
- [x] 5.4 Add smooth transition animations between letter displays
- [x] 5.5 Implement audio interruption logic (stop previous, play new)

## 6. Visual Display & Animations

- [x] 6.1 Design large letter display component (10-20vw font size)
- [x] 6.2 Design example words display with emoji/images
- [x] 6.3 Implement vibrant gradient backgrounds (HSL-based, dynamic per letter)
- [x] 6.4 Add bounce/scale animations on keystroke
- [x] 6.5 Implement smooth transitions between letters
- [x] 6.6 Import child-friendly Google Fonts (e.g., Fredoka One, Bubblegum Sans)
- [x] 6.7 Ensure high contrast and readability

## 7. Password Setup & Storage

- [x] 7.1 Implement first-launch detection (check localStorage for existing password)
- [x] 7.2 Create password setup modal UI (4-digit PIN input)
- [x] 7.3 Implement PIN validation (must be exactly 4 numeric digits)
- [x] 7.4 Implement SHA-256 hashing for PIN storage
- [x] 7.5 Store hashed PIN in localStorage
- [x] 7.6 Prevent app activation until password is set

## 8. Fullscreen Mode Implementation

- [x] 8.1 Create "Enter Fullscreen" button UI
- [x] 8.2 Implement fullscreen request using Fullscreen API with vendor prefixes
- [x] 8.3 Handle browser fullscreen permission requests
- [x] 8.4 Display error message if fullscreen is denied
- [x] 8.5 Test fullscreen activation on Chrome, Firefox, Safari, Edge

## 9. Password-Protected Exit

- [x] 9.1 Intercept ESC key press event
- [x] 9.2 Prevent default fullscreen exit behavior on ESC
- [x] 9.3 Create password entry modal UI overlay
- [x] 9.4 Implement 4-digit PIN input field with masking (dots/asterisks)
- [x] 9.5 Add Submit and Cancel buttons to password modal
- [x] 9.6 Implement password verification against stored hash
- [x] 9.7 Exit fullscreen on correct password
- [x] 9.8 Display error message and shake animation on incorrect password
- [x] 9.9 Remove Cancel button (Design Update: no cancellation allowed)
- [x] 9.10 Test ESC key interception across all browsers

## 10. Password Reset Mechanism

- [x] 10.1 Add help text/instructions for password reset in UI
- [x] 10.2 Document localStorage.clear() method for emergency reset
- [x] 10.3 Ensure app detects missing password and prompts re-setup after reset

## 11. Cross-Browser Compatibility

- [x] 11.1 Test full application flow on Chrome (latest)
- [ ] 11.2 Test full application flow on Firefox (latest)
- [ ] 11.3 Test full application flow on Safari (latest)
- [ ] 11.4 Test full application flow on Edge (latest)
- [ ] 11.5 Fix any browser-specific issues with Fullscreen API
- [ ] 11.6 Fix any browser-specific audio playback issues

## 12. UI Polish & Accessibility

- [x] 12.1 Implement responsive design (works on various screen sizes)
- [x] 12.2 Add dark mode option for evening use
- [x] 12.3 Ensure all interactive elements have clear focus states
- [x] 12.4 Test color contrast for accessibility
- [x] 12.5 Add initial "Start" button to enable audio context (bypass browser autoplay blocks)

## 13. Documentation & Deployment

- [x] 13.1 Create README with setup instructions for parents
- [x] 13.2 Document password reset procedure
- [x] 13.3 Add deployment instructions (static hosting options)
- [ ] 13.4 Test deployed version on hosting platform (Netlify/Vercel/GitHub Pages)

## 14. Enhanced Security (Design Update)

- [x] 14.1 Capture fullscreen exit events (via ESC or browser UI) and show password modal if not authorized.
- [x] 14.2 Modify `verifyExitPin`: on incorrect PIN, attempt to re-enter fullscreen.
- [x] 14.3 Implement `GlobalTimerManager` class for centralized timer handling.
- [x] 14.4 Implement `AuthManager` class for handling password modal state and dismissal.
- [x] 14.5 Implement `UI_Action` constant/object for defining fullscreen actions.
- [x] 14.6 Refactor `app.js` to use `GlobalTimerManager`, `AuthManager`, and `UI_Action`.
- [x] 14.8 Implement "Timeout Fallback" UI in `index.html` (Hidden by default).
- [x] 14.9 Update `AuthManager` to switch to Fallback UI on timer complete.
- [x] 14.10 Implement global key listener to resume fullscreen from Fallback state.
- [x] 14.11 Verify flow: ESC -> Modal (Wait 10s) -> Fallback Logic -> Press Key -> Fullscreen.
