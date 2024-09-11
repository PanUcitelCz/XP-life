import { db } from '$lib/db'; // Import databázové instance
import { usersTable, activitiesTable } from '$lib/db/schema'; // Importuj obě tabulky
import { eq } from 'drizzle-orm';
import { json, error, type RequestEvent } from '@sveltejs/kit';

export async function POST({ request }: RequestEvent) {
  const { userId, category, activityName, description, difficulty } = await request.json();

  // Zkontroluj, zda uživatel existuje
  const user = await db.select().from(usersTable).where(eq(usersTable.id, userId)).get();

  if (!user) {
    throw error(400, 'User not found');
  }

  // Vložení nové aktivity do tabulky activities
  await db.insert(activitiesTable).values({
    userId,
    activityName,
    category,
    level: 1,
    points: 0,
    description,
    difficulty,
    createdAt: new Date().toISOString(),
  });

  return json({ message: 'Activity added successfully' });
}
