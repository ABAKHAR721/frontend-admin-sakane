import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
    setupFiles: [path.resolve(__dirname, 'src/server/test/setup.ts')],
    testTimeout: 10000,
    watch: false,
    globals: true,
    isolate: true,
  },
});
