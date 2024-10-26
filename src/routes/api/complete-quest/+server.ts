// src/routes/api/complete-quest/+server.ts
import { db } from '$lib/db';
import { questsTable } from '$lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { json } from '@sveltejs/kit';

export const PUT = async ({ request, locals }) => {
  if (!locals.user) {
    return json({ error: 'Not authenticated' }, { status: 401 });
  }

  const { questId } = await request.json();
  const userId = locals.user.id;

  // Vyhledání questu
  const quest = await db
    .select()
    .from(questsTable)
    .where(and(eq(questsTable.id, questId), eq(questsTable.userId, userId)))
    .get();

  if (!quest) {
    return json({ error: 'Quest not found' }, { status: 404 });
  }

  // Nastavení questu na dokončený
  await db
    .update(questsTable)
    .set({ isCompleted: 1 })
    .where(eq(questsTable.id, questId))
    .run();

  return json({ success: true });
};
