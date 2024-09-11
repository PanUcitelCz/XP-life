import { sveltekit } from '@sveltejs/kit/vite';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [sveltekit()],
  css: {
    preprocessorOptions: {
      stylus: {
        imports: [path.resolve('./src/lib/css/global.styl')], // Globální Stylus
      },
    },
  },
  resolve: {
    alias: {
      $lib: path.resolve('./src/lib'), // Správná cesta k aliasu $lib
    },
  },
});
