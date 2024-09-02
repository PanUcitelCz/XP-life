import { serialize } from 'cookie';
import { db } from '$lib/db';
import { usersTable } from '$lib/db/schema';
import { eq } from 'drizzle-orm';

export async function POST({ locals }) {
  if (locals.user) {
    await db.update(usersTable)
      .set({ isOnline: 0 })
      .where(eq(usersTable.id, locals.user.id))
      .run();
  }

  const cookie = serialize('session', '', {
    httpOnly: true,
    maxAge: -1, // Okamžité vypršení cookie
    sameSite: 'strict',
    secure: true
  });

  return new Response('Logout successful', {
    status: 200,
    headers: {
      'Set-Cookie': cookie
    }
  });
}
