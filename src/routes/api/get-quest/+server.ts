import { questsTable } from '$lib/db/schema';
import { db } from '$lib/db';
import { eq } from 'drizzle-orm';

// Funkce pro získání questů z databáze
export const GET = async ({ locals }) => {
  // Ověření, zda je uživatel přihlášen
  if (!locals.user) {
    return new Response(JSON.stringify({ error: 'Not authenticated' }), { status: 401 });
  }

  try {
    // Načtení questů pro přihlášeného uživatele
    const quests = await db
      .select()
      .from(questsTable)
      .where(eq(questsTable.userId, locals.user.id))
      .all();

    return new Response(JSON.stringify(quests), { status: 200 });
  } catch (error) {
    console.error('Failed to fetch quests:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch quests' }), { status: 500 });
  }
};
