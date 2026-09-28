// Alphabet content mapping: letter -> three spoken examples with scalable emoji.
const ALPHABET_CONTENT = Object.fromEntries(Object.entries({
    A: [['Apple', '🍎'], ['Ant', '🐜'], ['Alligator', '🐊']],
    B: [['Ball', '⚽'], ['Banana', '🍌'], ['Bus', '🚌']],
    C: [['Cat', '🐱'], ['Cow', '🐄'], ['Carrot', '🥕']],
    D: [['Dog', '🐕'], ['Duck', '🦆'], ['Door', '🚪']],
    E: [['Elephant', '🐘'], ['Egg', '🥚'], ['Eagle', '🦅']],
    F: [['Finger', '☝️'], ['Frog', '🐸'], ['Fork', '🍴']],
    G: [['Goat', '🐐'], ['Giraffe', '🦒'], ['Guitar', '🎸']],
    H: [['Hat', '🎩'], ['House', '🏠'], ['Horse', '🐴']],
    I: [['Igloo', '🛖'], ['Ink', '🖋️'], ['Insect', '🐞']],
    J: [['Juice', '🧃'], ['Jam', '🍓'], ['Jug', '🏺']],
    K: [['Kite', '🪁'], ['Kangaroo', '🦘'], ['King', '🤴']],
    L: [['Lion', '🦁'], ['Leaf', '🍃'], ['Lemon', '🍋']],
    M: [['Monkey', '🐒'], ['Moon', '🌙'], ['Milk', '🥛']],
    N: [['Nest', '🪺'], ['Net', '🥅'], ['Nut', '🌰']],
    O: [['Owl', '🦉'], ['Orange', '🍊'], ['Octopus', '🐙']],
    P: [['Pig', '🐖'], ['Pizza', '🍕'], ['Pencil', '✏️']],
    Q: [['Queen', '👸'], ['Quail', '🐦'], ['Quilt', '🛏️']],
    R: [['Rabbit', '🐇'], ['Ring', '💍'], ['Rocket', '🚀']],
    S: [['Sun', '☀️'], ['Star', '⭐'], ['Spoon', '🥄']],
    T: [['Tiger', '🐅'], ['Tree', '🌳'], ['Train', '🚂']],
    U: [['Umbrella', '☂️'], ['Umpire', '⚾'], ['Uncle', '👨']],
    V: [['Van', '🚐'], ['Violin', '🎻'], ['Vase', '🏺']],
    W: [['Water', '💧'], ['Window', '🪟'], ['Whale', '🐋']],
    X: [['Xylophone', '🎹'], ['X-ray', '🩻'], ['Fox', '🦊']],
    Y: [['Yo-yo', '🪀'], ['Yak', '🐂'], ['Yacht', '🛥️']],
    Z: [['Zebra', '🦓'], ['Zipper', '🤐'], ['Zoo', '🦒']]
}).map(([letter, examples]) => [
    letter,
    examples.map(([word, emoji]) => ({
        word,
        emoji
    }))
]));

const DIGIT_CONTENT = {
    0: [{ word: 'Zero', emoji: '⭕' }],
    1: [{ word: 'One', emoji: '🍎' }],
    2: [{ word: 'Two', emoji: '⚽' }],
    3: [{ word: 'Three', emoji: '⭐' }],
    4: [{ word: 'Four', emoji: '🍀' }],
    5: [{ word: 'Five', emoji: '🖐️' }],
    6: [{ word: 'Six', emoji: '🦋' }],
    7: [{ word: 'Seven', emoji: '🌈' }],
    8: [{ word: 'Eight', emoji: '🍕' }],
    9: [{ word: 'Nine', emoji: '🎈' }]
};

// Generate dynamic gradient colors for each character (HSL-based)
function getLetterGradient(char) {
    if (/[0-9]/.test(char)) {
        const digit = parseInt(char);
        const hue1 = (digit * 36 + 180) % 360; // Offset by 180 to distinguish from letters
        const hue2 = (hue1 + 40) % 360;
        return `linear-gradient(135deg, hsl(${hue1}, 70%, 60%), hsl(${hue2}, 70%, 50%))`;
    } else {
        const index = char.toUpperCase().charCodeAt(0) - 65; // A=0, B=1, ...
        const hue1 = (index * 47) % 360;
        const hue2 = (hue1 + 85) % 360;
        return `linear-gradient(135deg, hsl(${hue1}, 70%, 60%), hsl(${hue2}, 70%, 50%))`;
    }
}
