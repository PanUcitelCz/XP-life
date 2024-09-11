import { db } from '$lib/db';
import { activitiesTable } from '$lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { json } from '@sveltejs/kit';

export const POST = async ({ request, locals }) => {
  const { activityId } = await request.json();

  // Zkontrolovat, zda je uživatel přihlášen
  if (!locals.user) {
    return json({ error: 'Not authenticated' }, { status: 401 });
  }

  // Načíst aktivitu podle ID
  const activity = await db
    .select({
      id: activitiesTable.id,
      points: activitiesTable.points,
      level: activitiesTable.level,
      difficulty: activitiesTable.difficulty,
      lastXPAdded: activitiesTable.lastXPAdded,
    })
    .from(activitiesTable)
    .where(and(eq(activitiesTable.userId, locals.user.id), eq(activitiesTable.id, activityId)))
    .get();

  if (!activity) {
    return json({ error: 'Activity not found' }, { status: 404 });
  }

  // Zkontrolovat, jestli XP byly přidány dnes
  const today = new Date().toISOString().split('T')[0]; // Dnešní datum v ISO formátu
  if (activity.lastXPAdded && activity.lastXPAdded.startsWith(today)) {
    return json({ error: 'XP already added today' }, { status: 400 });
  }

  // Nastavit body na základě obtížnosti
  let xp = 0;
  if (activity.difficulty === 'easy') {
    xp = 5;
  } else if (activity.difficulty === 'normal') {
    xp = 10;
  } else if (activity.difficulty === 'hard') {
    xp = 15;
  }

  // Vypočítat nové body a úroveň
  const updatedPoints = activity.points + xp;
  const updatedLevel = Math.floor(updatedPoints / 100) + 1;

  // Aktualizovat aktivitu v databázi
  await db
    .update(activitiesTable)
    .set({
      points: updatedPoints,
      level: updatedLevel,
      lastXPAdded: new Date().toISOString(), // Aktualizace lastXPAdded
    })
    .where(and(eq(activitiesTable.userId, locals.user.id), eq(activitiesTable.id, activityId)))
    .run();

  return json({ success: true, updatedPoints, updatedLevel });
};
