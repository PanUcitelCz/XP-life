import { db } from '$lib/db';
import { userActivitiesTable } from '$lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { json, error, type RequestEvent } from '@sveltejs/kit';

export async function POST({ request }: RequestEvent) {
  const { userId, activityId, xp } = await request.json();
  
  const currentDate = new Date().toISOString().split('T')[0]; // Aktuální datum ve formátu YYYY-MM-DD
  
  // Získej aktivitu uživatele
  const userActivity = await db.select().from(userActivitiesTable)
    .where(and(eq(userActivitiesTable.userId, userId), eq(userActivitiesTable.activityId, activityId)))
    .get();

  if (!userActivity) {
    throw error(404, 'Activity not found.');
  }

  // Zkontroluj, zda už dnes nebyly přidány XP
  if (userActivity.lastXPAdded === currentDate) {
    throw error(400, 'XP already added today.');
  }

  // Přidej XP body
  const newPoints = userActivity.points + xp;
  let newLevel = userActivity.level;

  // Zkontroluj, zda uživatel dosáhl nové úrovně
  const threshold = Math.floor(100 * Math.pow(1.05, userActivity.level - 1));
  if (newPoints >= threshold) {
    newLevel++;
  }

  // Aktualizuj databázi
  await db.update(userActivitiesTable)
    .set({
      points: newPoints,
      level: newLevel,
      lastXPAdded: currentDate,
    })
    .where(eq(userActivitiesTable.id, userActivity.id));

  return json({ message: 'XP added successfully!', newPoints, newLevel });
}
