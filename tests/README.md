# 🧪 Tests Documentation

This directory contains automated tests for the **ABC Keyboard Fun** web application. We use **Playwright** for browser automation and **pytest** as the test runner.

## 📋 Prerequisites

To run the tests, you need to have Python and the necessary dependencies installed:

```bash
# Install playwright, pytest, and the playwright-pytest plugin
python3 -m pip install playwright pytest pytest-playwright requests

# Install the necessary browser binaries (Chromium)
python3 -m playwright install chromium
```

## 🚀 Running Tests

### Run all tests
```bash
python3 -m pytest
```

### Run a specific test file
```bash
python3 -m pytest tests/test_learning_mode.py
```

### Run tests in Headed mode (see the browser)
```bash
python3 -m pytest --headed
```

### Run tests with verbose output
```bash
python3 -m pytest -v
```

## 📂 Directory Structure

- `conftest.py`: Contains shared fixtures, including the `local_server` fixture which automatically starts/stops a Python HTTP server for testing.
- `test_startup.py`: Verifies that the app loads correctly without console errors and bypasses the initial loading screen.
- `test_learning_mode.py`: Validates screen transitions and ensures both "Start Learning" and "Enter Fullscreen" buttons trigger the Fullscreen API.

## 💡 Notes on Fullscreen Testing

In **headless** environments (like some CI runners), the browser may restrict the actual OS-level fullscreen transition. The tests handle this by checking both the `document.fullscreenElement` (for headed runs) and the internal `AppState.isFullscreen` (as a reliable proxy in headless runs).
