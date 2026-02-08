## Context

The current home screen (`welcomeScreen`) presents users with two buttons: **Start Learning** and **Enter Fullscreen**. Both buttons effectively perform the same actions: requesting fullscreen mode and transitioning to the **Learning Screen**. This redundancy causes cognitive load and confusion for users. Additionally, the application is intended to be used in fullscreen to prevent toddlers from accidentally exiting the app.

## Goals / Non-Goals

**Goals:**
- Provide a single, clear call-to-action for starting the application.
- Enforce full-screen mode by default when learning starts.
- Simplify the home screen UI by removing redundant elements.

**Non-Goals:**
- Removing the ability to exit fullscreen (the PIN-protected exit mechanism remains unchanged).
- Changing the layout or functionality of the learning screen itself.

## Decisions

- **Remove `fullscreenButton`**: This element will be removed from `index.html`.
- **Cleanup `app.js`**: All references to `elements.fullscreenButton`, including its initialization and event listener attachment, will be removed.
- **Unify Flow**: The `startButton` will be the sole entry point, continuing to trigger `enterFullscreen()` and `showLearningScreen()`.

## Risks / Trade-offs

- **Risk**: Some browsers may block automatic fullscreen requests if not triggered by a clear user gesture. Since the `startButton` is a user gesture, this risk is minimal and consistent with the current implementation.
- **Trade-off**: Users no longer have the choice to enter learning mode *without* fullscreen, but this aligns with the design requirement that learning mode should always be immersive and protected.
