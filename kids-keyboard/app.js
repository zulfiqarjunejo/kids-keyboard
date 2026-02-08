// Application State
const AppState = {
    audioElements: {},
    audioLoaded: 0,
    totalAudio: 36,
    currentLetter: null,
    isFullscreen: false,
    isKeyboardActive: false,
    pinHash: null,
    isExitAuthorized: false,
    // Timer state managed by GlobalTimerManager now
};

// Architecture Actions
const UI_Action = {
    SET_FULLSCREEN: (enable) => {
        if (enable) {
            enterFullscreen();
        } else {
            exitFullscreen();
        }
    }
};

// Architecture Managers
const GlobalTimerManager = {
    timers: {},

    register(id, duration, onTick, onComplete) {
        if (this.timers[id]) {
            this.clear(id);
        }

        let remaining = duration;
        // Initial tick
        if (onTick) onTick(remaining);

        this.timers[id] = setInterval(() => {
            remaining--;
            if (onTick) onTick(remaining);

            if (remaining <= 0) {
                this.clear(id);
                if (onComplete) onComplete();
            }
        }, 1000);
    },

    clear(id) {
        if (this.timers[id]) {
            clearInterval(this.timers[id]);
            delete this.timers[id];
        }
    },

    clearAll() {
        Object.keys(this.timers).forEach(id => this.clear(id));
    }
};

const AuthManager = {
    timeExpiredKeyHandler: null,

    show() {
        elements.passwordExitModal.classList.remove('hidden');
        elements.exitPinInput.focus();

        // Register timer
        GlobalTimerManager.register(
            'authTimeout',
            10,
            (timeLeft) => {
                if (elements.timerDisplay) elements.timerDisplay.textContent = timeLeft;
            },
            () => {
                // Time's up! Show "press any key" message
                this.showTimeExpiredMessage();
            }
        );
    },

    showTimeExpiredMessage() {
        // Update modal content to show "press any key" message
        const modalContent = elements.passwordExitModal.querySelector('.modal-content');
        modalContent.querySelector('h2').textContent = '⏱️ Time Expired';
        modalContent.querySelector('p').textContent = 'Press any key to resume';
        elements.timerDisplay.style.display = 'none';
        elements.exitPinInput.style.display = 'none';
        elements.exitError.classList.add('hidden');
        const submitBtn = modalContent.querySelector('.modal-buttons');
        if (submitBtn) submitBtn.style.display = 'none';

        // Create and add keypress listener (user gesture required for fullscreen)
        this.timeExpiredKeyHandler = (event) => {
            event.preventDefault();
            this.handleTimeExpiredKey();
        };

        document.addEventListener('keydown', this.timeExpiredKeyHandler, { once: true });
    },

    handleTimeExpiredKey() {
        // Remove the listener
        if (this.timeExpiredKeyHandler) {
            document.removeEventListener('keydown', this.timeExpiredKeyHandler);
            this.timeExpiredKeyHandler = null;
        }

        // Dismiss modal and re-enter fullscreen (now with user gesture)
        this.dismiss();
        UI_Action.SET_FULLSCREEN(true);
    },

    dismiss() {
        // Remove time expired key handler if exists
        if (this.timeExpiredKeyHandler) {
            document.removeEventListener('keydown', this.timeExpiredKeyHandler);
            this.timeExpiredKeyHandler = null;
        }

        // Reset modal content to original state
        const modalContent = elements.passwordExitModal.querySelector('.modal-content');
        modalContent.querySelector('h2').textContent = '🔒 Exit Fullscreen';
        modalContent.querySelector('p').textContent = 'Enter your PIN to exit';
        elements.timerDisplay.style.display = '';
        elements.exitPinInput.style.display = '';
        const submitBtn = modalContent.querySelector('.modal-buttons');
        if (submitBtn) submitBtn.style.display = '';

        elements.passwordExitModal.classList.add('hidden');
        elements.exitPinInput.value = '';
        elements.exitError.classList.add('hidden');

        // Cleanup specific timer
        GlobalTimerManager.clear('authTimeout');
    },

    async verify(pin) {
        if (!/^\d{4}$/.test(pin)) {
            elements.exitError.textContent = 'Please enter 4 digits';
            elements.exitError.classList.remove('hidden');
            return;
        }

        const hash = await hashPin(pin);

        if (hash === AppState.pinHash) {
            // Authorized
            this.dismiss();
            UI_Action.SET_FULLSCREEN(false);
        } else {
            // Shake animation
            elements.passwordExitModal.querySelector('.modal-content').classList.add('shake');
            setTimeout(() => {
                elements.passwordExitModal.querySelector('.modal-content').classList.remove('shake');
            }, 500);

            // Re-enter (security measure)
            UI_Action.SET_FULLSCREEN(true);
        }
    }
};

// DOM Elements
const elements = {
    // Screens
    loadingScreen: null,
    welcomeScreen: null,
    learningScreen: null,

    // Modals
    passwordSetupModal: null,
    passwordExitModal: null,
    helpModal: null,

    // Loading
    progressFill: null,
    loadingStatus: null,
    loadingError: null,

    // Setup
    setupPinInput: null,
    setupPinButton: null,
    setupError: null,

    // Exit
    exitPinInput: null,
    exitPinSubmit: null,
    exitError: null,
    timerDisplay: null,

    // Welcome
    startButton: null,
    resetHelp: null,
    themeToggle: null,

    // Learning
    letterMain: null,
    examplesContainer: null,

    // Help
    closeHelpButton: null
};

// Initialize DOM references
function initDOMReferences() {
    // Screens
    elements.loadingScreen = document.getElementById('loadingScreen');
    elements.welcomeScreen = document.getElementById('welcomeScreen');
    elements.learningScreen = document.getElementById('learningScreen');

    // Modals
    elements.passwordSetupModal = document.getElementById('passwordSetupModal');
    elements.passwordExitModal = document.getElementById('passwordExitModal');
    elements.helpModal = document.getElementById('helpModal');

    // Loading
    elements.progressFill = document.getElementById('progressFill');
    elements.loadingStatus = document.getElementById('loadingStatus');
    elements.loadingError = document.getElementById('loadingError');

    // Setup
    elements.setupPinInput = document.getElementById('setupPinInput');
    elements.setupPinButton = document.getElementById('setupPinButton');
    elements.setupError = document.getElementById('setupError');

    // Exit
    elements.exitPinInput = document.getElementById('exitPinInput');
    elements.exitPinSubmit = document.getElementById('exitPinSubmit');
    elements.exitError = document.getElementById('exitError');
    elements.timerDisplay = document.getElementById('timerDisplay');

    // Welcome
    elements.startButton = document.getElementById('startButton');
    elements.resetHelp = document.getElementById('resetHelp');
    elements.themeToggle = document.getElementById('themeToggle');

    // Learning
    elements.letterMain = document.getElementById('letterMain');
    elements.examplesContainer = document.getElementById('examplesContainer');

    // Help
    elements.closeHelpButton = document.getElementById('closeHelpButton');
}

// SHA-256 Hash Function
async function hashPin(pin) {
    const encoder = new TextEncoder();
    const data = encoder.encode(pin);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Password Management
function checkStoredPin() {
    const storedHash = localStorage.getItem('kidsKeyboardPin');
    if (storedHash) {
        AppState.pinHash = storedHash;
        return true;
    }
    return false;
}

function showPasswordSetup() {
    elements.passwordSetupModal.classList.remove('hidden');
    elements.setupPinInput.focus();
}

function hidePasswordSetup() {
    elements.passwordSetupModal.classList.add('hidden');
    elements.setupPinInput.value = '';
    elements.setupError.classList.add('hidden');
}

async function setupPin() {
    const pin = elements.setupPinInput.value;

    // Validate PIN
    if (!/^\d{4}$/.test(pin)) {
        elements.setupError.textContent = 'PIN must be exactly 4 digits';
        elements.setupError.classList.remove('hidden');
        elements.passwordSetupModal.querySelector('.modal-content').classList.add('shake');
        setTimeout(() => {
            elements.passwordSetupModal.querySelector('.modal-content').classList.remove('shake');
        }, 500);
        return;
    }

    // Hash and store PIN
    const hash = await hashPin(pin);
    localStorage.setItem('kidsKeyboardPin', hash);
    AppState.pinHash = hash;

    hidePasswordSetup();
    showWelcomeScreen();
}

// Replaced by AuthManager
// function showPasswordExit() ...
// function hidePasswordExit() ...
// async function verifyExitPin() ...

// Theme Management
function initTheme() {
    const savedTheme = localStorage.getItem('kidsKeyboardTheme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
    }
}

function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('kidsKeyboardTheme', isDark ? 'dark' : 'light');
}

// Audio Loading
function preloadAudio() {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    const digits = '0123456789'.split('');
    const allChars = [...letters, ...digits];

    allChars.forEach(char => {
        const audio = new Audio();
        audio.preload = 'auto';

        // All assets are .wav and lowercase
        const fileName = char.toLowerCase();
        audio.src = `assets/audio/${fileName}.wav`;

        audio.addEventListener('canplaythrough', () => {
            // Use local variable to avoid race condition or undefined access
            audio.loaded = true;
            AppState.audioLoaded++;
            updateLoadingProgress();
        });

        audio.addEventListener('error', (e) => {
            console.error(`Failed to load audio for ${char}:`, e);
            AppState.audioLoaded++; // Count as loaded to prevent blocking
            updateLoadingProgress();

            if (AppState.audioLoaded === 1) {
                // Show error on first failure
                elements.loadingError.textContent = `Note: Some audio files not found. Place audio files in assets/audio/ folder.`;
                elements.loadingError.classList.remove('hidden');
            }
        });

        AppState.audioElements[char] = audio;
    });
}

function updateLoadingProgress() {
    const progress = (AppState.audioLoaded / AppState.totalAudio) * 100;
    elements.progressFill.style.width = `${progress}%`;
    elements.loadingStatus.textContent = `${AppState.audioLoaded} / ${AppState.totalAudio} items loaded`;

    if (AppState.audioLoaded === AppState.totalAudio) {
        setTimeout(() => {
            elements.loadingScreen.classList.add('hidden');

            // Check if PIN is set
            if (!checkStoredPin()) {
                showPasswordSetup();
            } else {
                showWelcomeScreen();
            }
        }, 500);
    }
}

// Screen Management
function showWelcomeScreen() {
    elements.welcomeScreen.classList.remove('hidden');
    elements.learningScreen.classList.add('hidden');
}

function showLearningScreen() {
    elements.welcomeScreen.classList.add('hidden');
    elements.learningScreen.classList.remove('hidden');
    AppState.isKeyboardActive = true;

    // Show initial content
    showContent('A');
}

// Fullscreen Management
function enterFullscreen() {
    const elem = document.documentElement;

    if (elem.requestFullscreen) {
        elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) {
        elem.webkitRequestFullscreen();
    } else if (elem.mozRequestFullScreen) {
        elem.mozRequestFullScreen();
    } else if (elem.msRequestFullscreen) {
        elem.msRequestFullscreen();
    }

    AppState.isFullscreen = true;
    AppState.isExitAuthorized = false;
}

function exitFullscreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
    } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
    } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
    }

    AppState.isFullscreen = false;
    AppState.isExitAuthorized = true;
}

// Content Display (Letter or Digit)
function showContent(item) {
    AppState.currentLetter = item;

    // Update display with animation
    elements.letterMain.textContent = item;
    elements.letterMain.classList.remove('letter-bounce');
    void elements.letterMain.offsetWidth; // Trigger reflow
    elements.letterMain.classList.add('letter-bounce');

    // Update background gradient
    document.body.style.background = getLetterGradient(item);

    // Display examples
    displayExamples(item);

    // Play audio
    playContentAudio(item);
}

function displayExamples(item) {
    const isDigit = /[0-9]/.test(item);
    const contentArr = isDigit ? DIGIT_CONTENT[item] : ALPHABET_CONTENT[item];
    elements.examplesContainer.innerHTML = '';

    if (!contentArr) return;

    contentArr.forEach((example, index) => {
        const exampleDiv = document.createElement('div');
        exampleDiv.className = 'example-item';
        if (isDigit) exampleDiv.classList.add('digit-example');
        exampleDiv.style.animationDelay = `${index * 0.1}s`;

        if (isDigit) {
            const count = parseInt(item);
            let emojisHTML = '';

            if (count === 0) {
                emojisHTML = `<span class="example-emoji">${example.emoji}</span>`;
            } else {
                emojisHTML = '<div class="emoji-grid">';
                for (let i = 0; i < count; i++) {
                    emojisHTML += `<span class="example-emoji-mini">${example.emoji}</span>`;
                }
                emojisHTML += '</div>';
            }

            exampleDiv.innerHTML = `
                <div class="example-content">
                    ${emojisHTML}
                    <span class="example-word">${example.word}</span>
                </div>
            `;
        } else {
            exampleDiv.innerHTML = `
                <span class="example-emoji">${example.emoji}</span>
                <span class="example-word">${item} for ${example.word}</span>
            `;
        }

        elements.examplesContainer.appendChild(exampleDiv);
    });
}

function playContentAudio(char) {
    const audio = AppState.audioElements[char];

    if (audio && audio.readyState >= 2) {
        // Stop any currently playing audio
        Object.values(AppState.audioElements).forEach(a => {
            if (!a.paused) {
                a.pause();
                a.currentTime = 0;
            }
        });

        // Play the audio
        audio.currentTime = 0;
        audio.play().catch(err => {
            console.error('Audio playback error:', err);
        });
    }
}

// Helper to get a random character (A-Z or 0-9) excluding current if possible
function getRandomChar() {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    const digits = '0123456789'.split('');
    const all = [...letters, ...digits];

    let random;
    do {
        random = all[Math.floor(Math.random() * all.length)];
    } while (random === AppState.currentLetter && all.length > 1);

    return random;
}

// Keyboard Event Handling
function handleKeyPress(event) {
    // Global ESC handler for Fullscreen Exit Protection
    if (event.key === 'Escape') {
        if (AppState.isFullscreen) {
            AuthManager.show();
        }
        return;
    }

    if (!AppState.isKeyboardActive) return;

    // Prevent default actions for all captured keys (scrolling, etc.)
    event.preventDefault();

    const key = event.key.toUpperCase();

    // Check if it's a letter
    if (/^[A-Z]$/.test(key)) {
        showContent(key);
    }
    // Check if it's a digit
    else if (/^[0-9]$/.test(key)) {
        showContent(key);
    }
    // Random fallback for any other key
    else {
        const randomChar = getRandomChar();
        showContent(randomChar);
    }
}

// Help Modal
function showHelpModal() {
    elements.helpModal.classList.remove('hidden');
}

function hideHelpModal() {
    elements.helpModal.classList.add('hidden');
}

// Event Listeners
function attachEventListeners() {
    // Password Setup
    elements.setupPinButton.addEventListener('click', setupPin);
    elements.setupPinInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') setupPin();
    });

    // Password Exit
    elements.exitPinSubmit.addEventListener('click', () => AuthManager.verify(elements.exitPinInput.value));
    elements.exitPinInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') AuthManager.verify(elements.exitPinInput.value);
    });

    // Welcome Screen
    elements.startButton.addEventListener('click', () => {
        enterFullscreen();
        showLearningScreen();
    });
    elements.resetHelp.addEventListener('click', (e) => {
        e.preventDefault();
        showHelpModal();
    });
    elements.themeToggle.addEventListener('click', toggleTheme);

    // Help Modal
    elements.closeHelpButton.addEventListener('click', hideHelpModal);

    // Keyboard Events
    document.addEventListener('keydown', handleKeyPress);

    // Fullscreen Change Events
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('msfullscreenchange', handleFullscreenChange);
}

function handleFullscreenChange() {
    const isCurrentlyFullscreen = !!(
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.mozFullScreenElement ||
        document.msFullscreenElement
    );

    AppState.isFullscreen = isCurrentlyFullscreen;

    if (isCurrentlyFullscreen) {
        // Re-entering fullscreen: hide modal and clear timeout
        AuthManager.dismiss();
    } else if (!AppState.isExitAuthorized) {
        // Unauthorized exit (e.g. ESC key)
        AuthManager.show();
    } else {
        // Authorized exit - go to home screen
        showWelcomeScreen();
        AppState.isExitAuthorized = false;
    }
}

// App Initialization
function init() {
    initDOMReferences();
    attachEventListeners();
    initTheme();
    preloadAudio();
}

// Start app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
