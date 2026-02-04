## ADDED Requirements

### Requirement: Parent sets password on first launch
The system SHALL prompt parent to set a 4-digit PIN on first launch.

#### Scenario: First-time password setup
- **WHEN** parent opens the application for the first time
- **THEN** system SHALL display a password setup modal
- **THEN** system SHALL require a 4-digit numeric PIN
- **THEN** system SHALL store the hashed PIN in browser localStorage
- **THEN** system SHALL not proceed to fullscreen until password is set

#### Scenario: Invalid PIN during setup
- **WHEN** parent enters a non-4-digit value during setup
- **THEN** system SHALL display validation error
- **THEN** system SHALL require exactly 4 numeric digits

### Requirement: Enable fullscreen mode with one click
The system SHALL provide a button to activate fullscreen mode.

#### Scenario: Parent activates fullscreen
- **WHEN** parent clicks "Enter Fullscreen" button
- **THEN** system SHALL request browser fullscreen using Fullscreen API
- **THEN** system SHALL hide browser UI (address bar, tabs, bookmarks)
- **THEN** system SHALL display the alphabet learning interface in fullscreen
- **THEN** system SHALL intercept ESC key press
- **THEN** system SHALL display password modal and re-enter into fullscreen mode if password is incorrect.

#### Scenario: Browser denies fullscreen request
- **WHEN** browser blocks fullscreen request (e.g., user permission required)
- **THEN** system SHALL display message explaining fullscreen is needed
- **THEN** system SHALL provide retry button

### Requirement: Handle ESC key and Fullscreen Exit
The system SHALL display a password entry modal when the ESC key is pressed or fullscreen is exited, and attempt to restore fullscreen if unauthorized.

#### Scenario: Child presses ESC key
- **WHEN** ESC key is pressed while in fullscreen mode
- **THEN** system SHALL display password entry modal overlaying the content
- **THEN** system SHALL focus the password input field
- **THEN** (If browser exits fullscreen) system SHALL accept this state temporarily while modal is open

### Requirement: Validate password to exit fullscreen
The system SHALL verify entered PIN against stored hash before allowing fullscreen exit.

#### Scenario: Correct password entered
- **WHEN** parent enters the correct 4-digit PIN
- **THEN** system SHALL exit fullscreen mode
- **THEN** system SHALL close the password modal
- **THEN** system SHALL return to the Welcome/Home screen

#### Scenario: Incorrect password entered
- **WHEN** incorrect PIN is entered
- **THEN** system SHALL display "Incorrect password" message
- **THEN** system SHALL clear the password input
- **THEN** system SHALL animate the modal (shake effect) to indicate error
- **THEN** system SHALL re-request fullscreen mode (if it was exited)

#### Scenario: Timeout on password modal
- **WHEN** password modal is open
- **THEN** system SHALL register a 10s timer with the Global Timer Manager
- **THEN** system SHALL display a countdown timer showing remaining seconds
- **WHEN** timer completes (10s elapses) without correct PIN
- **THEN** Global Timer Manager SHALL trigger `AuthManager.showTimeoutFallback()`
- **THEN** system SHALL display "Time Expired - Press Any Key to Resume" message
- **THEN** system SHALL wait for any key press
- **WHEN** user presses any key
- **THEN** system SHALL dispatch `UI_Action.SET_FULLSCREEN(true)`
- **THEN** system SHALL hide the password modal upon successful fullscreen re-entry

#### Scenario: Fullscreen Re-entry
- **WHEN** the application enters fullscreen mode (either by user action or programmatic re-entry)
- **THEN** system SHALL automatically hide the password modal
- **THEN** system SHALL clear any entered PIN

### Requirement: No Cancel Option
The password modal SHALL NOT provide a "Cancel" button to ensure the child cannot easily dismiss the protection without re-entering fullscreen.

#### Scenario: User looks for cancel
- **WHEN** password modal is displayed
- **THEN** system SHALL ONLY provide a "Submit" button
- **THEN** system SHALL NOT display a "Cancel" or "Close" button

### Requirement: Password reset mechanism
The system SHALL provide a way for parents to reset forgotten passwords.

#### Scenario: Parent forgets password
- **WHEN** parent cannot remember the PIN
- **THEN** system SHALL provide instructions to clear browser localStorage
- **THEN** instructions SHALL be accessible outside the fullscreen mode
- **THEN** clearing localStorage SHALL remove the stored PIN and allow re-setup

#### Scenario: Reset via browser developer tools
- **WHEN** parent opens browser developer console
- **THEN** parent SHALL be able to execute localStorage.clear() to reset
- **THEN** system SHALL detect missing password on next launch and prompt for new setup

### Requirement: Cross-browser fullscreen API support
The system SHALL handle fullscreen across browsers using vendor-prefixed methods.

#### Scenario: Fullscreen activation on different browsers
- **WHEN** fullscreen is requested on Chrome, Firefox, Safari, or Edge
- **THEN** system SHALL use appropriate vendor-prefixed API (requestFullscreen, webkitRequestFullscreen, etc.)
- **THEN** system SHALL successfully enter fullscreen on all supported browsers

#### Scenario: ESC key interception across browsers
- **WHEN** ESC key is pressed in different browsers
- **THEN** system SHALL successfully prevent default fullscreen exit behavior
- **THEN** system SHALL consistently show password modal across all browsers
