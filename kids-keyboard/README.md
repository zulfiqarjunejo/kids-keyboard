# 🎨 ABC Keyboard Fun - Interactive Alphabet Learning App

An engaging, educational web application for young children to learn alphabet recognition through keyboard interaction. Each keystroke triggers audio-visual feedback with letter sounds and visual examples.

## ✨ Features

- 🎵 **Audio Learning**: Each letter key plays the letter, “for,” and one example word in a natural spoken sequence
- 🔤 **Visual Examples**: One large, responsive emoji and word appear when the example is spoken; each letter cycles through three examples
- 🎨 **Premium UI**: Vibrant gradients, smooth animations, and child-friendly design
- 🖥️ **Fullscreen Mode**: One-click distraction-free fullscreen experience
- 🔒 **Parental Controls**: Password-protected exit to keep kids engaged (ESC key requires 4-digit PIN)
- 🌈 **Dynamic Backgrounds**: Each letter generates a unique colorful gradient
- ⌨️ **Keyboard-Only**: Works with physical keyboard (A-Z keys)

## 🚀 Quick Start

### For Parents

1. **Start a local web server** in the `kids-keyboard` directory:
   ```sh
   python3 -m http.server 8000
   ```

2. **Open the app** at `http://localhost:8000` in Chrome, Firefox, Safari, or Edge.

3. **First-time setup**: You'll be prompted to set a 4-digit PIN for fullscreen exit protection.

4. **Start learning**: Click “🚀 Start Learning.” Press a letter key to hear and see one example.

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
│       ├── 0.wav ... 9.wav # Digit sounds
│       └── alphabet/       # Kokoro alphabet phrases and cue manifest
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

1. **Audio Pre-loading**: The 78 alphabet phrases and 10 digit sounds are pre-loaded when the app starts
2. **Keyboard Detection**: The app listens for letter key presses (A-Z)
3. **Instant Feedback**: Each keystroke triggers:
   - Audio playback of the letter, “for,” and one example word
   - Large letter display
   - One matching example visual revealed at the spoken-word cue
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

Digit sounds remain in `assets/audio/`. Alphabet phrases are generated locally with Kokoro and stored in `assets/audio/alphabet/` alongside their example-word cue times in `manifest.json`.

If the Kokoro model and voice files are not in the default cache directory, create a local `.env` file from the template and set their paths:

```sh
cp .env.example .env
```

Set `KOKORO_MODEL_PATH` and `KOKORO_VOICES_PATH` in `kids-keyboard/.env`. The default voice is `af_heart`; choose another installed Kokoro voice with `KOKORO_VOICE`. Install the generator dependencies and create a one-phrase preview with:

```sh
python3 -m pip install -r scripts/requirements.txt
python3 scripts/generate_alphabet_audio.py --preview
```

To generate all 78 local Kokoro phrases, run:

```sh
python3 scripts/generate_alphabet_audio.py
```

The `.env` file is ignored by Git. The generator writes browser-compatible WAV tracks and can resume after interruption. No API key or network connection is required.

The app reports missing phrase tracks rather than substituting unrelated audio. Digit sounds continue to work if alphabet tracks are unavailable.

### Customizing Examples

Edit `alphabet-content.js` to change the three example words and emoji for each letter. Regenerate phrase audio for any changed words:

```javascript
const ALPHABET_CONTENT = {
    A: [['Apple', '🍎'], ['Ant', '🐜'], ['Alligator', '🐊']],
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
