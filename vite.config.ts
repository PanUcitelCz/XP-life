import { sveltekit } from '@sveltejs/kit/vite';
import path from 'path';
import { defineConfig } from 'vite';
import fantasticonPlugin from './plugins/fantasticonPlugin';

const customCodepoints = {
	'arrow-right': 0xf200,
	'arrow-left': 0xf201
};

export default defineConfig({
	css: {
		preprocessorOptions: {
			stylus: {
				additionalData: `@import '${path.resolve(__dirname, 'src/lib/css/global.styl')}'\n`
			}
		}
	},
	plugins: [
		sveltekit(),
		fantasticonPlugin({
			codepoints: customCodepoints,
			normalize: true,
			inputDir: path.resolve(__dirname, 'src/lib/icons'),
			outputDir: path.resolve(__dirname, 'src/lib/css/fantasticon')
		})
	],
	resolve: {
		alias: {
			$lib: path.resolve('src/lib') // Správná cesta k aliasu $lib
		}
	}
});
