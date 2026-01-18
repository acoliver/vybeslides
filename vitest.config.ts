import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['src/**/*.test.ts', 'src/**/*.test.tsx'],
    exclude: [
      'src/main.test.tsx',
      'src/runtime/PresentationRuntime.test.tsx',
      'src/runtime/TransitionOrchestrator.test.ts',
      'src/components/**/*.test.tsx',
      'src/cli/index.test.ts',
    ],
    globals: true,
    environment: 'happy-dom',
  },
});
