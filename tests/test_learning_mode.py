from playwright.sync_api import Page, expect

def test_enter_fullscreen_mode(page: Page, local_server):
    # Navigate to the app
    page.goto(local_server)
    
    # Wait for loading to finish and screen to be stable
    page.wait_for_selector("#loadingScreen.hidden", timeout=15000)
    
    # Check if we are on the PIN setup screen
    if page.is_visible("#passwordSetupModal:not(.hidden)"):
        # Set a PIN to proceed
        pin_input = page.locator("#setupPinInput")
        pin_input.wait_for(state="visible")
        pin_input.fill("1234")
        
        setup_btn = page.locator("#setupPinButton")
        setup_btn.wait_for(state="visible")
        setup_btn.click(force=True) # Use force to bypass stability issues during transitions
        
        # Wait for the modal to hide
        page.wait_for_selector("#passwordSetupModal.hidden")

    # Now we should be on the Welcome screen
    welcome = page.locator("#welcomeScreen")
    expect(welcome).to_be_visible()
    
    # Click the "Enter Fullscreen" button
    fullscreen_btn = page.locator("#fullscreenButton")
    fullscreen_btn.wait_for(state="visible")
    
    # In headless mode, we can't always trigger actual OS fullscreen,
    # but we can verify the JS state and call the logic.
    fullscreen_btn.click(force=True)
    
    # Assert that the learning screen is now visible
    expect(page.locator("#learningScreen")).to_be_visible()
    
    # Check both the document state and our AppState
    is_fs_js = page.evaluate("() => document.fullscreenElement !== null")
    is_fs_app = page.evaluate("() => AppState.isFullscreen === true")
    
    # In headed mode, document.fullscreenElement should work.
    # In headless mode, we rely on AppState as the browser might block the actual transition.
    assert is_fs_js or is_fs_app, "The application did not enter fullscreen mode (JS API or AppState)."

def test_start_learning_also_fullscreen(page: Page, local_server):
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
