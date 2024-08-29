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
      }
    }
  }
  return resolve(event);
}