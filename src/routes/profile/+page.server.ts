// src/routes/profile/+page.server.ts
import { db } from '$lib/db';
import { usersTable, strengthTable, dexterityTable, constitutionTable, intelligenceTable, wisdomTable, charismaTable, questsTable } from '$lib/db/schema';
import { eq, sql, and } from 'drizzle-orm';
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
  const categoryPoints = {
    Strength: 0,
    Dexterity: 0,
    Constitution: 0,
    Intelligence: 0,
    Wisdom: 0,
    Charisma: 0,
  };

  // Načtení bodů z aktivity tabulek
  const strengthPoints = (await db.select({ totalPoints: sql<number>`COALESCE(SUM(points), 0)` }).from(strengthTable).where(eq(strengthTable.userId, userId)).get())?.totalPoints ?? 0;
  const dexterityPoints = (await db.select({ totalPoints: sql<number>`COALESCE(SUM(points), 0)` }).from(dexterityTable).where(eq(dexterityTable.userId, userId)).get())?.totalPoints ?? 0;
  const constitutionPoints = (await db.select({ totalPoints: sql<number>`COALESCE(SUM(points), 0)` }).from(constitutionTable).where(eq(constitutionTable.userId, userId)).get())?.totalPoints ?? 0;
  const intelligencePoints = (await db.select({ totalPoints: sql<number>`COALESCE(SUM(points), 0)` }).from(intelligenceTable).where(eq(intelligenceTable.userId, userId)).get())?.totalPoints ?? 0;
  const wisdomPoints = (await db.select({ totalPoints: sql<number>`COALESCE(SUM(points), 0)` }).from(wisdomTable).where(eq(wisdomTable.userId, userId)).get())?.totalPoints ?? 0;
  const charismaPoints = (await db.select({ totalPoints: sql<number>`COALESCE(SUM(points), 0)` }).from(charismaTable).where(eq(charismaTable.userId, userId)).get())?.totalPoints ?? 0;

  // Načtení splněných questů a přičtení XP bodů k odpovídajícím kategoriím
  const completedQuests = await db.select({
    category: questsTable.category,
    xpValue: questsTable.xp_value
  }).from(questsTable).where(and(eq(questsTable.userId, userId), eq(questsTable.isCompleted, 1))).all() ?? [];

  completedQuests.forEach((quest) => {
    const questCategory = quest.category as keyof typeof categoryPoints;
    if (questCategory in categoryPoints && quest.xpValue !== null) {
      categoryPoints[questCategory] += quest.xpValue;
    }
  });

  // Celkové body kategorií včetně XP z questů
  const totalStrength = strengthPoints + categoryPoints.Strength;
  const totalDexterity = dexterityPoints + categoryPoints.Dexterity;
  const totalConstitution = constitutionPoints + categoryPoints.Constitution;
  const totalIntelligence = intelligencePoints + categoryPoints.Intelligence;
  const totalWisdom = wisdomPoints + categoryPoints.Wisdom;
  const totalCharisma = charismaPoints + categoryPoints.Charisma;

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

  const levels = {
    Strength: {
      totalPoints: totalStrength,
      level: calculateLevel(totalStrength)
    },
    Dexterity: {
      totalPoints: totalDexterity,
      level: calculateLevel(totalDexterity)
    },
    Constitution: {
      totalPoints: totalConstitution,
      level: calculateLevel(totalConstitution)
    },
    Intelligence: {
      totalPoints: totalIntelligence,
      level: calculateLevel(totalIntelligence)
    },
    Wisdom: {
      totalPoints: totalWisdom,
      level: calculateLevel(totalWisdom)
    },
    Charisma: {
      totalPoints: totalCharisma,
      level: calculateLevel(totalCharisma)
    }
  };

  const overallLevel = Math.min(
    levels.Strength.level,
    levels.Dexterity.level,
    levels.Constitution.level,
    levels.Intelligence.level,
    levels.Wisdom.level,
    levels.Charisma.level
  );

  await db.update(usersTable).set({ userLevel: overallLevel }).where(eq(usersTable.id, userId)).run();

  return {
    props: {
      user: {
        id: user.id,
        email: user.email,
        nickname: user.nickname,
        userLevel: overallLevel,
        profileImage: user.profileImage
      },
      levels,
      completedQuests // Ujistíme se, že completedQuests je pole přímo přístupné ve frontendu
    }
  };
};
