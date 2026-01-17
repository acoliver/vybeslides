# VybeSlides - Test-First Implementation Plan

## Executive Summary

VybeSlides is a retro terminal-based slide presenter built with TypeScript, Bun, and OpenTUI/React. This document outlines a complete TDD approach to implementing all requirements from the requirements.md document.

**Technology Stack:**
- Runtime: Bun (required, no Node.js fallback)
- Language: TypeScript (strict mode, no compilation to JS)
- UI Framework: OpenTUI React (same as LLXPRT packages/ui)
- Testing: Vitest + React Testing Library
- Validation: Zod schemas
- State Management: Immutable patterns only
- Publishing: npmjs.org (Bun required - users install Bun separately)

**Core Principles:**
- TDD is mandatory - every line of production code responds to a failing test
- Strong typing with no `any`, no type assertions
- Immutability everywhere
- Fast-fail validation on startup
- Complexity limits follow LLXPRT packages/ui rules (80 lines warn, 120 lines error per function)

---

## Project Structure

```
vybeslides/
├── src/
│   ├── cli/
│   │   ├── index.ts                 # CLI entry point
│   │   ├── commands.ts              # Command line argument parsing
│   │   └── runner.ts                # Main presentation runner
│   ├── features/
│   │   ├── theme/
│   │   │   ├── index.ts             # Theme export
│   │   │   ├── green-screen.ts      # LLXPRT greenscreen theme
│   │   │   └── theme.test.ts
│   │   ├── slides/
│   │   │   ├── index.ts             # Public API exports
│   │   │   ├── slides-parser.ts     # Parse slides.txt
│   │   │   ├── slides-parser.test.ts
│   │   │   ├── slide-loader.ts      # Load .md files
│   │   │   ├── slide-loader.test.ts
│   │   │   ├── validator.ts         # Validate slides.txt and files
│   │   │   ├── validator.test.ts
│   │   │   └── schemas.ts           # Zod schemas
│   │   ├── markdown/
│   │   │   ├── index.ts
│   │   │   ├── parser.ts            # Parse markdown content
│   │   │   ├── parser.test.ts
│   │   │   ├── renderer.ts          # Convert markdown to components
│   │   │   └── renderer.test.ts
│   │   ├── transitions/
│   │   │   ├── index.ts
│   │   │   ├── transition-types.ts
│   │   │   ├── transition-registry.ts   # Map names to transition logic
│   │   │   ├── tv-turn-on.ts
│   │   │   ├── tv-turn-on.test.ts
│   │   │   ├── tv-turn-off.ts
│   │   │   ├── tv-turn-off.test.ts
│   │   │   ├── diagonal-wipe.ts
│   │   │   ├── diagonal-wipe.test.ts
│   │   │   ├── left-wipe.ts
│   │   │   ├── left-wipe.test.ts
│   │   │   ├── right-wipe.ts
│   │   │   ├── right-wipe.test.ts
│   │   │   ├── top-wipe.ts
│   │   │   ├── top-wipe.test.ts
│   │   │   ├── bottom-wipe.ts
│   │   │   └── bottom-wipe.test.ts
│   │   ├── navigation/
│   │   │   ├── index.ts
│   │   │   ├── navigator.ts         # Navigation state machine
│   │   │   ├── navigator.test.ts
│   │   │   ├── input-handler.ts     # Key press handling
│   │   │   └── input-handler.test.ts
│   │   └── presentation/
│   │       ├── index.ts
│   │       ├── state.ts             # Presentation state types
│   │       ├── controller.ts        # Main presentation controller
│   │       └── controller.test.ts
│   ├── components/
│   │   ├── BoxBorder.tsx            # LLXPRT-style box with unicode borders
│   │   ├── HeaderBar.tsx            # Logo + slide counter
│   │   ├── FooterBar.tsx            # Navigation + controls + time
│   │   ├── SlideDisplay.tsx         # Main slide container
│   │   ├── ContentRenderer.tsx      # Render markdown content
│   │   ├── CodeBlock.tsx            # Highlighted code blocks
│   │   ├── Table.tsx                # Markdown tables
│   │   ├── AsciiArt.tsx             # ASCII art sections
│   │   ├── HelpOverlay.tsx          # ? help modal
│   │   └── StaticNoise.tsx          # TV static effect
│   ├── lib/
│   │   ├── logger.ts                # LLXPRT-style logger
│   │   └── colors.ts                # Export LLXPRT green-screen theme
│   └── main.tsx                     # Entry point (OpenTUI app root)
├── test/
│   └── fixtures/                    # Test slides and presentation data
│       ├── valid-presentations/
│       │   ├── basic/
│       │   │   ├── slides.txt
│       │   │   ├── 00-title.md
│       │   │   └── 01-content.md
│       │   ├── with-transitions/
│       │   └── edge-cases/
│       └── invalid/
│           ├── missing-file/
│           ├── invalid-transition/
│           └── subdirectory/
├── scripts/
│   └── check-limits.ts              # Complexity checker (from LLXPRT)
├── package.json
├── tsconfig.json
├── vitest.config.ts
└── README.md
```

---

## Implementation Phases

### Phase 1: Foundation (Tests First)

**Goal:** Establish project structure, build infrastructure, and core types.

**Tasks:**

1. **Project Setup**
   - Initialize bun project with package.json
   - Configure tsconfig.json (strict mode, no compilation)
   - Setup vitest.config.ts with happy-dom
   - Create ESLint config matching LLXPRT packages/ui
   - Copy check-limits.ts script

2. **Core Types & Schemas**
   - Define types.ts with all core type definitions
   - Create Zod schemas for validation
   - Write type tests (type assertions, schema validation tests)

3. **Theme System**
   - Export LLXPRT greenscreen theme from llxprt-code
   - Define theme types
   - Write theme tests

4. **Logger**
   - Logger utility (borrow from LLXPRT)
   - Logger tests

**TDD Approach (following RULES.md):**
- **Behavioral tests only**: Test what happens, not how it happens
- **No mock theater**: Don't test implementation details or mock interactions
- **Single assertion per test**: Each test verifies one behavior
- **Explicit error states**: Use result types instead of throwing exceptions
- **Schema-first validation**: Use Zod schemas for input validation

**TDD Sequence (Example - Types):**
```typescript
// 1. RED: Test for SlideEntry type
it('should parse valid slide entry with transitions', () => {
  const input = 'slide.md before:tvon after:tvoff';
  const result = parseSlideEntry(input);
  expect(result).toEqual({
    filename: 'slide.md',
    beforeTransition: 'tvon',
    afterTransition: 'tvoff',
  });
});

// 2. GREEN: Implement parseSlideEntry
export const parseSlideEntry = (line: string): SlideEntry => {
  // minimal implementation
};

// 3. REFACTOR (if valuable)
// 4. COMMIT
```

---

### Phase 2: Slide System (TDD)

**Goal:** Load, parse, and validate slide files and slides.txt.

**Tasks:**

1. **slides.txt Parser**
   - Parse slide entries with flexible whitespace/order
   - Handle empty lines (skip)
   - Parse before/after directives
   - Tests: valid entries, whitespace variations, order variations, empty lines, edge cases

2. **Slide File Loader**
   - Load .md files from directory
   - Read file contents
   - Handle missing files (should be caught by validator)
   - Tests: load valid slides, read content

3. **Validator**
   - Validate slides.txt exists
   - Validate all referenced .md files exist
   - Validate no subdirectories in paths
   - Validate no absolute paths
   - Validate transition names (case-sensitive)
   - Validate directive syntax (before:, after:)
   - **No comment support**: Lines starting with `#` or `//` are treated as slide filenames (will fail validation if file doesn't exist)
   - Fast-fail on any error with clear messages
   - Tests: each validation rule, error messages, edge cases, comment-prefix-as-filename

4. **Integration Tests**
   - Test full slide loading pipeline
   - Test with fixture presentations

---

### Phase 3: Markdown Parser (TDD)

**Goal:** Parse markdown content into structured data.

**Tasks:**

1. **Markdown Element Parsers**
   - Headers (H1-H6)
   - Lists (bulleted, numbered)
   - Code blocks with language
   - Tables
   - Blockquotes
   - ASCII art blocks (```ascii)
   - Regular paragraphs
   - Inline patterns (bold, italic, code, links)

2. **Integration Parsing**
   - Parse entire slide markdown
   - Preserve order
   - Tests: fixtures with various markdown patterns

**Supported Markdown Elements:**
```typescript
type MarkdownElement =
  | Header
  | Paragraph
  | BulletList
  | NumberedList
  | CodeBlock
  | Table
  | Blockquote
  | AsciiArt
  | InlineBold
  | InlineItalic
  | InlineCode
  | Link;
```

---

### Phase 4: Transition Engine (TDD)

**Goal:** Implement all wipe and TV effects with frame-by-frame rendering.

**Tasks:**

1. **Transition Types**
   - Define Transition interface
   - Define TransitionProgress type

2. **TV Turn-On**
   - Static noise generation with `░▒▓█`
   - Centered static box
   - Expansion animation (~2s at 50fps)
   - Animate noise each frame
   - Tests: static pattern, expansion calculation, progress 0-100%

3. **TV Turn-Off**
   - Collapse animation (~1.5s)
   - Shrink to center
   - Tests: collapse calculation, progress 0-100%
   - Timing test: reasonably complete (not instant, not stuck)

4. **Diagonal Wipe**
   - Overlapping wipe (old + new visible simultaneously)
   - Top-left to bottom-right algorithm
   - Tests: visibility mask at different progress levels
   - Timing test: reasonably complete (not instant, not stuck)

5. **Directional Wipes**
   - Left wipe (left edge sweeps right)
   - Right wipe (right edge sweeps left)
   - Top wipe (top edge sweeps down)
   - Bottom wipe (bottom edge sweeps up)
   - Tests: each wipe direction at various progress levels
   - Timing test for each: reasonably complete (not instant, not stuck)

4. **Transition Registry**
   - Map transition names to transition functions
   - Validate transition names
   - Tests: registry lookup, invalid names return error

7. **Blank Frame Logic**
   - Brief blank (~100ms) between sequential transitions
   - Tests: timing state machine

---

### Phase 5: Navigation & State (TDD)

**Goal:** Handle user input, navigation logic, and presentation state.

**Tasks:**

1. **Navigation State Machine**
   - State: current slide index, transition in progress, jump mode
   - Navigation rules:
     - Forward: n, →, Space, PageDown, ↓
     - Backward: p, ←, PageUp, ↑
     - Quit: q, Escape
     - Help: ?
     - Jump: 0-9 (single), :10+ (multi-digit)
   - End-of-deck: forward keys do nothing
   - Backward navigation: always instant, no transitions
   - Jumps: instant, no transitions
   - Cancel during transition:
     - **ESC**: Cancel wipe, stay on current slide (don't navigate)
     - **PgUp / ↑**: Cancel wipe, navigate to previous slide
     - **PgDn / ↓ / → / Space / n**: Cancel wipe, navigate to next slide
     - **0-9**: Cancel wipe, jump to numbered slide
     - **q**: Cancel wipe, quit presentation
   - Rapid inputs: skip to final, no queuing
   - Tests: each key binding, state transitions, edge cases

2. **Input Handler**
   - Parse multi-digit jump input (: prefix)
   - Handle rapid key presses during transitions
   - Tests: input sequences, cancel behavior

3. **Presentation Controller**
   - Manage slide list
   - Apply transition semantics table
   - Determine transition type for each navigation
   - `after:tvoff` behavior: only on quit (`q`), not on forward navigation at end-of-deck
   - Tests: all transition combinations from requirements, end-of-deck navigation, quit semantics

---

### Phase 6: UI Components (TDD)

**Goal:** Build OpenTUI React components for rendering.

**Tasks:**

1. **BoxBorder**
   - LLXPRT-style box borders (╭╮╰╯─│┌┐└┘)
   - Rounded or lightweight style
   - Tests: border generation, content wrapping

2. **HeaderBar**
   - ASCII logo/name
   - Version number
   - Slide counter [current/total] with dynamic width
   - Tests: format variations, different slide counts

3. **FooterBar**
   - Navigation hints ("←/↑ prev | →/↓ next | ? help | q quit")
   - Current time display
   - Tests: time formatting, text wrapping

4. **ContentRenderer**
   - Render parsed markdown elements
   - Headers, paragraphs, lists
   - Tables (grid layout)
   - Code blocks with green syntax highlighting
   - Blockquotes
   - Tests: each markdown element renders correctly

5. **CodeBlock**
   - Syntax highlighting (simple all-green approach)
   - Monospace font
   - Tests: highlighting, wrapping

6. **Table**
   - Grid lines using box drawing characters
   - Column alignment
   - Tests: various table structures, alignment

7. **AsciiArt**
   - Preserve monospace and spacing
   - Apply green foreground color
   - Tests: ascii art rendering

8. **StaticNoise**
   - TV static effect using ░▒▓█
   - Animate (change each frame)
   - Tests: pattern generation

9. **HelpOverlay**
   - Modal with all key bindings
   - Tests: all bindings displayed

10. **SlideDisplay**
    - Main container with optional header/footer
    - Apply transitions
    - Tests: with/without header, with/without footer

---

### Phase 7: CLI Integration (TDD)

**Goal:** Build CLI entry point and runner.

**Tasks:**

1. **Command Line Parser**
   - Parse presentation directory argument
   - Parse optional flags: --header off, --footer off
   - Validate directory exists
   - Tests: valid arguments, missing directory, invalid flags, help flag

2. **Runner**
   - Load and validate presentation
   - Initialize OpenTUI app
   - Handle startup errors with user-friendly messages
   - Tests: successful startup, error cases

3. **Main Entry**
   - CLI entry point in `src/cli/index.ts`
   - Can be run directly: `bun run src/main.tsx <dir> [flags]`
   - Can be run via npm global install: `vybeslides <dir> [flags]`
   - Tests: entry point invocation, argument passing

---

## Test-Driven Development Examples

### Example 1: slides.txt Parser

```typescript
// RED
describe('parseSlidesTxt', () => {
  it('should parse slide entry with whitespace variations', () => {
    const content = '  slide.md  before:tvon  after:tvoff  ';
    const result = parseSlidesTxt(content);
    expect(result).toEqual([
      { filename: 'slide.md', beforeTransition: 'tvon', afterTransition: 'tvoff' },
    ]);
  });

  it('should parse with directive before filename', () => {
    const content = 'before:diagonal after:tvoff slide.md';
    const result = parseSlidesTxt(content);
    expect(result).toEqual([
      { filename: 'slide.md', beforeTransition: 'diagonal', afterTransition: 'tvoff' },
    ]);
  });

  it('should skip empty lines', () => {
    const content = 'slide1.md\n\nslide2.md';
    const result = parseSlidesTxt(content);
    expect(result).toHaveLength(2);
  });

  it('should parse entry with no transitions', () => {
    const content = 'slide.md';
    const result = parseSlidesTxt(content);
    expect(result).toEqual([{ filename: 'slide.md', beforeTransition: null, afterTransition: null }]);
  });
});

// GREEN
export const parseSlidesTxt = (content: string): SlideEntry[] => {
  return content
    .split('\n')
    .filter((line) => line.trim() !== '')
    .map((line) => parseSlideEntry(line));
};
```

### Example 2: Validator

```typescript
// RED
describe('validatePresentation', () => {
  it('should pass validation for valid presentation', () => {
    const result = validatePresentation(mockValidPath);
    expect(result.error).toBeUndefined();
    expect(result.data.slides).toHaveLength(3);
  });

  it('should fail with error if slides.txt is missing', () => {
    const result = validatepresentation(mockMissingSlidesTxtPath);
    expect(result.error).toBeDefined();
    expect(result.error?.message).toContain('slides.txt not found');
  });

  it('should fail with error if referenced .md file does not exist', () => {
    const result = validatePresentation(mockMissingSlidePath);
    expect(result.error).toBeDefined();
    expect(result.error?.message).toContain('slide.md not found');
  });

  it('should fail with error if subdirectory is used', () => {
    const result = validatePresentation(mockSubdirPath);
    expect(result.error).toBeDefined();
    expect(result.error?.message).toContain('subdirectories not allowed');
  });

  it('should fail with error if transition name is invalid', () => {
    const result = validatePresentation(mockInvalidTransitionPath);
    expect(result.error).toBeDefined();
    expect(result.error?.message).toContain('invalid transition');
  });
});

// GREEN
export const validatePresentation = (dirPath: string): ValidationResult => {
  const slidesTxtPath = path.join(dirPath, 'slides.txt');
  if (!fs.existsSync(slidesTxtPath)) {
    return { error: new Error(`slides.txt not found in ${dirPath}`) };
  }
  // ... validation logic
};
```

### Example 3: Navigation State Machine

```typescript
// RED
describe('Navigator', () => {
  it('should navigate forward with transition', () => {
    const nav = createNavigator(5, {
      currentBefore: 'diagonal',
      currentAfter: null,
      nextBefore: null,
    });
    const result = nav.handleForward();
    expect(result.transition).toBe('diagonal');
    expect(result.nextIndex).toBe(1);
  });

  it('should not navigate forward on last slide', () => {
    const nav = createNavigator(5, { currentBefore: null, currentAfter: null });
    nav.currentSlideIndex = 4;
    const result = nav.handleForward();
    expect(result.shouldNavigate).toBe(false);
  });

  it('should navigate backward instantly without transition', () => {
    const nav = createNavigator(5, {});
    nav.currentSlideIndex = 2;
    const result = nav.handleBackward();
    expect(result.transition).toBeNull();
    expect(result.nextIndex).toBe(1);
  });

  it('should cancel transition and stay on current slide when ESC pressed mid-wipe', () => {
    const nav = createNavigator(5, {});
    nav.transitionInProgress = true;
    const result = nav.handleKey('Escape');
    expect(result.cancelTransition).toBe(true);
    expect(result.nextIndex).toBe(nav.currentSlideIndex);
  });

  it('should cancel transition and go up when PgUp pressed mid-wipe', () => {
    const nav = createNavigator(5, {});
    nav.currentSlideIndex = 2;
    nav.transitionInProgress = true;
    const result = nav.handleBackward();
    expect(result.cancelTransition).toBe(true);
    expect(result.nextIndex).toBe(1);
  });

  it('should cancel transition and go down when PgDn pressed mid-wipe', () => {
    const nav = createNavigator(5, {});
    nav.currentSlideIndex = 1;
    nav.transitionInProgress = true;
    const result = nav.handleForward();
    expect(result.cancelTransition).toBe(true);
    expect(result.nextIndex).toBe(2);
  });

  it('should apply blank duration for sequential transitions', () => {
    const nav = createNavigator(5, { currentAfter: 'leftwipe', nextBefore: 'rightwipe' });
    const result = nav.handleForward();
    expect(result.hasBlankDelay).toBe(true);
  });
});
```

### Example 4: Wipe Visibility Calculation

```typescript
// RED
describe('DiagonalWipe', () => {
  it('should show no content at 0% progress', () => {
    const visible = calculateDiagonalWipeVisibility(0, 80, 24);
    expect(visible.every((row) => row.every((cell) => cell === false))).toBe(true);
  });

  it('should show all content at 100% progress', () => {
    const visible = calculateDiagonalWipeVisibility(100, 80, 24);
    expect(visible.every((row) => row.every((cell) => cell === true))).toBe(true);
  });

  it('should show top-left cells at 25% progress', () => {
    const visible = calculateDiagonalWipeVisibility(25, 80, 24);
    expect(visible[0][0]).toBe(true);
    expect(visible[0][20]).toBe(false);
    expect(visible[10][0]).toBe(false);
  });

  it('should calculate diagonal correctly', () => {
    const visible = calculateDiagonalWipeVisibility(50, 80, 24);
    // At 50%, any cell where col + row <= (width + height) / 2 should be visible
    const threshold = (80 + 24) / 2;
    expect(visible[12][40]).toBe(true);
    expect(visible[12][41]).toBe(false);
  });
});

// GREEN
export const calculateDiagonalWipeVisibility = (
  progress: number, // 0-100
  width: number,
  height: number,
): VisibilityMask => {
  const threshold = ((width + height) * progress) / 100;
  const mask: VisibilityMask = [];

  for (let y = 0; y < height; y++) {
    const row: boolean[] = [];
    for (let x = 0; x < width; x++) {
      row.push(x + y <= threshold);
    }
    mask.push(row);
  }

  return mask;
};

// Timing test example (reasonable bounds, not exact)
describe('DiagonalWipe timing', () => {
  it('should complete in reasonable time (not instant, not stuck)', async () => {
    const wipe = createDiagonalWipe();

    const startTime = Date.now();
    await wipe.toCompletion();
    const duration = Date.now() - startTime;

    // Very loose bounds to avoid flakiness across environments
    expect(duration).toBeGreaterThan(10);  // Not instant (would indicate bug)
    expect(duration).toBeLessThan(10000);  // Not stuck in loop

    // Verify it actually completed
    expect(wipe.getProgress()).toBe(100);
  });
});
```

---

## Complexity Management

Following LLXPRT packages/ui rules:
- **Function warn limit**: 80 lines
- **Function error limit**: 120 lines
- **File warn limit**: 800 lines (not expected to reach)
- Run `bun run check:limits` before commits

**Strategies to stay within limits:**
- Break complex functions into smaller pure functions
- Extract validation logic into separate functions
- Use data-driven approaches for patterns (transition registry, etc.)
- Keep component render logic minimal
- Extract algorithms into separate testable units

---

## Configuration Files

### package.json
```json
{
  "name": "@vybestack/vybeslides",
  "version": "1.0.0",
  "description": "Retro terminal-based slide presenter with 1980s debug.com style transitions",
  "type": "module",
  "main": "src/cli/index.ts",
  "bin": {
    "vybeslides": "./src/cli/index.ts"
  },
  "scripts": {
    "dev": "bun run src/main.tsx",
    "start": "bun run src/main.tsx",
    "lint": "bunx eslint \"src/**/*.{ts,tsx}\"",
    "test": "bunx vitest run",
    "test:watch": "bunx vitest",
    "test:coverage": "bunx vitest run --coverage",
    "check:limits": "bun run scripts/check-limits.ts",
    "check": "bun run lint && bun run test && bun run check:limits",
    "typecheck": "bunx tsc --noEmit",
    "postinstall": "bun run scripts/check-bun.js"
  },
  "dependencies": {
    "@vybestack/opentui-core": "^0.1.62",
    "@vybestack/opentui-react": "^0.1.62",
    "react": "^19.2.1",
    "zod": "^3.23.0"
  },
  "devDependencies": {
    "@eslint/js": "^9.39.1",
    "@testing-library/react": "^16.3.0",
    "@types/bun": "^1.3.4",
    "@types/node": "^24.10.1",
    "@types/react": "^19.2.7",
    "@typescript-eslint/eslint-plugin": "^8.48.1",
    "@typescript-eslint/parser": "^8.48.1",
    "@vitest/eslint-plugin": "^1.5.1",
    "eslint": "^9.39.1",
    "eslint-plugin-react-hooks": "^7.0.1",
    "globals": "^16.5.0",
    "happy-dom": "^18.0.1",
    "typescript": "^5.9.3",
    "vitest": "^4.0.15"
  },
  "engines": {
    "bun": ">=1.2.0"
  },
  "files": [
    "src",
    "package.json",
    "README.md",
    "LICENSE"
  ],
  "repository": {
    "type": "git",
    "url": "https://github.com/vybestack/vybeslides.git"
  },
  "keywords": [
    "slides",
    "presentation",
    "terminal",
    "cli",
    "retro",
    "greenscreen",
    "vybestack"
  ],
  "license": "ISC"
}
```

**Note:** Package is published to npmjs.org. Users must have Bun installed separately. The install-check script runs post-install to verify Bun availability and warn if missing.

### tsconfig.json
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "lib": ["ESNext", "DOM", "DOM.Iterable"],
    "jsx": "react-jsx",
    "jsxImportSource": "@vybestack/opentui-react",
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "noImplicitThis": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "resolveJsonModule": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "allowImportingTsExtensions": true,
    "noEmit": true,
    "types": ["node", "bun", "vitest/globals"],
    "skipLibCheck": true,
    "baseUrl": "."
  },
  "include": ["src", "scripts"],
  "exclude": ["node_modules", "dist"]
}
```

### vitest.config.ts
```typescript
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['src/**/*.test.ts'],
    globals: true,
    environment: 'happy-dom',
  },
});
```

### scripts/check-bun.js (Post-install check)
```javascript
#!/usr/bin/env node
import { spawn } from 'child_process';

const exitCode = await new Promise((resolve) => {
  const proc = spawn('bun', ['--version'], { stdio: 'pipe' });

  proc.on('close', (code) => resolve(code));
  proc.on('error', () => resolve(1));

  setTimeout(() => {
    proc.kill();
    resolve(1);
  }, 5000);
});

if (exitCode !== 0) {
  console.error('╔═══════════════════════════════════════════════════════════╗');
  console.error('║  VybeSlides requires Bun runtime                          ║');
  console.error('╠═══════════════════════════════════════════════════════════╣');
  console.error('║  Install Bun: curl -fsSL https://bun.sh/install | bash   ║');
  console.error('╚═══════════════════════════════════════════════════════════╝');
  process.exit(0); // Don't fail install, just warn
}
```

---

## Phase Dependencies

```
Phase 1 (Foundation) ─┐
                      │
Phase 2 (Slides) ─────┤
                      ├────────► Phase 6 (UI Components)
                      │
Phase 3 (Markdown) ───┤
                      │
Phase 4 (Transitions) ├───┐
                      │   │
Phase 5 (Navigation) ─┼──►┴─► Phase 7 (CLI Integration)
                      │
                      └────────► Phase 7 (CLI Integration)
```

**Key Points:**
- Foundation (Phase 1) enables everything else
- Components (Phase 6) needs types from Phases 2-5
- CLI Integration (Phase 7) only after all features are implemented
- Transitions (Phase 4) and Navigation (Phase 5) can develop in parallel

---

## Test Fixtures

Create comprehensive test fixtures for edge cases:

```
test/fixtures/valid-presentations/
├── basic/
│   ├── slides.txt              # 3 slides, no transitions
│   ├── 00-title.md
│   ├── 01-content.md
│   └── 02-end.md
├── with-transitions/
│   ├── slides.txt              # All transition combinations
│   ├── 00-tvon.md              # before:tvon
│   ├── 01-leftwipe.md         # after:leftwipe
│   ├── 02-both.md             # before:topwipe after:bottomwipe
│   ├── 03-diagonal.md         # before:diagonal
│   └── 04-tvoff.md            # before:tvoff after:tvoff
└── edge-cases/
    ├── 20-slides.txt          # For testing multi-digit jumps
    ├── 00.md through 19.md

test/fixtures/invalid/
├── missing-file/               # slides.txt references non-existent file
├── invalid-transition/         # Typo in transition name
├── subdirectory/               # Uses subdir/slide.md
├── absolute-path/              # Uses /absolute/path/slide.md
└── malformed-directive/        # "befor:tvon" typo
```

---

## Design Decisions

The following decisions were made during implementation planning:

### 1. Naming Convention
**Decision: Follow LLXPRT packages/ui conventions**
- Source files: `PascalCase.ts`, `PascalCase.tsx` (e.g., `BoxBorder.tsx`, `Navigator.ts`)
- Test files: `*.test.ts` (e.g., `Navigator.test.ts`)
- Rationale: Consistent with the codebase we're emulating; easier to copy patterns from LLXPRT
- Note: This deviates from RULES.md's `*.spec.ts` + `kebab-case` requirement, documented as project-specific exception

### 2. Cancel Behavior During Transitions
**Decision: Cancel based on key type**
- **ESC**: Cancel wipe, stay on current slide (no navigation)
- **PgUp / ↑**: Cancel wipe, navigate to previous slide
- **PgDn / ↓ / → / Space / n**: Cancel wipe, navigate to next slide
- **0-9**: Cancel wipe, jump to numbered slide
- **q**: Cancel wipe, quit presentation
- Rationale: Behavior matches user expectations and requirements specification

### 3. Bun Runtime & Publishing
**Decision: Require Bun, publish to npmjs.org**

- Package name: `@vybestack/vybeslides`
- Published to: npmjs.org
- Runtime requirement: Bun (not optional, not bundled)
- No JavaScript compilation (direct TypeScript execution)
- No Bun duplication in node_modules (single global install by user)
- Post-install check warns users if Bun is missing

User experience:
```bash
$ npm install -g @vybestack/vybeslides  # Fast, ~2MB
$ vybeslides my-dir
Error: VybeSlides requires Bun. Install: curl -fsSL https://bun.sh/install | bash
$ curl -fsSL https://bun.sh/install | bash
$ vybeslides my-dir  # Works!
```

- Rationale: Avoids 80MB+ bun duplication, keeps package size small, aligns with "let's run TypeScript" requirement

### 4. Transition Timing Tests
**Decision: Reasonable bounds, not exact time**

Tests enforce:
- Not instant (<10ms) - would indicate bug
- Not stuck in loop (<10000ms) - would indicate infinite loop
- Verifies transition completes to 100%

Does NOT enforce:
- Exact timing (800-1200ms, 2s for TV effects)
- No brittle timing dependencies

Rationale: Avoids flaky tests in CI, focuses on behavior (completion) over implementation timing

---

## Next Steps

1. **Begin Phase 1** with TDD, creating foundation in small increments
2. **Run `bun run check:limits`** after each feature to stay within complexity bounds
3. **Maintain 100% test coverage** throughout development
5. **Maintain 100% test coverage** throughout development

---

## Success Criteria

- [OK] All requirements from requirements.md implemented
- [OK] 100% behavior coverage (behavior-based tests, not implementation)
- [OK] No TypeScript errors or warnings
- [OK] No ESLint warnings
- [OK] All functions under complexity limits (check:limits passes)
- [OK] All tests pass on Bun runtime
- [OK] Fast-fail validation works correctly
- [OK] All transition effects render correctly
- [OK] Navigation matches expected behavior
- [OK] Demo presentation included in test fixtures