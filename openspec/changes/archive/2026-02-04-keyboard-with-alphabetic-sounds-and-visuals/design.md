## Context

This is a standalone educational web application for young children to learn alphabet recognition through keyboard interaction. Parents need a safe, distraction-free environment where kids can press keyboard keys and receive immediate audio-visual feedback. The app must prevent accidental exits through password protection while maintaining a simple, engaging experience.

**Current State**: New standalone feature with no existing codebase dependencies.

**Constraints**:
- Must work in modern browsers (Chrome, Firefox, Safari, Edge)
- No external authentication system (password stored locally)
- Must be accessible without installation (runs directly in browser)
- Child-friendly design with minimal complexity

## Goals / Non-Goals

**Goals:**
- Create an engaging, educational keyboard learning experience for preschool-aged children
- Provide immediate audio-visual feedback for each letter keystroke
- Implement robust fullscreen mode with parental control to keep kids engaged
- Ensure cross-browser audio compatibility
- Design premium, child-friendly UI with animations and vibrant colors

**Non-Goals:**
- Multi-user authentication or cloud-based parent accounts
- Progress tracking or learning analytics
- Support for numbers, symbols, or special characters (alphabet only)
- Mobile/touch keyboard support (physical keyboard required)
- Server-side components or database

## Decisions

### 1. Technology Stack: Vanilla HTML/CSS/JavaScript

**Decision**: Use vanilla web technologies without frameworks.

**Rationale**: 
- Simplicity: Single-file or minimal-file app that's easy to deploy and maintain
- Performance: No framework overhead, instant load times
- Portability: Can be opened directly from filesystem or hosted anywhere
- No build process: Parents can simply open index.html in a browser

**Alternatives Considered**:
- React/Vue: Too heavy for this simple use case, adds unnecessary complexity
- Web Audio API vs HTML5 Audio: Will use HTML5 `<audio>` elements for simplicity, with Web Audio API as fallback if needed

### 2. Audio Strategy: Pre-loaded HTML5 Audio Elements

**Decision**: Use HTML5 `<audio>` elements with preloading for all 26 letters.

**Rationale**:
- Instant playback: All audio preloaded on page load
- Browser compatibility: HTML5 audio widely supported
- Simple implementation: No external libraries needed

**Implementation**:
- 26 audio files (A.mp3 through Z.mp3) sourced or generated via TTS/AI
- Audio elements created programmatically and preloaded
- Format: MP3 for broad compatibility

**Alternatives Considered**:
- Web Audio API: More powerful but overkill for simple playback
- Lazy loading: Would cause delays on first keystroke
- Text-to-Speech API: Browser support inconsistent, requires internet

### 3. Visual Content Strategy: Multiple Examples per Letter

**Decision**: Display 2-3 visual examples per letter (word + image), rotating or showing simultaneously.

**Rationale**:
- Educational value: Multiple associations strengthen learning
- Engagement: Variety keeps children interested
- Example: "D for Dog 🐕", "D for Dinosaur 🦕", "D for Duck 🦆"

**Implementation**:
- Use emoji or generated images for visual representatives
- Show letter in large, bold typography with examples below
- Smooth animations when switching between letters

**Alternatives Considered**:
- Single example per letter: Less educational value
- Stock photos: Adds complexity in sourcing/licensing
- Icon fonts: Emoji provide simpler, built-in solution

### 4. Fullscreen & Password Protection Architecture

**Decision**: Use Fullscreen API with localStorage-based password protection.

**Rationale**:
- Fullscreen API: Native browser support, one-click activation
- localStorage: Persist password across sessions without server
- Escape key override: Intercept ESC key to show password modal instead of exiting fullscreen

**Implementation**:
```
Timers:
1. Timers should be registered within the Global Timer Manager upon component mounting to ensure cleanup on unmount.
2. **Password Timeout Policy**: 
    - **Initialization**: On `PasswordScreen` visibility, register a 10-second ($t = 10s$) countdown.
    - **Execution**: Upon `Timer.onComplete`, the system must:
        - Call `AuthManager.dismiss()` to close the password prompt.
        - Dispatch `UI_Action.SET_FULLSCREEN(true)`.
    - **Invalidation**: If `onPasswordSubmit` is triggered before $t = 0$, the timer must be explicitly cleared to prevent memory leaks and unintended transitions.

Window Management:
1. Full-screen mode should be requested via the Browser/System API after the DOM has updated to reflect the removal of the password overlay.

Parent Flow:
1. On first launch, prompt to set a 4-digit PIN
2. Store hashed PIN in localStorage
3. "Enter Fullscreen" button activates fullscreen mode

Child/Exit Flow:
As we can not force the browser to stay in fullscreen mode, we will use the following approach:

1. ESC key pressed → Show password modal overlay with a timer.
   1.1: The timer should be 10 seconds.
   1.2: If no password is submitted, show "Press any key to resume" after timer expires.
   1.3: Show the timer to the user.
   1.4: Pressing any key will re-trigger fullscreen mode.
2. Correct PIN → all good!
3. Wrong PIN → go fullscreen mode again!
4. After going fullscreen mode, hide the password modal as it is no longer needed.
5. After exiting from fullscreen, go back to home/main screen.

**IMPORTANT**: There is no cancel button in the password modal. There is only the submit button in the password modal.
```

**Security Considerations**:
- Simple hashing (SHA-256) to avoid plain-text storage
- 4-digit PIN for ease of parent use (not high-security scenario)
- Reset mechanism: Clear localStorage to reset password

**Alternatives Considered**:
- Custom fullscreen div: Doesn't prevent browser UI access (F11, etc.)
- Session-based password: Would require re-entry every launch
- No password, just hidden exit button: Too easy for kids to discover

### 5. UI/UX Design: Premium, Child-Friendly Aesthetics

**Decision**: Vibrant gradient backgrounds, large typography, smooth animations, and character illustrations.

**Design Elements**:
- Large letter display (10-20vw font size)
- Colorful gradients (HSL-based, dynamic per letter)
- Bounce/scale animations on keystroke
- Smooth transitions between letters
- Emoji or illustrated characters for examples
- Dark mode optional (for evening use)

**Accessibility**:
- High contrast text
- Clear, readable fonts (e.g., 'Fredoka One', 'Bubblegum Sans' from Google Fonts)
- Audio feedback for all interactions

## Risks / Trade-offs

**[Risk]**: Browser blocks audio autoplay  
**→ Mitigation**: Require initial user interaction (e.g., "Start" button) to enable audio context. Explicitly request audio permission.

**[Risk]**: Password forgotten by parent  
**→ Mitigation**: Provide clear instructions to reset (clear browser localStorage for the site, or include a hidden reset button with instructions).

**[Risk]**: Child discovers how to close browser tab/window  
**→ Mitigation**: Cannot fully prevent without OS-level kiosk mode. Document that this is best-effort protection, suggest browser fullscreen (F11) before launching app.

**[Risk]**: Cross-browser fullscreen API inconsistencies  
**→ Mitigation**: Use vendor prefixes (webkitRequestFullscreen, etc.), test on major browsers.

**[Trade-off]**: Pre-loading all 26 audio files increases initial load time  
**→ Accepted**: Better to have slight upfront delay (few seconds) vs lag during child interaction.

**[Trade-off]**: localStorage password is not cryptographically secure  
**→ Accepted**: This is parental control for young children, not security for sensitive data. Simple hashing suffices.

## Migration Plan

Not applicable - this is a new standalone application with no existing users or data to migrate.

**Deployment**:
1. Host on static site (e.g., Netlify, Vercel, GitHub Pages) or include in existing project as `/kids-keyboard` route
2. No database or backend setup required
3. Rollback: Simply remove or hide the page

## Open Questions

1. **Audio sourcing**: Should we generate alphabet audio using AI TTS (e.g., OpenAI TTS, ElevenLabs) or source from free educational libraries?
   - **Recommendation**: Use AI TTS with friendly, clear child voice for consistency

2. **Example word selection**: Pre-defined list of 2-3 examples per letter, or allow customization?
   - **Recommendation**: Start with curated list (common, child-friendly words), consider customization in v2

3. **Analytics**: Should we track which letters are pressed most (localStorage only, no external tracking)?
   - **Recommendation**: Skip for v1, keep it simple
