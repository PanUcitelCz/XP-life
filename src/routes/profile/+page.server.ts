import { db } from '$lib/db';
import { usersTable, strengthTable, dexterityTable, constitutionTable, intelligenceTable, wisdomTable, charismaTable } from '$lib/db/schema';
import { eq } from 'drizzle-orm';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
  if (!locals.user) {
    throw error(404, 'Not found');
  }

  // Načtení uživatele
  const user = await db.select().from(usersTable).where(eq(usersTable.id, locals.user.id)).get();
  console.log('Loaded user:', user);

  if (!user) {
    throw error(404, {
      message: 'User not found',
    });
  }

  // Načtení aktivit z jednotlivých tabulek podle kategorií
  const strengthActivities = await db.select().from(strengthTable).where(eq(strengthTable.userId, user.id)).all();
  const dexterityActivities = await db.select().from(dexterityTable).where(eq(dexterityTable.userId, user.id)).all();
  const constitutionActivities = await db.select().from(constitutionTable).where(eq(constitutionTable.userId, user.id)).all();
  const intelligenceActivities = await db.select().from(intelligenceTable).where(eq(intelligenceTable.userId, user.id)).all();
  const wisdomActivities = await db.select().from(wisdomTable).where(eq(wisdomTable.userId, user.id)).all();
  const charismaActivities = await db.select().from(charismaTable).where(eq(charismaTable.userId, user.id)).all();

  // Zkombinování všech aktivit do jednoho objektu
  const activities = {
    strength: strengthActivities,
    dexterity: dexterityActivities,
    constitution: constitutionActivities,
    intelligence: intelligenceActivities,
    wisdom: wisdomActivities,
    charisma: charismaActivities
  };

  // Předání uživatele a aktivit na stránku
  return {
    props: {
      user: {
        id: user.id,
        email: user.email,
        nickname: user.nickname
      },
      activities // Předání aktivit rozdělených podle kategorií
    }
  };
};
