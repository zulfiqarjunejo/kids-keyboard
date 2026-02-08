# Proposal: simple-flow

## Why

The current home screen features two buttons—"Start Learning" and "Full Screen"—which provide redundant functionality and confuse users. "Start Learning" is the primary action, and the application is designed to be experienced in full-screen mode to prevent accidental exits. By removing the separate full-screen button and making full-screen the default for learning mode, we simplify the user interface and clarify the path to start the app.

## What Changes

- **UI Modification**: Remove the `fullscreenButton` element from the `welcomeScreen` in `index.html`.
- **Logic Cleanup**: Remove references and event listeners for the `fullscreenButton` in `app.js`.
- **Refinement**: Maintain and ensure the `startButton` correctly triggers both the transition to the learning screen and the request for full-screen mode.

## Capabilities

### New Capabilities
- `unified-learning-entry`: A single, simplified entry point into the learning experience that automatically engages full-screen mode.

### Modified Capabilities
- None: This change primarily removes redundancy rather than modifying existing functional requirements of the learning mode itself.

## Impact

- **UI**: cleaner home screen with one primary call-to-action.
- **Code**: Removal of redundant DOM references and event listeners in `app.js`.
- **UX**: Reduced cognitive load for users upon launching the application.
