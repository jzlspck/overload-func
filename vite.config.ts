import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/entry'),
      name: 'Overload',
      fileName: (format) => `overload.${format}.js`
    },
    outDir: resolve(__dirname, 'dist')
  }
});
