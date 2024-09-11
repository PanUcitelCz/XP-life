import { db } from '$lib/db';
import { strengthTable, dexterityTable, constitutionTable, intelligenceTable, wisdomTable, charismaTable } from '$lib/db/schema';
import { eq } from 'drizzle-orm';
import { json } from '@sveltejs/kit';

export const GET = async ({ locals }) => {
  if (!locals.user) {
    return json({ error: 'Not authenticated' }, { status: 401 });
  }

  // Načíst všechny kategorie pro uživatele
  const strength = await db.select().from(strengthTable).where(eq(strengthTable.userId, locals.user.id)).all();
  const dexterity = await db.select().from(dexterityTable).where(eq(dexterityTable.userId, locals.user.id)).all();
  const constitution = await db.select().from(constitutionTable).where(eq(constitutionTable.userId, locals.user.id)).all();
  const intelligence = await db.select().from(intelligenceTable).where(eq(intelligenceTable.userId, locals.user.id)).all();
  const wisdom = await db.select().from(wisdomTable).where(eq(wisdomTable.userId, locals.user.id)).all();
  const charisma = await db.select().from(charismaTable).where(eq(charismaTable.userId, locals.user.id)).all();

  return json({
    strength,
    dexterity,
    constitution,
    intelligence,
    wisdom,
    charisma
  });
};
