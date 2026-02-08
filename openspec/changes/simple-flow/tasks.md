## 1. UI Cleanup

- [x] 1.1 Remove the `fullscreenButton` from `kids-keyboard/index.html`.

## 2. Logic Refactoring

- [x] 2.1 Remove the `fullscreenButton` reference from the `elements` object in `kids-keyboard/app.js`.
- [x] 2.2 Remove the redundant initialization of `elements.fullscreenButton` in `initDOMReferences()`.
- [x] 2.3 Remove the click event listener for `fullscreenButton` in `attachEventListeners()`.

## 3. Verification

- [x] 3.1 Verify that the Home Screen only shows the "Start Learning" button.
- [x] 3.2 Verify that clicking "Start Learning" triggers both fullscreen mode and the transition to the learning interface.
