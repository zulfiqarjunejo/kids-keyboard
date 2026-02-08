from playwright.sync_api import Page, expect

def test_startup_no_errors(page: Page, local_server):
    # Collect console messages and page errors
    errors = []
    page.on("console", lambda msg: errors.append(msg.text) if msg.type == "error" else None)
    page.on("pageerror", lambda exc: errors.append(str(exc)))

    # Navigate to the app
    page.goto(local_server)
    
    # wait for networkidle to ensure everything is loaded
    page.wait_for_load_state("networkidle")

    # The app should start with a loading screen.
    # We wait for the loading screen (id="loadingScreen") to be hidden.
    # According to app.js, it preloads 36 assets and then hides the loading screen.
    page.wait_for_selector("#loadingScreen.hidden", timeout=15000)
    
    # After loading, either the welcome screen or the password setup modal should be visible.
    is_welcome_visible = page.is_visible("#welcomeScreen:not(.hidden)")
    is_setup_visible = page.is_visible("#passwordSetupModal:not(.hidden)")
    
    assert is_welcome_visible or is_setup_visible, "Neither the welcome screen nor the password setup modal became visible after loading."
    
    # Final check for any console errors that might have occurred during startup
    assert not errors, f"Startup console errors detected: {errors}"

if __name__ == "__main__":
    # This allows running the script directly if needed
    pytest.main([__file__, "-v"])
