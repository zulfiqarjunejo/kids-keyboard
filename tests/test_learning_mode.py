from playwright.sync_api import Page, expect

def test_start_learning_fullscreen(page: Page, local_server):
    page.goto(local_server)
    page.wait_for_selector("#loadingScreen.hidden", timeout=15000)
    
    if page.is_visible("#passwordSetupModal:not(.hidden)"):
        page.locator("#setupPinInput").fill("1234")
        page.locator("#setupPinButton").click(force=True)
        page.wait_for_selector("#passwordSetupModal.hidden")
        
    expect(page.locator("#welcomeScreen")).to_be_visible()
    
    # Click "Start Learning" (id="startButton")
    page.locator("#startButton").click(force=True)
    
    # Screen should change to learning
    expect(page.locator("#learningScreen")).to_be_visible()
    
    # Check both the document state and our AppState
    is_fs_js = page.evaluate("() => document.fullscreenElement !== null")
    is_fs_app = page.evaluate("() => AppState.isFullscreen === true")
    
    # In headed mode, document.fullscreenElement should work.
    # In headless mode, we rely on AppState as the browser might block the actual transition.
    assert is_fs_js or is_fs_app, "The application did not enter fullscreen mode (JS API or AppState)."
