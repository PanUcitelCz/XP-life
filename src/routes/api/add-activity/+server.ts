import { db } from '$lib/db';
import { strengthTable, dexterityTable, constitutionTable, intelligenceTable, wisdomTable, charismaTable } from '$lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { json } from '@sveltejs/kit';

export const POST = async ({ request, locals }) => {
  const { userId, category, activityName, description, difficulty } = await request.json();

  if (!locals.user || locals.user.id !== userId) {
    return json({ error: 'Not authenticated' }, { status: 401 });
  }

  let table;
  switch (category) {
    case 'Strength':
      table = strengthTable;
      break;
    case 'Dexterity':
      table = dexterityTable;
      break;
    case 'Constitution':
      table = constitutionTable;
      break;
    case 'Intelligence':
      table = intelligenceTable;
      break;
    case 'Wisdom':
      table = wisdomTable;
      break;
    case 'Charisma':
      table = charismaTable;
      break;
    default:
      return json({ error: 'Invalid category' }, { status: 400 });
  }

  // Kontrola, zda již existuje aktivita se stejným názvem pro tuto kategorii
  const existingActivity = await db
    .select()
    .from(table)
    .where(and(eq(table.userId, userId), eq(table.activityName, activityName)))
    .get();

  if (existingActivity) {
    return json({ error: 'Activity with this name already exists in this category' }, { status: 400 });
  }

  // Přidání nové aktivity
  await db
    .insert(table)
    .values({
      userId,
      activityName,
      description,
      difficulty,
      level: 1,
      points: 0,
      lastXPAdded: null,
      createdAt: new Date().toISOString()
    })
    .run();

  return json({ success: true });
};
