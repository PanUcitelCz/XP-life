import { db } from '$lib/db';
import { usersTable, strengthTable, dexterityTable, constitutionTable, intelligenceTable, wisdomTable, charismaTable } from '$lib/db/schema';
import { eq } from 'drizzle-orm';

export async function DELETE({ locals }) {
  // Ověření, zda je uživatel přihlášen
  if (!locals.user) {
    return new Response('Unauthorized', { status: 401 });
  }

  const userId = locals.user.id;

  try {
    // Smazání všech aktivit uživatele z každé kategorie
    await db.delete(strengthTable).where(eq(strengthTable.userId, userId)).run();
    await db.delete(dexterityTable).where(eq(dexterityTable.userId, userId)).run();
    await db.delete(constitutionTable).where(eq(constitutionTable.userId, userId)).run();
    await db.delete(intelligenceTable).where(eq(intelligenceTable.userId, userId)).run();
    await db.delete(wisdomTable).where(eq(wisdomTable.userId, userId)).run();
    await db.delete(charismaTable).where(eq(charismaTable.userId, userId)).run();

    // Smazání samotného uživatele
    await db.delete(usersTable).where(eq(usersTable.id, userId)).run();

    return new Response(JSON.stringify({ success: true, message: 'Account and activities deleted successfully' }), { status: 200 });
  } catch (error) {
    console.error('Error deleting account and activities:', error);
    return new Response(JSON.stringify({ success: false, message: 'Failed to delete account' }), { status: 500 });
  }
}
