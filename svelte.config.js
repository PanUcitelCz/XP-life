import preprocess from 'svelte-preprocess';
import adapter from '@sveltejs/adapter-auto';

export default {
  kit: {
    adapter: adapter(),
  },
  preprocess: preprocess({
    stylus: {
      imports: ['./src/lib/css/global.styl'], // Globální import pro Stylus
    },
    sourceMap: false, // Povolit zdrojové mapy pro lepší debugging
  }),
};
