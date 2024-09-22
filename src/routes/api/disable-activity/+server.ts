import { db } from '$lib/db';
import { eq, and } from 'drizzle-orm';
import {
  strengthTable,
  dexterityTable,
  constitutionTable,
  intelligenceTable,
  wisdomTable,
  charismaTable,
} from '$lib/db/schema';
import { json } from '@sveltejs/kit';

// Mapování kategorií na příslušné tabulky
const categoryTables: Record<string, any> = {
  Strength: strengthTable,
  Dexterity: dexterityTable,
  Constitution: constitutionTable,
  Intelligence: intelligenceTable,
  Wisdom: wisdomTable,
  Charisma: charismaTable,
};

export const POST = async ({ request, locals }) => {
  try {
    const { activityId, category } = await request.json();

    console.log('Received activityId:', activityId, 'and category:', category);

    if (!locals.user) {
      return json({ error: 'Not authenticated' }, { status: 401 });
    }

    // Zkontrolujeme, že kategorie je platná
    const table = categoryTables[category];
    if (!table) {
      console.log('Invalid category received:', category);  // Logujeme špatnou kategorii
      return json({ error: 'Invalid category' }, { status: 400 });
    }

    // Najdi aktivitu podle ID a ověř, že patří aktuálnímu uživateli
    const activity = await db
      .select()
      .from(table)
      .where(and(eq(table.id, activityId), eq(table.userId, locals.user.id)))
      .get();

    if (!activity) {
      return json({ error: 'Activity not found or does not belong to user' }, { status: 404 });
    }

    // Aktualizuj sloupec `isActive` na 0
    await db
      .update(table)
      .set({ isActive: 0 })
      .where(eq(table.id, activityId))
      .run();

    return json({ success: true });
  } catch (error) {
    console.error('Error disabling activity:', error);
    return json({ error: 'Failed to disable activity' }, { status: 500 });
  }
};
