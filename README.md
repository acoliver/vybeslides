# VybeSlides

Retro terminal-based slides in LLXPRT greenscreen mode.

## Install

```bash
npm install -g @vybestack/vybeslides
```

**Bun is required** to run TypeScript directly.

```bash
curl -fsSL https://bun.sh/install | bash
```

## Run

```bash
vybeslides ./examples/basic
```

### Options

```bash
vybeslides <presentation-dir> [--header off] [--footer off]
```

- `--header off` disables the header bar
- `--footer off` disables the footer bar

## Slide Format

A presentation directory must include `slides.txt` with one slide per line:

```
01-title.md before:tvon
02-agenda.md before:diagonal
03-code.md before:leftwipe
04-table.md before:rightwipe
05-end.md after:tvoff
```

Each slide is a Markdown file. Use `ascii` code fences for ASCII art:

````text
```ascii
  ░██ ░██
  ░██ ░██
```
````

## Navigation

- `n`, `→`, `Space`, `PageDown`, `↓`: Next slide
- `p`, `←`, `PageUp`, `↑`: Previous slide
- `q`: Quit
- `?`: Help
- `0-9`: Jump by index (0 is the first slide)
- `:10`: Jump to slide 10+
- `Escape`: Cancel an in-progress transition

## Example Deck

The `examples/basic` directory includes a ready-to-run sample deck:

```bash
vybeslides ./examples/basic
```

## Notes

- Slides appear instantly unless `before:` is specified
- Slides disappear instantly unless `after:` is specified
- `after:tvoff` runs only when quitting on the last slide
