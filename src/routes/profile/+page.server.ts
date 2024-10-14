// src/routes/profile/+page.server.ts
import { db } from '$lib/db';
import { usersTable, strengthTable, dexterityTable, constitutionTable, intelligenceTable, wisdomTable, charismaTable } from '$lib/db/schema';
import { eq } from 'drizzle-orm';
import { error } from '@sveltejs/kit';
import { sql } from 'drizzle-orm';
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

  // Načtení všech aktivit a jejich bodů z různých kategorií v jednom dotazu
  const allPoints = await db
    .select({
      category: sql`'Strength'`.as('category'),
      totalPoints: sql`SUM(${strengthTable.points})`.as('totalPoints'),
      maxLevel: sql`MAX(${strengthTable.level})`.as('maxLevel')
    })
    .from(strengthTable)
    .where(eq(strengthTable.userId, userId))
    .unionAll(
      db.select({
        category: sql`'Dexterity'`.as('category'),
        totalPoints: sql`SUM(${dexterityTable.points})`.as('totalPoints'),
        maxLevel: sql`MAX(${dexterityTable.level})`.as('maxLevel')
      })
      .from(dexterityTable)
      .where(eq(dexterityTable.userId, userId)),
      db.select({
        category: sql`'Constitution'`.as('category'),
        totalPoints: sql`SUM(${constitutionTable.points})`.as('totalPoints'),
        maxLevel: sql`MAX(${constitutionTable.level})`.as('maxLevel')
      })
      .from(constitutionTable)
      .where(eq(constitutionTable.userId, userId)),
      db.select({
        category: sql`'Intelligence'`.as('category'),
        totalPoints: sql`SUM(${intelligenceTable.points})`.as('totalPoints'),
        maxLevel: sql`MAX(${intelligenceTable.level})`.as('maxLevel')
      })
      .from(intelligenceTable)
      .where(eq(intelligenceTable.userId, userId)),
      db.select({
        category: sql`'Wisdom'`.as('category'),
        totalPoints: sql`SUM(${wisdomTable.points})`.as('totalPoints'),
        maxLevel: sql`MAX(${wisdomTable.level})`.as('maxLevel')
      })
      .from(wisdomTable)
      .where(eq(wisdomTable.userId, userId)),
      db.select({
        category: sql`'Charisma'`.as('category'),
        totalPoints: sql`SUM(${charismaTable.points})`.as('totalPoints'),
        maxLevel: sql`MAX(${charismaTable.level})`.as('maxLevel')
      })
      .from(charismaTable)
      .where(eq(charismaTable.userId, userId))
    )
    .all();

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

  // Výpočet levelů pro každou kategorii
  const levels = allPoints.reduce((acc, categoryData) => {
    acc[categoryData.category] = {
      totalPoints: categoryData.totalPoints,
      level: calculateLevel(categoryData.totalPoints),
      maxLevel: categoryData.maxLevel
    };
    return acc;
  }, {} as Record<string, { totalPoints: number; level: number; maxLevel: number }>);

  // Výpočet celkového levelu jako nejmenšího z levelů všech kategorií
  const overallLevel = Math.min(
    levels.Strength?.level ?? 1,
    levels.Dexterity?.level ?? 1,
    levels.Constitution?.level ?? 1,
    levels.Intelligence?.level ?? 1,
    levels.Wisdom?.level ?? 1,
    levels.Charisma?.level ?? 1
  );

  // Aktualizace uživatelského levelu v DB
  await db.update(usersTable).set({ userLevel: overallLevel }).where(eq(usersTable.id, userId)).run();

  return {
    props: {
      user: {
        id: user.id,
        email: user.email,
        nickname: user.nickname,
        userLevel: overallLevel // Zasíláme celkový level uživatele
      },
      levels
    }
  };
};
