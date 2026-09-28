## Purpose

Define how alphabet selections pair spoken letter-example sequences with one large, responsive visual while preserving digit audio behavior.

## Requirements

### Requirement: Pre-load audio files for all letters
The system SHALL preload the 78 spoken letter-example sequences for the three examples defined for each letter A-Z, alongside the ten digit sounds. It SHALL report loading progress and unavailable audio to the parent, then enable keyboard interaction when loading completes. If audio fails to load, the system SHALL identify unavailable content and allow interaction with available content.

#### Scenario: Successful audio pre-loading
- **WHEN** the page loads
- **THEN** the system SHALL load the available alphabet example sequences and digit sounds
- **AND** indicate loading progress to the parent
- **AND** enable keyboard interaction after loading completes

#### Scenario: Audio file loading failure
- **WHEN** one or more audio files fail to load
- **THEN** the system SHALL identify the unavailable letter-example sequence or digit to the parent
- **AND** allow interaction with successfully loaded content

### Requirement: Play audio on letter press
The system SHALL play a natural, child-friendly spoken sequence for the selected letter and its chosen example. The sequence SHALL speak the letter, pause briefly, speak “for,” pause longer, and then speak the example word. Audio SHALL begin within 100ms of letter selection when the sequence is available.

#### Scenario: Audio playback for a letter
- **WHEN** a letter is selected
- **THEN** the system SHALL speak the selected letter, followed by a short pause and “for,” followed by a longer pause and the selected example word
- **AND** the voice SHALL sound natural and child-friendly

#### Scenario: Audio interruption on new key press
- **WHEN** a new letter is selected while a previous letter-and-example sequence is still playing
- **THEN** the system SHALL stop the previous sequence
- **AND** start the new selection's sequence from the beginning

### Requirement: Display visual examples for each letter
The system SHALL display the selected uppercase letter prominently and exactly one large emoji for the selected example, without a sound-icon control. It SHALL choose one of the three examples defined for that letter and SHALL NOT display other examples or place the selected example in a box or list. The emoji SHALL appear when its spoken word begins, scale responsively without cropping or stretching, and include a visible word label. Letter transitions SHALL not change the letter's position or size.

The examples for each letter SHALL be:

| Letter | Examples |
| --- | --- |
| A | Apple, Ant, Alligator |
| B | Ball, Banana, Bus |
| C | Cat, Cow, Carrot |
| D | Dog, Duck, Door |
| E | Elephant, Egg, Eagle |
| F | Finger, Frog, Fork |
| G | Goat, Giraffe, Guitar |
| H | Hat, House, Horse |
| I | Igloo, Ink, Insect |
| J | Juice, Jam, Jug |
| K | Kite, Kangaroo, King |
| L | Lion, Leaf, Lemon |
| M | Monkey, Moon, Milk |
| N | Nest, Net, Nut |
| O | Owl, Orange, Octopus |
| P | Pig, Pizza, Pencil |
| Q | Queen, Quail, Quilt |
| R | Rabbit, Ring, Rocket |
| S | Sun, Star, Spoon |
| T | Tiger, Tree, Train |
| U | Umbrella, Umpire, Uncle |
| V | Van, Violin, Vase |
| W | Water, Window, Whale |
| X | Xylophone, X-ray, Fox |
| Y | Yo-yo, Yak, Yacht |
| Z | Zebra, Zipper, Zoo |

For X, Fox teaches the /ks/ sound at the end of a word.

#### Scenario: Display one example for a selected letter
- **WHEN** a letter is selected
- **THEN** the system SHALL display that uppercase letter prominently without a sound-icon control
- **AND** choose one of that letter's three defined examples
- **AND** display no other examples or example boxes
- **AND** display the chosen example as one large, responsive emoji when its word is spoken

#### Scenario: Stable letter position during emoji reveal
- **WHEN** the selected example emoji appears
- **THEN** the letter SHALL remain in the same position and size
- **AND** the emoji SHALL scale to the available display area

#### Scenario: Use the supplied example set
- **WHEN** any letter A-Z is selected
- **THEN** the chosen example SHALL be one of the three words listed for that letter
- **AND** for X, Fox SHALL support teaching the ending /ks/ sound

#### Scenario: Example content for letter D
- **WHEN** the letter D is selected and Dog is chosen
- **THEN** the system SHALL show the uppercase letter D prominently
- **AND** display only the Dog emoji and its word label when “Dog” is spoken

### Requirement: Synchronized audio-visual feedback
The system SHALL synchronize the selected letter, spoken sequence, and example emoji. The letter SHALL be visible when its spoken sound begins. The example SHALL remain hidden until its spoken word begins, then appear with that word. Visual updates SHALL not delay or block audio playback.

#### Scenario: Picture reveal synchronized with example word
- **WHEN** the spoken sequence reaches the selected example word
- **THEN** the matching emoji and word label SHALL appear as the word begins
- **AND** the letter SHALL remain prominently visible

#### Scenario: Simultaneous audio and visual update
- **WHEN** a letter key is pressed
- **THEN** audio playback SHALL start
- **AND** the selected letter SHALL be visible when its spoken sound begins
- **AND** the selected emoji SHALL appear when its example word begins without blocking audio

#### Scenario: New selection interrupts an active sequence
- **WHEN** a different supported letter is selected before the current sequence finishes
- **THEN** the current audio sequence SHALL stop
- **AND** the prior example SHALL be replaced by the new selection's example at the beginning of its spoken word
- **AND** the new letter SHALL be displayed when its spoken sound begins

### Requirement: Audio format compatibility
The system SHALL support locally generated Kokoro alphabet audio in Chrome, Firefox, Safari, and Edge without plugins. Generated audio SHALL use a browser-compatible format, and the system SHALL handle browser-specific playback behavior gracefully.

#### Scenario: Cross-browser audio playback
- **WHEN** the application runs in Chrome, Firefox, Safari, or Edge
- **THEN** the system SHALL play the generated Kokoro letter-and-example audio sequence without plugins
- **AND** handle browser-specific audio behavior gracefully
