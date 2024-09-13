import { db } from '$lib/db';
import { strengthTable, dexterityTable, constitutionTable, intelligenceTable, wisdomTable, charismaTable } from '$lib/db/schema';
import { eq } from 'drizzle-orm';
import { json } from '@sveltejs/kit';

export const POST = async ({ request, locals }) => {
  const { activityId, category } = await request.json();

  // Zkontrolovat, zda je uživatel přihlášen
  if (!locals.user) {
    return json({ error: 'Not authenticated' }, { status: 401 });
  }

  // Vyber správnou tabulku podle kategorie
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

  // Načíst aktivitu podle ID
  const activity = await db
    .select()
    .from(table)
    .where(eq(table.id, activityId))
    .get();

  if (!activity) {
    return json({ error: 'Activity not found' }, { status: 404 });
  }

  // Zkontrolovat, jestli XP byly přidány dnes (jen kontrola na základě dne)
  const today = new Date().toISOString().split('T')[0]; // Dnešní datum v ISO formátu (YYYY-MM-DD)
  if (activity.lastXPAdded && activity.lastXPAdded.split('T')[0] === today) {
    return json({ error: 'XP already added today' }, { status: 400 });
  }

  // Vypočítat nové body a úroveň na základě obtížnosti
  let xpToAdd = 0;
  switch (activity.difficulty) {
    case 'easy':
      xpToAdd = 5;
      break;
    case 'normal':
      xpToAdd = 10;
      break;
    case 'hard':
      xpToAdd = 15;
      break;
    default:
      xpToAdd = 0;
  }

  const updatedPoints = activity.points + xpToAdd;
  const updatedLevel = Math.floor(updatedPoints / 100) + 1;

  // Aktualizovat aktivitu v databázi
  await db
    .update(table)
    .set({
      points: updatedPoints,
      level: updatedLevel,
      lastXPAdded: new Date().toISOString(), // Aktualizace lastXPAdded na současný čas
    })
    .where(eq(table.id, activityId))
    .run();

  return json({ success: true, updatedPoints, updatedLevel });
};