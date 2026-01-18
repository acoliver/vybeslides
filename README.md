# VybeSlides

Retro terminal-based slide presentations with LLXPRT greenscreen aesthetics.

```ascii
     ░██        ░██        ░██    ░██░█████████ ░█████████░██████████
░██  ░██        ░██         ░██  ░██ ░██     ░██░██     ░██   ░██
 ░██ ░██        ░██          ░██░██  ░██     ░██░██     ░██   ░██
  ░██░██        ░██           ░███   ░█████████ ░█████████    ░██
 ░██ ░██        ░██          ░██░██  ░██        ░██   ░██     ░██
░██  ░██        ░██         ░██  ░██ ░██        ░██    ░██    ░██
     ░██████████░██████████░██    ░██░██        ░██     ░██   ░██
```

## Features

- **Greenscreen theme** — Classic `#6a9955` green on black
- **Markdown-driven** — Write slides in familiar markdown
- **ASCII art support** — Embed ASCII art with code fences
- **Retro transitions** — Diagonal wipes, TV on/off effects (coming soon)
- **Keyboard navigation** — No mouse required

## Installation

Requires [Bun](https://bun.sh) runtime.

```bash
# Clone the repository
git clone git@github.com:acoliver/vybeslides.git
cd vybeslides

# Install dependencies
bun install

# Run a presentation
bun src/cli/index.ts ./examples/basic
```

## Usage

### Create a Presentation

1. Create a directory for your presentation
2. Add markdown files for each slide
3. Create a `slides.txt` file listing slides in order

```
my-presentation/
├── slides.txt
├── 01-title.md
├── 02-agenda.md
├── 03-content.md
└── 04-end.md
```

### slides.txt Format

```
01-title.md before:tvon
02-agenda.md before:diagonal
03-content.md before:leftwipe
04-end.md after:tvoff
```

Each line: `filename.md` with optional `before:` and `after:` transition directives.

### Available Transitions

- `diagonal` — Top-left to bottom-right wipe
- `leftwipe` — Left edge sweeps right
- `rightwipe` — Right edge sweeps left
- `topwipe` — Top edge sweeps down
- `bottomwipe` — Bottom edge sweeps up
- `tvon` — Old tube TV turning on effect
- `tvoff` — Old tube TV turning off effect

### Slide Markdown

Supports standard markdown:

```markdown
# Header 1
## Header 2

Regular paragraph text.

- Bullet list
- Another item

1. Numbered list
2. Second item

> Blockquote

| Column 1 | Column 2 |
|----------|----------|
| Data     | More     |
```

Plus ASCII art blocks:

````markdown
```ascii
  ╭─╮╭─╮╭─╮
  │░││░││░│
  └─╯└─╯└─╯
```
````

### Keyboard Navigation

| Key | Action |
|-----|--------|
| `n`, `→`, `↓`, `Space`, `PageDown` | Next slide |
| `p`, `←`, `↑`, `PageUp` | Previous slide |
| `0-9` | Jump to slide (0-indexed) |
| `:10`, `:15`, etc. | Jump to slide 10, 15, etc. |
| `q`, `Escape` | Quit |

### CLI Options

```bash
vybeslides ./presentation [--header off] [--footer off]
```

- `--header off` — Hide the header bar
- `--footer off` — Hide the footer bar

## Development

```bash
# Run tests
bun test

# Run linting
bun run lint

# Type checking
bun run typecheck

# All checks
bun run check
```

## Terminal Compatibility

Best experienced in modern terminals with true color support:

- iTerm2
- Kitty
- Ghostty
- WezTerm
- Alacritty

## License

MIT
