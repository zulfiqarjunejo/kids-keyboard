# 🎨 ABC Keyboard Fun - Interactive Alphabet Learning App

An engaging, educational web application for young children to learn alphabet recognition through keyboard interaction. Each keystroke triggers audio-visual feedback with letter sounds and visual examples.

## ✨ Features

- 🎵 **Audio Learning**: Each letter key plays the corresponding letter sound
- 🖼️ **Visual Examples**: 2-3 child-friendly examples with emoji for each letter (e.g., "D for Dog 🐕, Dinosaur 🦕, Duck 🦆")
- 🎨 **Premium UI**: Vibrant gradients, smooth animations, and child-friendly design
- 🖥️ **Fullscreen Mode**: One-click distraction-free fullscreen experience
- 🔒 **Parental Controls**: Password-protected exit to keep kids engaged (ESC key requires 4-digit PIN)
- 🌈 **Dynamic Backgrounds**: Each letter generates a unique colorful gradient
- ⌨️ **Keyboard-Only**: Works with physical keyboard (A-Z keys)

## 🚀 Quick Start

### For Parents

1. **Open the app**: Simply open `index.html` in your web browser (Chrome, Firefox, Safari, or Edge)

2. **First-time setup**: You'll be prompted to set a 4-digit PIN for fullscreen exit protection

3. **Start learning**: Click "🚀 Start Learning" or "⛶ Enter Fullscreen" button

4. **Let your child play**: They can press any letter key (A-Z) to see and hear the alphabet!

### Fullscreen Mode

- **Enter fullscreen**: Click the "Enter Fullscreen" button
- **Exit fullscreen**: Press ESC key and enter your 4-digit PIN
- **Cancel exit**: Click "Cancel" to stay in fullscreen mode

## 📁 Project Structure

```
kids-keyboard/
├── index.html              # Main HTML structure
├── styles.css              # Premium child-friendly styles
├── app.js                  # Core application logic
├── alphabet-content.js     # Letter-to-example mappings
├── assets/
│   └── audio/
│       ├── A.mp3
│       ├── B.mp3
│       └── ... (all 26 letters)
└── README.md              # This file
```

## 🔒 Password Reset

If you forget your PIN:

1. Open your browser's developer console:
   - **Chrome/Edge**: Press `F12` or `Cmd+Option+I` (Mac) / `Ctrl+Shift+I` (Windows)
   - **Firefox**: Press `F12` or `Cmd+Option+K` (Mac) / `Ctrl+Shift+K` (Windows)
   - **Safari**: Enable Developer menu in Preferences, then `Cmd+Option+C`

2. Type: `localStorage.clear()`

3. Press Enter

4. Refresh the page - you'll be prompted to set a new PIN

## 🎯 How It Works

1. **Audio Pre-loading**: All 26 letter sounds are pre-loaded when the app starts
2. **Keyboard Detection**: The app listens for letter key presses (A-Z)
3. **Instant Feedback**: Each keystroke triggers:
   - Audio playback of the letter sound
   - Large letter display with animation
   - 2-3 visual examples with emoji
   - Dynamic gradient background

4. **Password Protection**: 
   - PIN is hashed using SHA-256 and stored in browser's localStorage
   - ESC key is intercepted to show password modal instead of exiting fullscreen
   - Wrong PIN shows error message with shake animation

## 🎨 Design Highlights

- **Fonts**: Fredoka One & Quicksand from Google Fonts
- **Colors**: HSL-based dynamic gradients (different for each letter)
- **Animations**: Bounce, scale, and fade effects for engagement
- **Responsive**: Adapts to different screen sizes
- **Accessible**: High contrast, clear fonts, keyboard focus states

## 🌐 Browser Compatibility

Tested and works on:
- ✅ Google Chrome (latest)
- ✅ Mozilla Firefox (latest)
- ✅ Safari (latest)
- ✅ Microsoft Edge (latest)

## 🛠️ Development

### Audio Files

The app uses MP3 audio files for each letter. Current files are generated using macOS Text-to-Speech. For custom audio:

1. Place MP3 files in `assets/audio/` folder
2. Name them: `A.mp3`, `B.mp3`, ... `Z.mp3`
3. Use a clear, friendly voice suitable for children

### Customizing Examples

Edit `alphabet-content.js` to change the example words and emoji for each letter:

```javascript
const ALPHABET_CONTENT = {
    A: [
        { word: 'Apple', emoji: '🍎' },
        { word: 'Airplane', emoji: '✈️' },
        { word: 'Ant', emoji: '🐜' }
    ],
    // ... modify as needed
};
```

## 📦 Deployment

### Static Hosting

Deploy to any static hosting service:

**Netlify**:
```bash
# Drag and drop the kids-keyboard folder to Netlify
```

**Vercel**:
```bash
vercel kids-keyboard
```

**GitHub Pages**:
```bash
git add kids-keyboard
git commit -m "Add keyboard learning app"
git push origin main
# Enable GitHub Pages in repository settings
```

### Local Server (for testing)

```bash
# Python 3
cd kids-keyboard
python3 -m http.server 8000

# Node.js
npx serve kids-keyboard

# Then open: http://localhost:8000
```

## 🔐 Security Note

This app is designed for **parental control of young children**, not high-security scenarios. The PIN protection:
- Prevents accidental exits by children
- Uses SHA-256 hashing (not plain-text storage)
- Stored in browser localStorage (cleared when cache is cleared)
- Not cryptographically secure for sensitive data

## 📝 License

This is an educational project. Feel free to use, modify, and share!

## 🙏 Credits

- Built with vanilla HTML, CSS, and JavaScript
- Fonts by Google Fonts
- Audio generated using macOS Text-to-Speech
- Emoji from Unicode standard

---

**Made with ❤️ for little learners!**

Enjoy teaching your kids the alphabet in a fun, interactive way! 🎉
