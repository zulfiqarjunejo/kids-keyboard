// Application State
const AppState = {
    audioElements: {},
    audioLoaded: 0,
    totalAudio: 10 + Object.values(ALPHABET_CONTENT).reduce(
        (count, examples) => count + examples.length,
        0
    ),
    audioStatus: {},
    unavailableAudio: [],
    exampleIndexes: {},
    currentLetter: null,
    currentSelection: null,
    currentAudio: null,
    playbackId: 0,
    revealTimer: null,
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
        // Don't re-show if we're displaying the time expired message
        const modalHeading = elements.passwordExitModal.querySelector('.modal-content h2');
        if (modalHeading && modalHeading.textContent.includes('Time Expired')) {
            return;
        }

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
            // Authorized - set flag first to prevent fullscreenchange from interfering
            AppState.isExitAuthorized = true;
            this.dismiss();
            showWelcomeScreen();
            UI_Action.SET_FULLSCREEN(false);
        } else {
            elements.exitError.textContent = 'Incorrect password';
            elements.exitError.classList.remove('hidden');
            elements.exitPinInput.value = '';
            elements.passwordExitModal.querySelector('.modal-content').classList.add('shake');
            setTimeout(() => {
                elements.passwordExitModal.querySelector('.modal-content').classList.remove('shake');
            }, 500);
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
    audioStatusMessage: null,
    audioStatusSummary: null,
    audioStatusDetails: null,

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
    featuredExample: null,
    exampleEmoji: null,
    exampleWord: null,
    learningError: null,

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
    elements.audioStatusMessage = document.getElementById('audioStatusMessage');
    elements.audioStatusSummary = document.getElementById('audioStatusSummary');
    elements.audioStatusDetails = document.getElementById('audioStatusDetails');

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
    elements.featuredExample = document.getElementById('featuredExample');
    elements.exampleEmoji = document.getElementById('exampleEmoji');
    elements.exampleWord = document.getElementById('exampleWord');
    elements.learningError = document.getElementById('learningError');

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
    const digits = '0123456789'.split('');

    digits.forEach(char => {
        const audio = new Audio();
        audio.preload = 'auto';
        audio.src = `assets/audio/${char}.wav`;
        AppState.audioElements[char] = audio;
        watchAudioLoad(char, audio);
    });

    fetch('assets/audio/alphabet/manifest.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            return response.json();
        })
        .then(manifest => preloadAlphabetAudio(manifest.tracks || {}))
        .catch(() => {
            'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').forEach(letter => {
                ALPHABET_CONTENT[letter].forEach(example => {
                    markAudioUnavailable(`${letter}:${getExampleId(example.word)}`);
                });
            });
        });
}

function watchAudioLoad(key, audio) {
    audio.addEventListener('canplaythrough', () => {
        settleAudioLoad(key, true);
    });
    audio.addEventListener('error', () => {
        settleAudioLoad(key, false);
    });
}

function settleAudioLoad(key, loaded) {
    if (Object.prototype.hasOwnProperty.call(AppState.audioStatus, key)) return;
    AppState.audioStatus[key] = loaded;
    if (!loaded) AppState.unavailableAudio.push(key);
    AppState.audioLoaded++;
    updateLoadingProgress();
}

function markAudioUnavailable(key) {
    if (Object.prototype.hasOwnProperty.call(AppState.audioStatus, key)) return;
    AppState.audioStatus[key] = false;
    AppState.unavailableAudio.push(key);
    AppState.audioLoaded++;
    updateLoadingProgress();
}

function preloadAlphabetAudio(tracks) {
    'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').forEach(letter => {
        ALPHABET_CONTENT[letter].forEach(example => {
            const key = `${letter}:${getExampleId(example.word)}`;
            const track = tracks[key];
            if (!track || typeof track.file !== 'string' ||
                !Number.isFinite(track.word_start_seconds) || track.word_start_seconds < 0) {
                markAudioUnavailable(key);
                return;
            }

            const audio = new Audio();
            audio.preload = 'auto';
            audio.src = `assets/audio/alphabet/${track.file}`;
            audio.wordStartSeconds = track.word_start_seconds;
            AppState.audioElements[key] = audio;
            watchAudioLoad(key, audio);
        });
    });
}

function updateLoadingProgress() {
    const progress = (AppState.audioLoaded / AppState.totalAudio) * 100;
    elements.progressFill.style.width = `${progress}%`;
    elements.loadingStatus.textContent = `${AppState.audioLoaded} / ${AppState.totalAudio} items loaded`;

    if (AppState.unavailableAudio.length) {
        const unavailable = AppState.unavailableAudio.map(key => {
            const [letter, exampleId] = key.split(':');
            if (!exampleId) return `${letter} sound`;
            const example = ALPHABET_CONTENT[letter].find(item => getExampleId(item.word) === exampleId);
            return `${letter}: ${example ? example.word : exampleId}`;
        });
        elements.loadingError.textContent = `${unavailable.length} audio tracks are unavailable. See the welcome screen for details.`;
        elements.loadingError.classList.remove('hidden');
        elements.audioStatusSummary.textContent = `${unavailable.length} audio tracks are unavailable`;
        elements.audioStatusDetails.textContent = unavailable.join(', ');
        elements.audioStatusMessage.hidden = false;
    }

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
    stopCurrentAudio();
    elements.welcomeScreen.classList.remove('hidden');
    elements.learningScreen.classList.add('hidden');
    AppState.isKeyboardActive = false;
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
    stopCurrentAudio();
    AppState.currentLetter = item;

    // Update display with animation
    elements.letterMain.textContent = item;
    elements.letterMain.classList.remove('letter-bounce');
    void elements.letterMain.offsetWidth; // Trigger reflow
    elements.letterMain.classList.add('letter-bounce');

    // Update background gradient
    document.body.style.background = getLetterGradient(item);

    const isLetter = /^[A-Z]$/i.test(item);
    elements.learningError.hidden = true;
    elements.learningError.textContent = '';

    if (isLetter) {
        const letter = item.toUpperCase();
        const examples = ALPHABET_CONTENT[letter];
        const exampleIndex = AppState.exampleIndexes[letter] || 0;
        const example = examples[exampleIndex];
        AppState.exampleIndexes[letter] = (exampleIndex + 1) % examples.length;
        AppState.currentSelection = { letter, example };
        elements.examplesContainer.hidden = true;
        elements.featuredExample.hidden = true;
        elements.exampleEmoji.textContent = '';
        elements.exampleWord.textContent = '';
        playAlphabetSequence(AppState.currentSelection);
        return;
    }

    AppState.currentSelection = null;
    elements.featuredExample.hidden = true;
    elements.examplesContainer.hidden = false;
    displayExamples(item);
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
                <div class="example-content">
                    <span class="example-word">${example.word}</span>
                    <span class="example-emoji">${example.emoji}</span>
                </div>
            `;
        }

        elements.examplesContainer.appendChild(exampleDiv);
    });
}

function playContentAudio(char) {
    const audio = AppState.audioElements[char];

    if (!audio || audio.readyState < 2) return;
    AppState.currentAudio = audio;
    audio.currentTime = 0;
    audio.play().catch(() => showLearningAudioError(`${char} sound could not be played.`));
}

function getExampleId(word) {
    return word.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function stopCurrentAudio() {
    AppState.playbackId++;
    if (AppState.revealTimer !== null) {
        clearTimeout(AppState.revealTimer);
        AppState.revealTimer = null;
    }
    if (AppState.currentAudio) {
        AppState.currentAudio.pause();
        AppState.currentAudio.currentTime = 0;
        AppState.currentAudio = null;
    }
}

function showLearningAudioError(message) {
    elements.learningError.textContent = message;
    elements.learningError.hidden = false;
}

function revealCurrentExample(playbackId, selection) {
    if (playbackId !== AppState.playbackId || selection !== AppState.currentSelection) return;
    elements.exampleEmoji.textContent = selection.example.emoji;
    elements.exampleWord.textContent = selection.example.word;
    elements.featuredExample.hidden = false;
}

function playAlphabetSequence(selection = AppState.currentSelection) {
    if (!selection) return;
    stopCurrentAudio();
    const playbackId = AppState.playbackId;
    const trackKey = `${selection.letter}:${getExampleId(selection.example.word)}`;
    const audio = AppState.audioElements[trackKey];
    if (!audio || audio.readyState < 2) {
        showLearningAudioError(`${selection.letter} for ${selection.example.word} sound is unavailable.`);
        return;
    }

    AppState.currentAudio = audio;
    audio.currentTime = 0;
    AppState.revealTimer = setTimeout(
        () => revealCurrentExample(playbackId, selection),
        audio.wordStartSeconds * 1000
    );
    audio.play().catch(() => {
        if (playbackId === AppState.playbackId) {
            if (AppState.revealTimer !== null) clearTimeout(AppState.revealTimer);
            AppState.revealTimer = null;
            showLearningAudioError(`${selection.letter} for ${selection.example.word} sound could not be played.`);
        }
    });
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
    const exitModalVisible = elements.passwordExitModal && !elements.passwordExitModal.classList.contains('hidden');

    if (exitModalVisible) {
        if (elements.passwordExitModal.contains(event.target)) {
            return;
        }

        event.preventDefault();
        return;
    }

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
        // Authorized exit - already handled in verify(), just reset the flag
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
