import { db } from '$lib/db';
import { usersTable } from '$lib/db/schema';
import bcrypt from 'bcryptjs';
import { eq, and } from 'drizzle-orm';
import { sql } from 'drizzle-orm';

export async function POST({ request }) {
  const formData = await request.formData();
  const newPassword = formData.get('newPassword') as string;
  const token = formData.get('token') as string;

  if (!newPassword || !token) {
    return new Response(JSON.stringify({ success: false, message: 'Missing password or token.' }), { status: 400 });
  }

  // Najdeme uživatele podle tokenu a ověříme, zda je token stále platný
  const user = await db.select().from(usersTable)
    .where(and(eq(usersTable.token, token), sql`token_expires > CURRENT_TIMESTAMP`))
    .get();

  if (!user) {
    return new Response(JSON.stringify({ success: false, message: 'Token is invalid or expired.' }), { status: 400 });
  }

  // Hash nové heslo
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  // Uložíme nové heslo a odstraníme token
  await db.update(usersTable)
    .set({
      password_hash: hashedPassword,
      token: null,
      tokenExpires: null
    })
    .where(eq(usersTable.id, user.id))
    .run();

  return new Response(JSON.stringify({ success: true, message: 'Password changed successfully.' }), { status: 200 });
}
