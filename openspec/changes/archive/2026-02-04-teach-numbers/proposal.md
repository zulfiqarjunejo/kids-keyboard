## Why

The application currently only supports teaching the alphabet. Adding digits 0-9 expands the educational value of the app, allowing children to learn numbers alongside letters in the same interactive environment.

## What Changes

- **Digit Support**: Add support for digits 0-9, including audio and visual feedback.
- **Audio Assets**: Integrate 10 new audio files for digits 0 through 9.
- **Enhanced Interaction**: Update the interaction model to respond to ANY key press. If a non-alphabet/non-digit key (like space) is pressed, the system will play a random alphabet or digit.

## Capabilities

### New Capabilities
- `digit-audiovisual-content`: Handles pre-loading and playback of audio/visual content specifically for digits 0-9.

### Modified Capabilities
- `keyboard-interaction`: Update to capture digit keys (0-9) and implement fallback logic to play random content for any other key press.

## Impact
- **Logic**: The keyboard event handler needs to be refactored to handle digits and the "random fallback" behavior.
- **UI**: Visual display component needs to support rendering digits 0-9 and associated visuals (e.g., counting items).
