/*import { db } from '$lib/db';
import { usersTable } from '$lib/db/schema';
import { eq } from 'drizzle-orm';

export async function GET({ locals }) {
  if (!locals.user) {
    return new Response('Unauthorized', { status: 401 });
  }

  const user = await db.select().from(usersTable).where(eq(usersTable.id, locals.user.id)).get();

  return new Response(JSON.stringify(user), {
    status: 200,
    headers: {
      'Content-Type': 'application/json'
    }
  });
}*/