# VybeSlides - Runtime Wiring (TDD Implementation Plan)

## Objective

Wire VybeSlides so the CLI runs presentations end-to-end using OpenTUI. The runtime already validates slides; this plan focuses on mounting the OpenTUI app, rendering slides, driving transitions, and handling navigation in real time.

## Constraints & Rules

- Follow `llxprt-code/dev-docs/RULES.md` (test-first mandatory, no `any`, no type assertions, immutable data only)
- Follow `llxprt-code/packages/ui` conventions (ESLint complexity limits, TypeScript strictness, component patterns)
- Tests use Vitest + React Testing Library (existing stack)
- OpenTUI stack (`@vybestack/opentui-core` + `@vybestack/opentui-react`)
- Runtime is TypeScript only (no JS build step)
- Provide a Node-compatible runner that invokes Bun (no JS compilation)

## Scope (What Exists Already)

- Slides parsing, validation, transitions, navigation, markdown, and UI components are implemented and tested
- CLI validates input and exits; it does not render
- `src/main.tsx` is a stub and is never mounted

## Goals

1. Mount OpenTUI app from CLI and render slides
2. Drive transitions using OpenTUI timelines and render hooks
3. Apply navigation rules (forward/back/jump/quit) with transitions
4. Provide a Node-friendly launcher that shells out to Bun
5. Add tests for end-to-end runtime behaviors

---

## Architecture Targets

```
CLI (src/cli/index.ts)
  └─ RuntimeRunner
     ├─ createRenderer (OpenTUI)
     ├─ createRoot + mount App
     └─ bind input + render loop

App (src/main.tsx)
  ├─ PresentationRuntime (new)
  │  ├─ PresentationState (existing)
  │  ├─ TransitionOrchestrator (new)
  │  ├─ NavigationHandler (existing)
  │  └─ Renderers (existing UI components)
  └─ Layout shell (header/footer)
```

---

## TDD Plan (Phased)

### Phase 1 — Runtime Entry + CLI Wiring

**Goal:** CLI launches OpenTUI renderer and mounts the app.

**Tests (RED):**
1. `RuntimeRunner` should create OpenTUI renderer and mount app
2. `RuntimeRunner` should pass presentation data + CLI flags to app
3. `RuntimeRunner` should teardown renderer on quit
4. CLI should invoke runtime runner after validation
5. CLI should exit with non-zero on runtime errors
6. Node launcher should invoke Bun entrypoint with passthrough args
7. Node launcher should exit with clear message when Bun missing

**Implementation (GREEN):**
- Add `src/runtime/RuntimeRunner.ts` to create renderer/root and mount
- Update `src/cli/Runner.ts` to start runtime after validation
- Update `src/cli/index.ts` to call runtime and exit on fatal error
- Add `scripts/launch-node.js` (Node JS shim) to spawn Bun for Node installs
- Use `@vybestack/opentui-core/testing` for test renderer + mock input

**Refactor:**
- Keep runner pure and testable (DI for renderer factory)
- Ensure explicit return types and logger usage in runtime code

---

### Phase 2 — Presentation Runtime Component

**Goal:** Render current slide and handle OpenTUI input loop.

**Tests (RED):**
1. App renders slide content from loaded presentation
2. Header/footer respect CLI flags (`--header off`, `--footer off`)
3. Jump navigation renders new slide instantly
4. Back navigation renders instantly without transitions

**Implementation (GREEN):**
- Add `PresentationRuntime.tsx` to manage state and input
- Use existing navigation features for action mapping
- Render `SlideDisplay` with current slide content
- Hook OpenTUI input to navigation (useKeypress)

---

### Phase 3 — Transition Orchestration

**Goal:** Apply transitions between slides using OpenTUI timeline.

**Tests (RED):**
1. Forward nav uses `before:` transition if no `after:`
2. Sequential transition applies `after` → blank → `before`
3. Quit triggers `after:tvoff` only on last slide
4. Forward keys on last slide do nothing
5. Cancel during transition aborts and jumps immediately

**Implementation (GREEN):**
- Add `TransitionOrchestrator.ts` to compute transition steps
- Use existing transition registry + masking utilities
- Use OpenTUI `useTimeline` or `createTimeline` to animate progress
- Use `renderBefore`/`renderAfter` hooks to draw masked buffers

---

### Phase 4 — Buffer Composition & Render Hooks

**Goal:** Overlapping wipes blend old/new slide content correctly.

**Tests (RED):**
1. Overlapping wipe shows old + new simultaneously
2. Sequential wipe renders blank frame between steps
3. TV on/off animations render static box and expand/collapse

**Implementation (GREEN):**
- Add `renderBefore`/`renderAfter` on slide container
- Capture previous frame buffer and apply visibility mask
- Apply blank frame as explicit step (100ms)
- Use static noise generator for TV transitions

---

### Phase 5 — End-to-End Runtime Tests

**Goal:** Validate CLI → presentation runtime integration.

**Tests (RED):**
1. `vybeslides ./deck` mounts OpenTUI and renders first slide
2. Simulated PgDown advances to slide 2 with transition
3. Simulated PgUp goes back instantly
4. `q` on last slide triggers `tvoff`

**Implementation (GREEN):**
- Use OpenTUI test renderer (`createTestRenderer`) to capture frames
- Use mock key input to simulate navigation
- Assert visible text frames after transitions

---

## Runtime Entry Points

- `src/cli/index.ts` remains primary CLI
- `src/cli/Runner.ts` should call runtime after validation
- `src/main.tsx` becomes OpenTUI app entry
- `scripts/launch-node.js` (new) used as `bin` when running under Node
  - JS shim only (no TypeScript loader required)
  - Strictly spawns Bun to execute `src/cli/index.ts`

**Node runner behavior:**
- Detects Bun availability
- If Bun exists: run `bun src/cli/index.ts` with args
- If Bun missing: print clear error and exit

---

## Test Strategy

- Each runtime behavior begins with a failing test
- Use `@vybestack/opentui-core/testing` for renderer + mock input
- Avoid mocks for OpenTUI internals; prefer black-box frame capture
- Keep each test single-behavior, single-assertion
- Follow packages/ui logging conventions (no `console`, use existing logger)

---

## Quality Gates

- `bun run test`
- `bun run lint`
- `bun run check:limits`
- `bun run typecheck`

---

## Deliverables

- Runtime wiring and CLI startup
- Presentation runtime component
- Transition orchestration in OpenTUI
- Node-compatible launcher
- Full test coverage for runtime behaviors
