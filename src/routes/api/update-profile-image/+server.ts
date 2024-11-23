import { usersTable } from '$lib/db/schema';
import { db } from '$lib/db'; // Připojení k databázi
import { eq } from 'drizzle-orm/expressions';

export const POST = async ({ request, locals }) => {
	try {
		const { profileImage } = await request.json();
		const userId = locals.user?.id; // Předpokládáme, že ID uživatele je uloženo v locals

		if (!userId || !profileImage) {
			return new Response('Invalid request', { status: 400 });
		}

		await db
			.update(usersTable)
			.set({ profileImage })
			.where(eq(usersTable.id, userId));

		return new Response(JSON.stringify({ success: true }), { status: 200 });
	} catch (error) {
		console.error('Failed to update profile image:', error);
		return new Response('Failed to update profile image', { status: 500 });
	}
};
