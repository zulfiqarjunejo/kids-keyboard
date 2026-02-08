import re

from playwright.sync_api import Page, expect


def _stub_fullscreen_api(page: Page) -> None:
    page.evaluate(
        """
        () => {
            if (window.__fullscreenStubbed) {
                return;
            }

            window.__fullscreenStubbed = true;
            window.__fakeFullscreen = false;
            const doc = document;
            const element = doc.documentElement;

            const triggerEvents = () => {
                if (typeof window.handleFullscreenChange === 'function') {
                    window.handleFullscreenChange();
                } else {
                    doc.dispatchEvent(new Event('fullscreenchange'));
                }
            };

            const enter = () => {
                window.__fakeFullscreen = true;
                setTimeout(triggerEvents, 0);
                return Promise.resolve();
            };

            const exit = () => {
                window.__fakeFullscreen = false;
                setTimeout(triggerEvents, 0);
                return Promise.resolve();
            };

            element.requestFullscreen = enter;
            element.webkitRequestFullscreen = enter;
            element.mozRequestFullScreen = enter;
            element.msRequestFullscreen = enter;

            doc.exitFullscreen = exit;
            doc.webkitExitFullscreen = exit;
            doc.mozCancelFullScreen = exit;
            doc.msExitFullscreen = exit;

            const fullscreenDescriptor = {
                configurable: true,
                get() {
                    return window.__fakeFullscreen ? element : null;
                }
            };

            Object.defineProperty(doc, 'fullscreenElement', fullscreenDescriptor);
            Object.defineProperty(doc, 'webkitFullscreenElement', fullscreenDescriptor);
            Object.defineProperty(doc, 'mozFullScreenElement', fullscreenDescriptor);
            Object.defineProperty(doc, 'msFullscreenElement', fullscreenDescriptor);
        }
        """
    )


def _enter_learning_mode(page: Page, local_server: str) -> None:
    page.goto(local_server)
    page.wait_for_selector("#loadingScreen.hidden", timeout=15000)

    if page.is_visible("#passwordSetupModal:not(.hidden)"):
        page.locator("#setupPinInput").fill("1234")
        page.locator("#setupPinButton").click(force=True)
        page.wait_for_selector("#passwordSetupModal.hidden")

    _stub_fullscreen_api(page)

    expect(page.locator("#welcomeScreen")).to_be_visible()
    page.locator("#startButton").click(force=True)
    expect(page.locator("#learningScreen")).to_be_visible()


def test_start_learning_fullscreen(page: Page, local_server):
    _enter_learning_mode(page, local_server)

    # Check both the document state and our AppState
    is_fs_js = page.evaluate("() => document.fullscreenElement !== null")
    is_fs_app = page.evaluate("() => AppState.isFullscreen === true")

    # In headed mode, document.fullscreenElement should work.
    # In headless mode, we rely on AppState as the browser might block the actual transition.
    assert is_fs_js or is_fs_app, "The application did not enter fullscreen mode (JS API or AppState)."


def test_escape_exit_requires_pin(page: Page, local_server):
    _enter_learning_mode(page, local_server)

    assert page.evaluate("() => AppState.isFullscreen"), "App did not enter fullscreen before escape test"

    page.bring_to_front()
    page.keyboard.press("Escape")
    page.wait_for_selector("#passwordExitModal:not(.hidden)")

    expect(page.locator("#passwordExitModal .modal-content > p").first).to_contain_text("Enter your PIN")
    expect(page.locator("#exitPinInput")).to_have_attribute("maxlength", "4")

    page.locator("#exitPinInput").fill("1234")
    page.locator("#exitPinSubmit").click(force=True)
    
    # Verify transition to welcome screen (modal dismissal happens internally)
    expect(page.locator("#welcomeScreen")).to_be_visible(timeout=10000)


def test_correct_pin_returns_to_welcome_screen(page: Page, local_server):
    _enter_learning_mode(page, local_server)

    assert page.evaluate("() => AppState.isFullscreen"), "App did not enter fullscreen before escape test"

    page.bring_to_front()
    page.keyboard.press("Escape")
    page.wait_for_selector("#passwordExitModal:not(.hidden)")

    page.locator("#exitPinInput").fill("1234")
    page.locator("#exitPinSubmit").click(force=True)

    # Verify transition to welcome screen
    expect(page.locator("#welcomeScreen")).to_be_visible(timeout=10000)


def test_escape_wrong_pin_returns_to_learning(page: Page, local_server):
    _enter_learning_mode(page, local_server)

    page.bring_to_front()
    page.keyboard.press("Escape")
    page.wait_for_selector("#passwordExitModal:not(.hidden)")

    page.locator("#exitPinInput").fill("9999")
    page.locator("#exitPinSubmit").click(force=True)
    expect(page.locator("#passwordExitModal")).to_have_class(re.compile("hidden"))

    expect(page.locator("#learningScreen")).to_be_visible()
    assert page.evaluate("() => AppState.isFullscreen === true")


def test_escape_timeout_resumes_fullscreen(page: Page, local_server):
    _enter_learning_mode(page, local_server)

    page.evaluate(
        """
        () => {
            GlobalTimerManager.register = (id, duration, onTick, onComplete) => {
                GlobalTimerManager.clear(id);
                if (onTick) onTick(0);
                if (onComplete) onComplete();
            };
        }
        """
    )

    page.bring_to_front()
    page.keyboard.press("Escape")
    page.wait_for_selector("#passwordExitModal:not(.hidden)")
    expect(page.locator("#passwordExitModal .modal-content h2")).to_contain_text("Time Expired")

    page.keyboard.press("KeyA")
    expect(page.locator("#passwordExitModal")).to_have_class(re.compile("hidden"))

    expect(page.locator("#learningScreen")).to_be_visible()
    assert page.evaluate("() => AppState.isFullscreen === true")
