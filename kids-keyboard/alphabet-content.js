// Alphabet content mapping: letter -> examples with emoji
const ALPHABET_CONTENT = {
    A: [
        { word: 'Apple', emoji: '🍎' },
        { word: 'Airplane', emoji: '✈️' },
        { word: 'Ant', emoji: '🐜' }
    ],
    B: [
        { word: 'Ball', emoji: '⚽' },
        { word: 'Balloon', emoji: '🎈' },
        { word: 'Bear', emoji: '🐻' }
    ],
    C: [
        { word: 'Cat', emoji: '🐱' },
        { word: 'Car', emoji: '🚗' },
        { word: 'Cake', emoji: '🍰' }
    ],
    D: [
        { word: 'Dog', emoji: '🐕' },
        { word: 'Dinosaur', emoji: '🦕' },
        { word: 'Duck', emoji: '🦆' }
    ],
    E: [
        { word: 'Elephant', emoji: '🐘' },
        { word: 'Egg', emoji: '🥚' },
        { word: 'Earth', emoji: '🌍' }
    ],
    F: [
        { word: 'Fish', emoji: '🐠' },
        { word: 'Flower', emoji: '🌸' },
        { word: 'Frog', emoji: '🐸' }
    ],
    G: [
        { word: 'Giraffe', emoji: '🦒' },
        { word: 'Grapes', emoji: '🍇' },
        { word: 'Guitar', emoji: '🎸' }
    ],
    H: [
        { word: 'Horse', emoji: '🐴' },
        { word: 'House', emoji: '🏠' },
        { word: 'Heart', emoji: '❤️' }
    ],
    I: [
        { word: 'Ice Cream', emoji: '🍦' },
        { word: 'Island', emoji: '🏝️' },
        { word: 'Iguana', emoji: '🦎' }
    ],
    J: [
        { word: 'Jellyfish', emoji: '🪼' },
        { word: 'Juice', emoji: '🧃' },
        { word: 'Jet', emoji: '🛩️' }
    ],
    K: [
        { word: 'Kite', emoji: '🪁' },
        { word: 'Kangaroo', emoji: '🦘' },
        { word: 'Key', emoji: '🔑' }
    ],
    L: [
        { word: 'Lion', emoji: '🦁' },
        { word: 'Lemon', emoji: '🍋' },
        { word: 'Leaf', emoji: '🍃' }
    ],
    M: [
        { word: 'Monkey', emoji: '🐵' },
        { word: 'Moon', emoji: '🌙' },
        { word: 'Mouse', emoji: '🐭' }
    ],
    N: [
        { word: 'Nest', emoji: '🪺' },
        { word: 'Notebook', emoji: '📓' },
        { word: 'Nose', emoji: '👃' }
    ],
    O: [
        { word: 'Octopus', emoji: '🐙' },
        { word: 'Orange', emoji: '🍊' },
        { word: 'Owl', emoji: '🦉' }
    ],
    P: [
        { word: 'Penguin', emoji: '🐧' },
        { word: 'Pizza', emoji: '🍕' },
        { word: 'Panda', emoji: '🐼' }
    ],
    Q: [
        { word: 'Queen', emoji: '👸' },
        { word: 'Question', emoji: '❓' },
        { word: 'Quilt', emoji: '🛏️' }
    ],
    R: [
        { word: 'Rainbow', emoji: '🌈' },
        { word: 'Rocket', emoji: '🚀' },
        { word: 'Rabbit', emoji: '🐰' }
    ],
    S: [
        { word: 'Sun', emoji: '☀️' },
        { word: 'Snake', emoji: '🐍' },
        { word: 'Star', emoji: '⭐' }
    ],
    T: [
        { word: 'Tiger', emoji: '🐯' },
        { word: 'Tree', emoji: '🌳' },
        { word: 'Turtle', emoji: '🐢' }
    ],
    U: [
        { word: 'Umbrella', emoji: '☂️' },
        { word: 'Unicorn', emoji: '🦄' },
        { word: 'UFO', emoji: '🛸' }
    ],
    V: [
        { word: 'Violin', emoji: '🎻' },
        { word: 'Volcano', emoji: '🌋' },
        { word: 'Van', emoji: '🚐' }
    ],
    W: [
        { word: 'Whale', emoji: '🐋' },
        { word: 'Watermelon', emoji: '🍉' },
        { word: 'Watch', emoji: '⌚' }
    ],
    X: [
        { word: 'Xylophone', emoji: '🎹' },
        { word: 'X-ray', emoji: '🩻' },
        { word: 'Xbox', emoji: '🎮' }
    ],
    Y: [
        { word: 'Yellow', emoji: '💛' },
        { word: 'Yacht', emoji: '🛥️' },
        { word: 'Yak', emoji: '🦬' }
    ],
    Z: [
        { word: 'Zebra', emoji: '🦓' },
        { word: 'Zoo', emoji: '🦁' },
        { word: 'Zipper', emoji: '🤐' }
    ]
};

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
        const hue1 = (index * 13) % 360;
        const hue2 = (hue1 + 60) % 360;
        return `linear-gradient(135deg, hsl(${hue1}, 70%, 60%), hsl(${hue2}, 70%, 50%))`;
    }
}
