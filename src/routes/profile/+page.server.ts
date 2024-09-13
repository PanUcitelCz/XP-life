// src/routes/profile/+page.server.ts
import { db } from '$lib/db';
import { usersTable, strengthTable, dexterityTable, constitutionTable, intelligenceTable, wisdomTable, charismaTable } from '$lib/db/schema';
import { eq } from 'drizzle-orm';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
  if (!locals.user) {
    throw error(404, 'Not found');
  }

  const userId = locals.user.id;

  // Načtení uživatele
  const user = await db.select().from(usersTable).where(eq(usersTable.id, userId)).get();
  if (!user) {
    throw error(404, 'User not found');
  }

  // Načtení aktivit z jednotlivých kategorií
  const strengthPoints = await db.select({ points: strengthTable.points }).from(strengthTable).where(eq(strengthTable.userId, userId)).all();
  const dexterityPoints = await db.select({ points: dexterityTable.points }).from(dexterityTable).where(eq(dexterityTable.userId, userId)).all();
  const constitutionPoints = await db.select({ points: constitutionTable.points }).from(constitutionTable).where(eq(constitutionTable.userId, userId)).all();
  const intelligencePoints = await db.select({ points: intelligenceTable.points }).from(intelligenceTable).where(eq(intelligenceTable.userId, userId)).all();
  const wisdomPoints = await db.select({ points: wisdomTable.points }).from(wisdomTable).where(eq(wisdomTable.userId, userId)).all();
  const charismaPoints = await db.select({ points: charismaTable.points }).from(charismaTable).where(eq(charismaTable.userId, userId)).all();

  // Výpočet celkových bodů pro každou kategorii
  const getTotalPoints = (pointsArray: Array<{ points: number }>) => pointsArray.reduce((total, activity) => total + activity.points, 0);

  const strengthTotalPoints = getTotalPoints(strengthPoints);
  const dexterityTotalPoints = getTotalPoints(dexterityPoints);
  const constitutionTotalPoints = getTotalPoints(constitutionPoints);
  const intelligenceTotalPoints = getTotalPoints(intelligencePoints);
  const wisdomTotalPoints = getTotalPoints(wisdomPoints);
  const charismaTotalPoints = getTotalPoints(charismaPoints);

  // Funkce pro výpočet levelu na základě bodů
  const calculateLevel = (points: number) => {
    let level = 1;
    let threshold = 50;
    while (points >= threshold) {
      points -= threshold;
      level++;
      threshold += 25;
    }
    return level;
  };

  // Výpočet levelů
  const strengthLevel = calculateLevel(strengthTotalPoints);
  const dexterityLevel = calculateLevel(dexterityTotalPoints);
  const constitutionLevel = calculateLevel(constitutionTotalPoints);
  const intelligenceLevel = calculateLevel(intelligenceTotalPoints);
  const wisdomLevel = calculateLevel(wisdomTotalPoints);
  const charismaLevel = calculateLevel(charismaTotalPoints);

  // Aktualizace uživatelského levelu v DB (nejmenší level ze všech kategorií)
  const overallLevel = Math.min(strengthLevel, dexterityLevel, constitutionLevel, intelligenceLevel, wisdomLevel, charismaLevel);
  await db.update(usersTable).set({ userLevel: overallLevel }).where(eq(usersTable.id, userId)).run();

  return {
    props: {
      user: {
        id: user.id,
        email: user.email,
        nickname: user.nickname,
        userLevel: overallLevel // Zasíláme celkový level uživatele
      },
      levels: {
        strengthLevel,
        dexterityLevel,
        constitutionLevel,
        intelligenceLevel,
        wisdomLevel,
        charismaLevel
      }
    }
  };
};
