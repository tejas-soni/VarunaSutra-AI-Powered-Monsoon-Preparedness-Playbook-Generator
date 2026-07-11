import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    include: ['src/**/*.test.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      include: ['src/lib/**/*.{ts,tsx}', 'src/components/**/*.{ts,tsx}'],
      exclude: [
        'src/**/*.test.{ts,tsx}',
        'src/test/**',
        '**/*.d.ts',
        '**/types.ts',
        '**/constants.ts',
      ],
      // ENFORCED gates — the build FAILS below these. Set up EARLY, never after code exists.
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80,
        // The pure-function engine is the core — held to a higher bar.
        'src/lib/**/*.ts': {
          lines: 95,
          functions: 95,
          branches: 90,
          statements: 95,
        },
      },
    },
  },
});
