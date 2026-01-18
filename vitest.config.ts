import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['src/**/*.test.ts', 'src/**/*.test.tsx'],
    exclude: [
      'src/main.test.tsx',
      'src/runtime/**/*.test.ts',
      'src/runtime/**/*.test.tsx',
      'src/components/**/*.test.tsx',
      'src/cli/index.test.ts',
    ],
    globals: true,
    environment: 'happy-dom',
  },
});
