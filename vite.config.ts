import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Vitest options; type assertion needed because tsc -b uses Vite's types which don't include 'test'
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './tests/setup.ts',
  },
} as import('vite').UserConfigExport & { test?: import('vitest/config').UserWorkspaceConfig });
