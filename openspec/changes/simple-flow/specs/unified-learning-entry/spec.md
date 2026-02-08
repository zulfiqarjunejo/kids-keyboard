## ADDED Requirements

### Requirement: single-action-entry
The application MUST provide a single "Start Learning" button on the welcome screen that handles both entering fullscreen and transitioning to the learning interface.

#### Scenario: clicking start learning
- **WHEN** the user clicks the "Start Learning" button
- **THEN** the application requests the browser to enter fullscreen mode
- **AND** the application transitions the UI to the learning screen

### Requirement: remove-redundant-actions
The "Enter Fullscreen" button MUST be removed from the UI to prevent user confusion.

#### Scenario: welcome screen visibility
- **WHEN** the welcome screen is displayed
- **THEN** the "Enter Fullscreen" button is not visible or present in the DOM
