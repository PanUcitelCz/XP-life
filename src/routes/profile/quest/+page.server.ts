import { db } from '$lib/db';
import { questsTable } from '$lib/db/schema';
import { eq } from 'drizzle-orm';

export const load = async ({ locals }) => {
  // Ověření, zda je uživatel přihlášen
  if (!locals.user) {
    return {
      status: 401,
      props: {
        error: 'Not authenticated',
      },
    };
  }

  try {
    // Načti questy přihlášeného uživatele
    const quests = await db
      .select()
      .from(questsTable)
      .where(eq(questsTable.userId, locals.user.id))
      .all();

    return {
      props: {
        quests,
        user: locals.user,
      },
    };
  } catch (error) {
    console.error('Error loading quests:', error);
    return {
      props: {
        quests: [],
        error: 'Failed to load quests',
      },
    };
  }
};
