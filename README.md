# VybeSlides

Create terminal slide presentations.

```ascii
 ██    ██ ██    ██ ██████  ███████ ███████ ██      ██ ██████  ███████ ███████
 ██    ██  ██  ██  ██   ██ ██      ██      ██      ██ ██   ██ ██      ██
 ██    ██   ████   ██████  █████   ███████ ██      ██ ██   ██ █████   ███████
  ██  ██     ██    ██   ██ ██           ██ ██      ██ ██   ██ ██           ██
   ████      ██    ██████  ███████ ███████ ███████ ██ ██████  ███████ ███████
```

## Features

- **Markdown-driven** — Write slides in familiar markdown
- **ASCII art support** — Embed ASCII art with code fences
- **Keyboard navigation** — No mouse required

## Installation

Requires [Bun](https://bun.sh) runtime.

```bash
# Install bun (if not already installed)
curl -fsSL https://bun.sh/install | bash

# Install vybeslides globally
bun install -g @vybestack/vybeslides

# Run a presentation
vybeslides ./my-presentation
```

Or run directly without installing:

```bash
bunx @vybestack/vybeslides ./my-presentation
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
01-title.md
02-agenda.md
03-content.md
04-end.md
```

Each line is a filename for a slide, in presentation order.

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
# Clone the repository
git clone https://github.com/acoliver/vybeslides.git
cd vybeslides

# Install dependencies
bun install

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

Apache-2.0
