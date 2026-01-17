# CLI Module

Phase 7 implementation: CLI integration for VybeSlides.

## Files

- `ArgumentParser.ts` - Command line argument parsing with support for `--header off` and `--footer off`
- `Runner.ts` - Presentation validation wrapper
- `RuntimeCheck.ts` - Bun runtime detection with friendly error message
- `index.ts` - Main CLI entry point with help text and error handling

## Usage

```bash
# Run directly via bun
bun src/cli/index.ts ./presentation

# Or after global install
vybeslides ./presentation

# With options
vybeslides ./presentation --header off --footer off
```

## Tests

All CLI modules include behavioral tests following TDD principles:
- ArgumentParser: 10 tests
- Runner: 5 tests
- RuntimeCheck: 3 tests
- CLI entry: 4 tests

Total: 22 CLI tests, all passing.
