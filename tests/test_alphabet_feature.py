import json
import re

from playwright.sync_api import expect


def _enter_learning_mode(page, local_server):
    page.add_init_script("localStorage.setItem('kidsKeyboardPin', 'test-pin')")
    page.goto(local_server)
    page.wait_for_selector("#loadingScreen.hidden", timeout=15000)
    page.evaluate("showLearningScreen(); AppState.exampleIndexes = {}; stopCurrentAudio()")
    expect(page.locator("#learningScreen")).to_be_visible()


def test_letter_shows_single_featured_example_and_rotates_on_repeats(page, local_server):
    _enter_learning_mode(page, local_server)
    page.evaluate(
        """
        () => {
            AppState.exampleIndexes = {};
            for (const [letter, examples] of Object.entries(ALPHABET_CONTENT)) {
                for (const example of examples) {
                    AppState.audioElements[`${letter}:${getExampleId(example.word)}`] = {
                        readyState: 4,
                        wordStartSeconds: 0.12,
                        currentTime: 0,
                        pause() {},
                        play() { return Promise.resolve(); }
                    };
                }
            }
            showContent('A');
        }
        """
    )

    expect(page.locator("#letterMain")).to_have_text("A")
    expect(page.locator("#soundButton")).to_have_count(0)
    expect(page.locator("#examplesContainer")).to_be_hidden()
    expect(page.locator("#featuredExample")).to_be_hidden()
    expect(page.locator("#featuredExample")).to_have_count(1)

    page.wait_for_timeout(180)
    expect(page.locator("#featuredExample")).to_be_visible()
    expect(page.locator("#exampleWord")).to_have_text("Apple")
    expect(page.locator("#exampleEmoji")).to_have_text("🍎")
    assert float(page.locator("#exampleEmoji").evaluate(
        "(emoji) => getComputedStyle(emoji).fontSize.replace('px', '')"
    )) >= 112
    assert float(page.locator("#letterMain").evaluate(
        "(letter) => getComputedStyle(letter).fontSize.replace('px', '')"
    )) > float(page.locator("#exampleEmoji").evaluate(
        "(emoji) => getComputedStyle(emoji).fontSize.replace('px', '')"
    ))

    page.evaluate("showContent('A')")
    expect(page.locator("#featuredExample")).to_be_hidden()
    expect(page.locator("#soundButton")).to_have_count(0)
    page.wait_for_timeout(180)
    expect(page.locator("#exampleWord")).to_have_text("Ant")
    expect(page.locator(".featured-example")).to_have_count(1)


def test_interrupted_phrase_cannot_reveal_stale_example(page, local_server):
    _enter_learning_mode(page, local_server)
    page.evaluate(
        """
        () => {
            AppState.exampleIndexes = {};
            for (const [letter, examples] of Object.entries(ALPHABET_CONTENT)) {
                for (const example of examples) {
                    AppState.audioElements[`${letter}:${getExampleId(example.word)}`] = {
                        readyState: 4,
                        wordStartSeconds: letter === 'A' ? 0.1 : 0.35,
                        currentTime: 0,
                        pause() {},
                        play() { return Promise.resolve(); }
                    };
                }
            }
            showContent('A');
            showContent('B');
        }
        """
    )

    page.wait_for_timeout(180)
    expect(page.locator("#featuredExample")).to_be_hidden()
    expect(page.locator("#letterMain")).to_have_text("B")

    page.wait_for_timeout(250)
    expect(page.locator("#featuredExample")).to_be_visible()
    expect(page.locator("#exampleWord")).to_have_text("Ball")
    expect(page.locator("#exampleEmoji")).to_have_text("⚽")


def test_digit_examples_remain_on_the_digit_display(page, local_server):
    _enter_learning_mode(page, local_server)
    page.evaluate("showContent('2')")

    expect(page.locator("#featuredExample")).to_be_hidden()
    expect(page.locator("#examplesContainer .example-item")).to_have_count(1)
    expect(page.locator("#examplesContainer .example-word")).to_have_text("Two")
    expect(page.locator("#examplesContainer .emoji-grid .example-emoji-mini")).to_have_count(2)


def test_background_gradient_changes_clearly_between_letters(page, local_server):
    _enter_learning_mode(page, local_server)
    page.evaluate("showContent('A')")
    first_gradient = page.locator("body").evaluate("(body) => body.style.background")

    page.evaluate("showContent('B')")
    next_gradient = page.locator("body").evaluate("(body) => body.style.background")

    assert first_gradient != next_gradient
    first_color = tuple(map(int, re.search(r"rgb\((\d+), (\d+), (\d+)\)", first_gradient).groups()))
    next_color = tuple(map(int, re.search(r"rgb\((\d+), (\d+), (\d+)\)", next_gradient).groups()))
    color_distance = sum((first - next_) ** 2 for first, next_ in zip(first_color, next_color)) ** 0.5
    assert color_distance > 80


def test_missing_phrase_tracks_are_reported_without_blocking_digit_learning(page, local_server):
    page.add_init_script("localStorage.setItem('kidsKeyboardPin', 'test-pin')")
    page.route(
        "**/assets/audio/alphabet/manifest.json",
        lambda route: route.fulfill(
            status=200,
            content_type="application/json",
            body=json.dumps({"version": 1, "tracks": {}}),
        ),
    )
    page.goto(local_server)
    page.wait_for_selector("#loadingScreen.hidden", timeout=15000)

    assert page.evaluate(
        "() => AppState.totalAudio === 88 && AppState.audioLoaded === 88 && AppState.unavailableAudio.length === 78"
    )
    expect(page.locator("#loadingError")).to_contain_text("78 audio tracks are unavailable")
    expect(page.locator("#audioStatusSummary")).to_have_text("78 audio tracks are unavailable")
    expect(page.locator("#audioStatusDetails")).to_contain_text("A: Apple")

    page.evaluate("showLearningScreen()")
    expect(page.locator("#learningError")).to_contain_text("A for Apple sound is unavailable")
    page.evaluate("showContent('2')")
    expect(page.locator("#examplesContainer .example-word")).to_have_text("Two")


def test_preloads_available_phrase_and_reports_missing_tracks(page, local_server):
    page.add_init_script(
        """
        class TestAudio extends EventTarget {
            constructor() {
                super();
                this.readyState = 4;
                this.paused = true;
                this.currentTime = 0;
                this.wordStartSeconds = 0;
            }
            set src(value) {
                this.source = value;
                queueMicrotask(() => this.dispatchEvent(new Event('canplaythrough')));
            }
            get src() { return this.source; }
            pause() { this.paused = true; }
            play() { this.paused = false; return Promise.resolve(); }
        }
        window.Audio = TestAudio;
        localStorage.setItem('kidsKeyboardPin', 'test-pin');
        """
    )
    page.route(
        "**/assets/audio/alphabet/manifest.json",
        lambda route: route.fulfill(
            status=200,
            content_type="application/json",
            body=json.dumps({
                "version": 1,
                "tracks": {
                    "A:apple": {
                        "file": "a-apple.mp3",
                        "word_start_seconds": 0.01,
                    }
                },
            }),
        ),
    )
    page.goto(local_server)
    page.wait_for_selector("#loadingScreen.hidden", timeout=15000)

    preload_state = page.evaluate(
        "() => ({loaded: AppState.audioLoaded, total: AppState.totalAudio, apple: AppState.audioStatus['A:apple'], unavailable: AppState.unavailableAudio.length})"
    )
    assert preload_state == {"loaded": 88, "total": 88, "apple": True, "unavailable": 77}
    page.evaluate("showLearningScreen()")
    page.wait_for_timeout(50)
    expect(page.locator("#exampleWord")).to_have_text("Apple")
    expect(page.locator("#learningError")).to_be_hidden()


def test_all_generated_audio_loads_and_picture_reveals_at_word_cue(page, local_server):
    page.add_init_script("localStorage.setItem('kidsKeyboardPin', 'test-pin')")
    page.goto(local_server)
    page.wait_for_selector("#loadingScreen.hidden", timeout=30000)

    load_status = page.evaluate(
        "() => ({loaded: AppState.audioLoaded, total: AppState.totalAudio, unavailable: AppState.unavailableAudio.length, apple: AppState.audioStatus['A:apple']})"
    )
    assert load_status == {
        "loaded": 88,
        "total": 88,
        "unavailable": 0,
        "apple": True,
    }
    page.evaluate("showLearningScreen(); AppState.exampleIndexes = {}; stopCurrentAudio()")
    header_before = page.locator("#letterBox").bounding_box()
    page.keyboard.press("A")
    expect(page.locator("#featuredExample")).to_be_hidden()
    expect(page.locator("#learningError")).to_be_hidden()
    page.wait_for_timeout(1100)
    expect(page.locator("#featuredExample")).to_be_visible()
    expect(page.locator("#exampleWord")).to_have_text("Apple")
    expect(page.locator("#exampleEmoji")).to_have_text("🍎")
    header_after = page.locator("#letterBox").bounding_box()
    assert header_after == header_before
