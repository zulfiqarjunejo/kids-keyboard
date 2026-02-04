## Context

The application currently supports only alphabetic characters (A-Z). The goal is to expand this to include digits (0-9) and ensure the application is always interactive by responding to any key press with feedback.

## Goals / Non-Goals

**Goals:**
- Provide full audio-visual support for digits 0-9.
- Ensure any key press (e.g., Space, Enter, Symbols) triggers feedback (randomly selected if the key has no specific content).
- Maintain consistent styling and animations between letters and digits.

**Non-Goals:**
- Supporting multi-digit numbers or mathematical operations.
- Adding complex games or quizzes.

## Decisions

### 1. Unified Content Schema
**Decision**: Extend `alphabet-content.js` with a `DIGIT_CONTENT` mapping.
**Rationale**: Keeps data structures consistent. The display logic can be unified to handle both letters and digits.
**Alternatives**: Creating a separate `digit-content.js`. Rejected to minimize file overhead and keep related educational content together.

### 2. Random Fallback Interaction
**Decision**: Modify `handleKeyPress` to capture ALL keys. If a key is not in the set [A-Z, 0-9], the system will select a random key from the combined set of letters and digits.
**Rationale**: This ensures the app feels "alive" and responsive to a child who might mash the keyboard or press large keys like the Space bar.
**Alternatives**: Ignoring non-alphanumeric keys (current behavior). Rejected as it fails the "always interactive" requirement.

### 3. Visual Representation of Digits (Counting)
**Decision**: For digits, the "Examples" section will display a number of icons equal to the value of the digit (e.g., the number 3 displays 3 stars).
**Rationale**: Reinforces the concept of quantity and counting, which is the primary learning objective for this age group when learning digits.

### 4. Gradient Logic for Digits
**Decision**: Update `getLetterGradient` to handle digit inputs by using a fixed offset in the HSL calculation to distinguish them from alphabetic gradients.
**Rationale**: Provides a consistent but distinct visual "feel" for numbers versus letters.

## Risks / Trade-offs

- **[Risk] Asset Loading Time** → Increasing the number of audio files from 26 to 36. **Mitigation**: The loading screen already tracks progress; we simply need to update the total count and ensure the progress bar remains accurate.
- **[Risk] Random Selection Frequency** → Users might get the same random character multiple times. **Mitigation**: Use a simple "random excluding current" logic if the same random choice is picked sequentially.
