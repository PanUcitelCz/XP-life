import { db } from '$lib/db';
import { strengthTable, dexterityTable, constitutionTable, intelligenceTable, wisdomTable, charismaTable } from '$lib/db/schema';
import { eq } from 'drizzle-orm';
import { json } from '@sveltejs/kit';

export const GET = async ({ locals }) => {
  // Zkontrolovat, zda je uživatel přihlášen
  if (!locals.user) {
    return json({ error: 'Not authenticated' }, { status: 401 });
  }

  const userId = locals.user.id;

  // Načíst aktivity z jednotlivých tabulek kategorií
  const strengthActivities = await db.select().from(strengthTable).where(eq(strengthTable.userId, userId)).all();
  const dexterityActivities = await db.select().from(dexterityTable).where(eq(dexterityTable.userId, userId)).all();
  const constitutionActivities = await db.select().from(constitutionTable).where(eq(constitutionTable.userId, userId)).all();
  const intelligenceActivities = await db.select().from(intelligenceTable).where(eq(intelligenceTable.userId, userId)).all();
  const wisdomActivities = await db.select().from(wisdomTable).where(eq(wisdomTable.userId, userId)).all();
  const charismaActivities = await db.select().from(charismaTable).where(eq(charismaTable.userId, userId)).all();

  // Spojit všechny aktivity do jednoho pole
  const allActivities = [
    ...strengthActivities.map(a => ({ ...a, category: 'Strength' })),
    ...dexterityActivities.map(a => ({ ...a, category: 'Dexterity' })),
    ...constitutionActivities.map(a => ({ ...a, category: 'Constitution' })),
    ...intelligenceActivities.map(a => ({ ...a, category: 'Intelligence' })),
    ...wisdomActivities.map(a => ({ ...a, category: 'Wisdom' })),
    ...charismaActivities.map(a => ({ ...a, category: 'Charisma' }))
  ];

  return json(allActivities);
};
