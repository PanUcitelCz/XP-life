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

// Explicitně definuj typ pro categoryTables
const categoryTables: Record<string, any> = {
  Strength: strengthTable,
  Dexterity: dexterityTable,
  Constitution: constitutionTable,
  Intelligence: intelligenceTable,
  Wisdom: wisdomTable,
  Charisma: charismaTable,
};

export const POST = async ({ request, locals }) => {
  const { activityName, category } = await request.json();

  if (!locals.user) {
    return json({ error: 'Not authenticated' }, { status: 401 });
  }

  const table = categoryTables[category];
  if (!table) {
    return json({ error: 'Invalid category' }, { status: 400 });
  }

  try {
    await db.delete(table).where(and(eq(table.userId, locals.user.id), eq(table.activityName, activityName))).run();
    return json({ success: true });
  } catch (error) {
    console.error(error);
    return json({ error: 'Failed to delete activity' }, { status: 500 });
  }
};
