import { parse } from 'cookie';
import { db } from '$lib/db';
import { usersTable } from '$lib/db/schema';
import { eq } from 'drizzle-orm';

export async function handle({ event, resolve }) {
  const cookie = event.request.headers.get('cookie');
  if (cookie) {
    const { session } = parse(cookie);
    if (session) {
      const user = await db.select().from(usersTable).where(eq(usersTable.id, parseInt(session))).get();
      if (user) {
        event.locals.user = user;
        console.log('User found:', user); // Přidáno logování
      } else {
        console.log('User not found');
      }
    } else {
      console.log('Session not found');
    }
  } else {
    console.log('Cookie not found');
  }
  return resolve(event);
}