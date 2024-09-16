import { db } from '$lib/db';
import { dexterityTable } from '$lib/db/schema';
import { eq } from 'drizzle-orm';
import { json } from '@sveltejs/kit';

export const POST = async ({ request, locals }) => {
    const { activityId } = await request.json();

    // Zkontrolovat, zda je uživatel přihlášen
    if (!locals.user) {
        return json({ error: 'Not authenticated' }, { status: 401 });
    }

    // Načíst aktivitu podle ID
    const activity = await db
        .select()
        .from(dexterityTable)
        .where(eq(dexterityTable.id, activityId))
        .get();

    if (!activity) {
        return json({ error: 'Activity not found' }, { status: 404 });
    }

    // Zkontrolovat, jestli XP byly přidány dnes
    const today = new Date().toISOString().split('T')[0];
    if (activity.lastXPAdded && activity.lastXPAdded.split('T')[0] === today) {
        return json({ error: 'XP already added today' }, { status: 400 });
    }

    // Vypočítat nové body a úroveň na základě obtížnosti
    let xpToAdd = 0;
    switch (activity.difficulty) {
        case 'easy':
            xpToAdd = 5;
            break;
        case 'normal':
            xpToAdd = 10;
            break;
        case 'hard':
            xpToAdd = 15;
            break;
    }

    const updatedPoints = activity.points + xpToAdd;
    const updatedLevel = Math.floor(updatedPoints / 50) + 1;

    // Aktualizovat aktivitu v databázi
    await db
        .update(dexterityTable)
        .set({
            points: updatedPoints,
            level: updatedLevel,
            lastXPAdded: new Date().toISOString(),
        })
        .where(eq(dexterityTable.id, activityId))
        .run();

    return json({ success: true, updatedPoints, updatedLevel });
};
