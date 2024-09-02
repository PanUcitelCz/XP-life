import preprocess from 'svelte-preprocess';
import adapter from '@sveltejs/adapter-auto';
import path from 'path';

export default {
  kit: {
    adapter: adapter(),
  },
  preprocess: preprocess(),
};
