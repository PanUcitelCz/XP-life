import { db } from '$lib/db';
import { questsTable } from '$lib/db/schema';
import { json } from '@sveltejs/kit';

export const POST = async ({ request, locals }) => {
  const { title, description, category, xp_value } = await request.json();

  // Kontrola, zda je uživatel přihlášen
  if (!locals.user) {
    return json({ error: 'Not authenticated' }, { status: 401 });
  }

  try {
    // Vložíme quest s předanou hodnotou xp_value, případně defaultně 100
    const newQuest = await db.insert(questsTable).values({
      title,
      description,
      category,
      xp_value: xp_value || 100,
      userId: locals.user.id,
      createdAt: new Date().toISOString(),
    }).returning();

    return json(newQuest);
  } catch (error) {
    console.error('Failed to add quest:', error);
    return json({ error: 'Failed to add quest' }, { status: 500 });
  }
};
