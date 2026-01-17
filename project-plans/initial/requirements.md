# VybeSlides - Requirements

## Overview
A retro terminal-based slide presenter with 1980s debug.com-style transitions. Renders slides in LLXPRT greenscreen mode.

## File Structure

### Directory Layout
```
presentation/
  ├── slides.txt      # Slide order and transition definitions
  ├── slide1.md       # Individual slide files
  ├── slide2.md
  └── ...
```

**File path rules:**
- All `.md` slide files must be in the root of the presentation directory (no subdirectories supported)
- Filenames are relative to the presentation directory
- Absolute paths are not allowed

### slides.txt Format
One slide per line. Each line may include optional `before:` and `after:` transition directives.

```
slide1.md before:tvon
slide2.md after:leftwipe
slide3.md before:topwipe after:bottomwipe
slide4.md before:rightwipe
lastslide.md before:diagonal after:tvoff
```

- `before:` – How this slide ENTERS when navigating TO it
- `after:` – How this slide EXITS when navigating AWAY (forward only)
- Either, both, or neither may be specified per slide
- Whitespace: Flexible spacing allowed (e.g., `slide.md before:tvon` or `slide.md  before:tvon`)
- Order: `filename.md before:X after:Y` or any variation (e.g., `before:X after:Y filename.md`)
- No comments supported (any line starting with `#` or `//` will be treated as a slide filename)
- Empty lines are ignored

## Transition Behavior

### Semantics
When moving from slide N to slide N+1 (forward navigation):

| Slide N         | Slide N+1       | Result |
|-----------------|-----------------|--------|
| `no after`      | `no before`     | Instant cut |
| `no after`      | `before:wipe`   | Overlapping wipe - N+1 wipes over N (old and new content visible simultaneously during transition) |
| `after:wipe`    | `no before`     | Sequential - N wipes away → brief blank (~100ms) → N+1 appears instantly |
| `after:wipe`    | `before:wipe`   | Sequential - N wipes out → brief blank (~100ms) → N+1 wipes in (blank is wiped away) |

### Special Cases
- **First slide**: Can use ANY `before:` transition (tvon, diagonal, leftwipe, rightwipe, topwipe, bottomwipe). If no `before:`, appears instantly.
- **Last slide**: `after:tvoff` only triggers on quit (`q`). Previous navigation (`p`) is instant.
- **End of deck**: Forward navigation keys (`n`, `→`, `Space`, `PageDown`, `↓`) do nothing when on the last slide. Only backward navigation (`p`, `←`, `PageUp`, `↑`) or quit (`q`) are valid.
- **Backward navigation**: Pressing PgUp/paste-left to go back jumps instantly, no transitions.

## Available Transitions

### Wipe Effects (~800-1200ms)
- `diagonal` – Top-left to bottom-right
- `leftwipe` – Left edge sweeps right
- `rightwipe` – Right edge sweeps left
- `topwipe` – Top edge sweeps down
- `bottomwipe` – Bottom edge sweeps up

### TV Turn-On/Off Effects
- `tvon` – Old tube TV turning on, with static box that expands to full screen (~2s)
  - Static animates (noise characters change each frame) for authentic appearance
  - Static box starts centered, then expands outward to cover full screen
- `tvoff` – Collapses like an old tube TV turning off (~1.5s)
  - Full screen shrinks to central static box, then disappears

### Instant Visibility
- No `before:` directive → slide appears instantly
- No `after:` directive → slide disappears instantly

## Navigation

### Key Bindings
- `n`, `→`, `Space`, `PageDown`, `↓` – Next slide (applies transition rules)
- `p`, `←`, `PageUp`, `↑` – Previous slide (instant, no transitions)
- `q`, `Escape` – Quit presentation
- `?` – Help overlay
- `0-9` – Jump to slide number by index (0 = first slide, 9 = 10th slide, `:10`+ = slides 10+)
  - Single digit `0-9`: Appears instantly, no transitions
  - Multi-digit `:10`, `:11`, etc.: Prefix with `:` then type number (e.g., `:`, `1`, `0` = 10th slide), appears instantly, no transitions

### Navigation During Transitions
Pressing any navigation key while a wipe is in progress **cancels immediately**:
- Forward navigation (`n`, `→`, `PageDown`, `↓`) mid-wipe: Cancel wipe, jump directly to target slide
- Backward navigation (`p`, `←`, `PageUp`, `↑`) mid-wipe: Cancel wipe, show original slide state at moment of cancel
- Quit (`q`, `Escape`) mid-wipe: Cancel immediately and exit
- Number key (`0-9`) mid-wipe: Cancel wipe, jump directly to target slide

### Rapid Navigation Inputs
If multiple navigation keys are pressed in quick succession while a transition is in progress:
- **Skip to final**: Execute only the last intended slide, skip all intermediate transitions
- No queuing of multiple transitions

## Slide Content

Slides are written in Markdown and support:
- Headers (`#`, `##`, `###`, ...)
- lists (bulleted and numbered)
- Code blocks with syntax highlighting
- Tables (grid format)
- Blockquotes
- ASCII art blocks

### ASCII Art Delimiter
Use triple backticks with `ascii` language identifier:

````text
```ascii
  ╭─╮╭─╮╭─╮
  │░││░││░│
  └─╯└─╯└─╯
```
````

## Theme & Visuals

### Color Scheme (LLXPRT Greenscreen)
- Primary text: `#6a9955`
- Accent: `#00ff00` (bright green highlights)
- Dim: `#4a7035` (subtle/comment text)
- Background: `#000000` (pure black or nearly black)

### Visual Style
- Box drawing characters (lightweight or rounded, like LLXPRT)
- TV static character set: `░▒▓█` for authentic tube TV appearance
- Syntax highlighting: Simple (all green) or subtle dimming like LLXPRT

### Display Areas
- **Header bar**: ASCII logo/name + version + slide counter (e.g., "v1.0.0 ── [3/10]")
  - Slide counter uses dynamic width based on total slides (e.g., `[3/123]` is valid)
- **Footer bar**: Navigation hints + controls menu + time

## Validation & Error Handling

### Fast-Fail Principles
All validation occurs **on startup** before presentation begins:

#### File Validation
- `slides.txt` must exist in the presentation directory
- If a slide file referenced in `slides.txt` does not exist: **Error and quit immediately**
- No subdirectory paths allowed: **Error and quit immediately**
- Absolute paths are not allowed: **Error and quit immediately**

#### Transition Validation
- If an invalid or misspelled transition name is specified: **Error and quit immediately**
- Case sensitivity matters: `before:Diagonal` is invalid (should be `before:diagonal`)

#### Syntax Validation
- If a directive is malformed (e.g., `befor:typo` instead of `before:typo`): **Error and quit immediately**

## CLI Interface

### Usage
```
vybeslides ./presentation-dir [--header off] [--footer off]
```

### Options
- `--header off` – Disable header bar display
- `--footer off` – Disable footer bar display
- Both flags are independent; default is both ON

### Required File
`slides.txt` is required in the presentation directory and defines the slide order and transitions.