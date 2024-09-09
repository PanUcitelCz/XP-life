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
      '@imgs': path.resolve(__dirname, './src/lib/imgs'), // Alias pro obrázky
      // můžeš přidat další aliasy podle potřeby
    }
  }
});
