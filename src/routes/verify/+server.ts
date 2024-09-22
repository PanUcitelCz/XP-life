import { db } from '$lib/db';
import { usersTable } from '$lib/db/schema';
import { eq } from 'drizzle-orm';

export async function GET({ url }) {
  const token = url.searchParams.get('token');

  if (!token) {
    return new Response('Invalid token', { status: 400 });
  }

  try {
    const user = await db.select().from(usersTable).where(eq(usersTable.token, token)).get();

    if (!user) {
      return new Response('Invalid token', { status: 400 });
    }

    await db.update(usersTable)
      .set({ isEmailVerified: 1, token: null })
      .where(eq(usersTable.id, user.id))
      .run();

    return new Response(null, {
      status: 302,
      headers: {
        'Location': '/verify/success'
      }
    });
  } catch (error) {
    console.error('Verification error:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
