import preprocess from 'svelte-preprocess';
import adapter from '@sveltejs/adapter-auto';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default {
  kit: {
    adapter: adapter(),
    vite: {
      css: {
        preprocessorOptions: {
          stylus: {
            imports: [path.resolve(__dirname, 'src/lib/css/global.styl')]
          }
        }
      }
    }
  },

  preprocess: preprocess(),

  // Přidání onwarn pro filtrování varování kompilátoru Svelte
  onwarn: (warning, handler) => {
    // Ignorování nepoužitých CSS selektorů
    if (warning.code === 'css-unused-selector') {
      return;
    }

    // Standardní zpracování pro ostatní varování
    handler(warning);
  }
};
