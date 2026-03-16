import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@tests': path.resolve(__dirname, 'tests'),
      // Resolve styles from the real package (alias below would otherwise point to cjs entry)
      '@mantine/core/styles.css': path.resolve(
        __dirname,
        'node_modules/@mantine/core/styles.css',
      ),
      '@mantine/core/styles.layer.css': path.resolve(
        __dirname,
        'node_modules/@mantine/core/styles.layer.css',
      ),
      // Force one @mantine/core instance so React context is shared (fixes VirtualTable tests)
      '@mantine/core': path.resolve(
        __dirname,
        'node_modules/@mantine/core/cjs/index.cjs',
      ),
      '@mantine/hooks': path.resolve(
        __dirname,
        'node_modules/@mantine/hooks/cjs/index.cjs',
      ),
    },
    dedupe: ['react', 'react-dom', '@mantine/core', '@mantine/hooks'],
  },
  plugins: [react()],
});
