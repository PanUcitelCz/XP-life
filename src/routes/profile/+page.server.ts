import { db } from '$lib/db';
import { usersTable } from '$lib/db/schema';
import { eq } from 'drizzle-orm';

export async function load({ locals }) {
  if (!locals.user) {
    return {
      status: 401,
      error: new Error('Unauthorized')
    };
  }
  
  const user = await db.select().from(usersTable).where(eq(usersTable.id, locals.user.id)).get();

  return {
    props: {
      user
    }
  };
}