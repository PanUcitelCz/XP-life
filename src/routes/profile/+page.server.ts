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

  // Načtení bodů a levelů z jednotlivých kategorií samostatně
  const strengthPoints = await db.select({
    totalPoints: strengthTable.points,
    maxLevel: strengthTable.level
  }).from(strengthTable).where(eq(strengthTable.userId, userId)).all();

  const dexterityPoints = await db.select({
    totalPoints: dexterityTable.points,
    maxLevel: dexterityTable.level
  }).from(dexterityTable).where(eq(dexterityTable.userId, userId)).all();

  const constitutionPoints = await db.select({
    totalPoints: constitutionTable.points,
    maxLevel: constitutionTable.level
  }).from(constitutionTable).where(eq(constitutionTable.userId, userId)).all();

  const intelligencePoints = await db.select({
    totalPoints: intelligenceTable.points,
    maxLevel: intelligenceTable.level
  }).from(intelligenceTable).where(eq(intelligenceTable.userId, userId)).all();

  const wisdomPoints = await db.select({
    totalPoints: wisdomTable.points,
    maxLevel: wisdomTable.level
  }).from(wisdomTable).where(eq(wisdomTable.userId, userId)).all();

  const charismaPoints = await db.select({
    totalPoints: charismaTable.points,
    maxLevel: charismaTable.level
  }).from(charismaTable).where(eq(charismaTable.userId, userId)).all();

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

  // Výpočet celkových bodů a levelů
  const strengthTotal = strengthPoints.reduce((acc, { totalPoints }) => acc + totalPoints, 0);
  const dexterityTotal = dexterityPoints.reduce((acc, { totalPoints }) => acc + totalPoints, 0);
  const constitutionTotal = constitutionPoints.reduce((acc, { totalPoints }) => acc + totalPoints, 0);
  const intelligenceTotal = intelligencePoints.reduce((acc, { totalPoints }) => acc + totalPoints, 0);
  const wisdomTotal = wisdomPoints.reduce((acc, { totalPoints }) => acc + totalPoints, 0);
  const charismaTotal = charismaPoints.reduce((acc, { totalPoints }) => acc + totalPoints, 0);

  const levels = {
    Strength: {
      totalPoints: strengthTotal,
      level: calculateLevel(strengthTotal)
    },
    Dexterity: {
      totalPoints: dexterityTotal,
      level: calculateLevel(dexterityTotal)
    },
    Constitution: {
      totalPoints: constitutionTotal,
      level: calculateLevel(constitutionTotal)
    },
    Intelligence: {
      totalPoints: intelligenceTotal,
      level: calculateLevel(intelligenceTotal)
    },
    Wisdom: {
      totalPoints: wisdomTotal,
      level: calculateLevel(wisdomTotal)
    },
    Charisma: {
      totalPoints: charismaTotal,
      level: calculateLevel(charismaTotal)
    }
  };

  // Výpočet celkového levelu
  const categoryLevels = [
    levels.Strength.level,
    levels.Dexterity.level,
    levels.Constitution.level,
    levels.Intelligence.level,
    levels.Wisdom.level,
    levels.Charisma.level
  ];

  const overallLevel = Math.min(...categoryLevels);

  // Aktualizace uživatelského levelu v DB
  await db.update(usersTable).set({ userLevel: overallLevel }).where(eq(usersTable.id, userId)).run();

  return {
    props: {
      user: {
        id: user.id,
        email: user.email,
        nickname: user.nickname,
        userLevel: overallLevel,
        profileImage: user.profileImage // Zajištění vrácení profileImage
      },
      levels
    }
  };
};
