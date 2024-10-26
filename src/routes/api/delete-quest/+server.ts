import { error, json } from '@sveltejs/kit';
import { db } from '$lib/db';
import { questsTable } from '$lib/db/schema';
import { eq } from 'drizzle-orm';

export const DELETE = async ({ request }) => {
    const { questId } = await request.json();

    // Kontrola, zda byl questId poslán
    if (!questId) throw error(400, 'Quest ID is required');

    try {
        // Mazání questu na základě questId s použitím 'eq' pro SQLite
        await db.delete(questsTable).where(eq(questsTable.id, questId)).execute();

        // Návrat úspěšné odpovědi
        return json({ success: true });
    } catch (err) {
        console.error('Error deleting quest:', err);
        throw error(500, 'Failed to delete quest');
    }
};
