import { readdir } from 'fs/promises';
import { resolve } from 'path';

export const GET = async () => {
    try {
        const profileImagesDir = resolve('./static/profile'); // Zkontroluj správnou cestu
        const files = await readdir(profileImagesDir);
        const images = files.map((file) => `/profile/${file}`); // URL pro obrázky
        return new Response(JSON.stringify(images), { status: 200 });
    } catch (error) {
        console.error('Failed to load profile images:', error);
        return new Response('Failed to load images', { status: 500 });
    }
};
