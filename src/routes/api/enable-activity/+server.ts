// src/routes/api/enable-activity/+server.ts
import { db } from '$lib/db';
import { strengthTable, dexterityTable, constitutionTable, intelligenceTable, wisdomTable, charismaTable } from '$lib/db/schema';
import { eq } from 'drizzle-orm';
import { json } from '@sveltejs/kit';

export const POST = async ({ request }) => {
	try {
		const { activityId, category } = await request.json();

		// Zkontroluj, jestli jsou zadány potřebné hodnoty
		if (!activityId || !category) {
			return json({ error: 'Invalid request' }, { status: 400 });
		}

		// Definice tabulky podle kategorie
		let table;
		switch (category.toLowerCase()) {
			case 'strength':
				table = strengthTable;
				break;
			case 'dexterity':
				table = dexterityTable;
				break;
			case 'constitution':
				table = constitutionTable;
				break;
			case 'intelligence':
				table = intelligenceTable;
				break;
			case 'wisdom':
				table = wisdomTable;
				break;
			case 'charisma':
				table = charismaTable;
				break;
			default:
				return json({ error: 'Invalid category' }, { status: 400 });
		}

		// Aktualizuj aktivitu na aktivní (isActive = 1)
		await db
			.update(table)
			.set({ isActive: 1 })
			.where(eq(table.id, activityId));

		return json({ message: 'Activity successfully enabled' }, { status: 200 });
	} catch (error) {
		console.error(error);
		return json({ error: 'Failed to enable activity' }, { status: 500 });
	}
};
