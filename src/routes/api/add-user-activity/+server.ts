// src/routes/api/add-user-activity/+server.ts
import { db } from '$lib/db'; // Přístup k databázi
import { userActivitiesTable, activitiesTable } from '$lib/db/schema'; // Odkaz na tabulky
import { error, json, type RequestEvent } from '@sveltejs/kit';
import { eq, and } from 'drizzle-orm';

export async function POST({ request }: RequestEvent) {
  const { userId, activityId } = await request.json();

  // Zkontroluj, zda uživatel už tuto aktivitu nemá
  const userActivity = await db.select().from(userActivitiesTable)
    .where(and(eq(userActivitiesTable.userId, userId), eq(userActivitiesTable.activityId, activityId)))
    .get();
    
  if (userActivity) {
    throw error(400, 'User already has this activity.');
  }

  // Přidej aktivitu uživateli
  await db.insert(userActivitiesTable).values({
    userId,
    activityId,
    level: 1,
    points: 0,
    lastXPAdded: null,
  });

  return json({ message: 'Activity added to user successfully!' });
}
