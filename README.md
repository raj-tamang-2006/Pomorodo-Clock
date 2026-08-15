# Pomodoro Timer

A minimal, customizable Pomodoro timer built with vanilla HTML, CSS, and JavaScript. No frameworks, no build step, no external dependencies — sound effects are generated in-browser with the Web Audio API.

## Features

- **Three session modes** — Focus, Short Break, Long Break — each with independently configurable durations
- **Circular progress dial** that fills as each session counts down
- **Session tracker** — dots show progress through your focus cycle before a long break kicks in
- **Sound effects** for start, pause, and completion, generated with the Web Audio API (no audio files needed)
- **Fully customizable settings panel**:
  - Focus / short break / long break durations (in minutes)
  - Number of focus sessions before a long break
  - Auto-start toggle (chain sessions without tapping Start)
  - Sound on/off
  - Volume slider
  - Chime style: Chime, Bell, or Beep
- **Keyboard support** — press <kbd>Space</kbd> to start/pause, <kbd>Esc</kbd> to close settings
- **Responsive layout** down to small mobile screens
- **Minimal black / white / grey visual design**, Arial throughout

## File structure

```
.
├── index.html   # Markup and structure
├── style.css    # All styling
└── script.js    # Timer logic, settings, and sound engine
```

`index.html` references the other two files like this:

```html
<head>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  ...
  <script src="script.js"></script>
</body>
```

## Getting started

No install or build step required.

1. Make sure `index.html`, `style.css`, and `script.js` are in the same folder.
2. Open `index.html` directly in a browser, **or** serve the folder locally:

   ```bash
   # Python
   python3 -m http.server 8000

   # Node (with npx)
   npx serve .
   ```
3. Visit `http://localhost:8000` (or whichever port your server prints).

Sound requires a user gesture to unlock the browser's audio context — tapping **Start** the first time is enough.

## Using the timer

| Control | What it does |
|---|---|
| **Focus / Short Break / Long Break tabs** | Manually switch modes at any time |
| **Start / Pause** | Starts the countdown or pauses it; label and icon update to match state |
| **Reset** | Resets the current mode back to its full duration |
| **Skip** | Jumps straight to the next session in the cycle |
| **Gear icon** | Opens the settings panel |

The cycle logic: after N focus sessions (default 4, configurable), the next break is a **long** break instead of a short one. The dot tracker under the dial shows how far through the current cycle you are.

## Settings panel

Open it with the gear icon in the top right.

- **Durations** — set focus/short/long lengths in minutes (clamped to sane ranges: focus 1–180, short 1–60, long 1–90)
- **Sessions before long break** — stepper from 1 to 12
- **Auto-start next session** — when on, the next session begins automatically as soon as one finishes
- **Sound effects** — mute/unmute all chimes
- **Volume** — scales the gain of every generated tone
- **Chime style** — tap a style to hear a live preview; it's applied immediately, everything else applies when you tap **Apply**

**Apply** resets the current cycle (back to a fresh Focus session with the new settings). **Restore Defaults** resets the form fields to 25 / 5 / 15 minutes without closing the panel, so you can tweak from there.

## Notes on data persistence

Settings are held in memory only (a plain JS object), not `localStorage` or any browser storage — so they reset to defaults on page reload. If you want settings to persist across sessions, you'd need to add your own storage layer (e.g. `localStorage`, or a backend) around the `settings` object in `script.js`.

## Browser support

Works in any modern browser with support for the Web Audio API (`AudioContext`) and CSS custom properties — i.e. current versions of Chrome, Firefox, Safari, and Edge.

## Customizing the look

Colors, spacing, and type live entirely in `style.css`, driven by CSS custom properties defined at the top of the file (`--bg`, `--ink`, `--grey-1` through `--grey-5`, `--line`). Change those values to re-theme the whole app without touching the markup or logic.
