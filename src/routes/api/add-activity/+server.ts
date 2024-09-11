import { db } from '$lib/db'; // Zde odkaž na tvůj databázový přístup
import { activitiesTable, userActivitiesTable } from '$lib/db/schema';
import { error, json, type RequestEvent } from '@sveltejs/kit';
import { eq, and } from 'drizzle-orm';

export async function POST({ request }: RequestEvent) {
  const { userId, activityName, category } = await request.json();

  // Zjisti, zda již aktivita existuje
  let activity = await db.select().from(activitiesTable).where(eq(activitiesTable.name, activityName)).get();
  
  // Pokud aktivita neexistuje, vytvoříme ji
  if (!activity) {
    const [newActivity] = await db.insert(activitiesTable).values({
      name: activityName,
      category: category,
    }).returning();
    activity = newActivity;
  }

  // Zkontroluj, zda uživatel už tuto aktivitu nemá
  const userActivity = await db.select().from(userActivitiesTable)
    .where(and(eq(userActivitiesTable.userId, userId), eq(userActivitiesTable.activityId, activity.id)))
    .get();
    
  if (userActivity) {
    throw error(400, 'User already has this activity.');
  }

  // Přidej aktivitu uživateli
  await db.insert(userActivitiesTable).values({
    userId,
    activityId: activity.id,
    level: 1,
    points: 0,
    lastXPAdded: null,
  });

  return json({ message: 'Activity added successfully!' });
}
