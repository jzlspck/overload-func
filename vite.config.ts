import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/flip.ts'),
      name: 'Flip',
      fileName: (format) => `flip.${format}.js`
    },
    outDir: resolve(__dirname, 'lib')
  }
});
