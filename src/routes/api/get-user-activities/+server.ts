import { db } from '$lib/db';
import { activitiesTable } from '$lib/db/schema';
import { eq } from 'drizzle-orm';
import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ locals }) => {
  if (!locals.user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  const activities = await db
    .select()
    .from(activitiesTable)
    .where(eq(activitiesTable.userId, locals.user.id)) // Podle ID uživatele
    .all();

  return new Response(JSON.stringify(activities), { status: 200 });
};
