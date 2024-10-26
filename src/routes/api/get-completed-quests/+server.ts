// src/routes/api/get-completed-quests/+server.ts
import { json } from '@sveltejs/kit';
import { db } from '$lib/db';
import { questsTable } from '$lib/db/schema';
import { eq, and } from 'drizzle-orm';

export const GET = async ({ locals }) => {
  const userId = locals.user?.id;
  if (!userId) {
    return json({ error: 'User not authenticated' }, { status: 401 });
  }

  try {
    const completedQuests = await db.select({
      category: questsTable.category,
      xpValue: questsTable.xp_value
    })
    .from(questsTable)
    .where(and(eq(questsTable.userId, userId), eq(questsTable.isCompleted, 1)))
    .all();

    return json({ completedQuests });
  } catch (error) {
    console.error('Error fetching completed quests:', error);
    return json({ error: 'Failed to fetch completed quests' }, { status: 500 });
  }
};
