import { readdir } from 'fs/promises';
import { resolve } from 'path';

export const GET = async () => {
	try {
		const profileImagesDir = resolve('/profile');
		const files = await readdir(profileImagesDir);
		const images = files.map((file) => `/profile/${file}`);
		return new Response(JSON.stringify(images), { status: 200 });
	} catch (error) {
		console.error('Failed to load profile images:', error);
		return new Response('Failed to load images', { status: 500 });
	}
};
