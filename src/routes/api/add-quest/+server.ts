import { db } from '$lib/db';
import { questsTable } from '$lib/db/schema';
import { json } from '@sveltejs/kit';

export const POST = async ({ request, locals }) => {
  const { title, description, category } = await request.json();

  // Zkontroluj, zda je uživatel přihlášen
  if (!locals.user) {
    return json({ error: 'Not authenticated' }, { status: 401 });
  }

  try {
    // Přidání nového questu do databáze
    const newQuest = await db.insert(questsTable).values({
      title,
      description,
      category,
      userId: locals.user.id,  // Změněno z 'user_id' na 'userId'
      createdAt: new Date().toISOString(),
    }).returning();

    return json(newQuest);
  } catch (error) {
    console.error('Failed to add quest:', error);
    return json({ error: 'Failed to add quest' }, { status: 500 });
  }
};
