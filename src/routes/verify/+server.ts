import { db } from '$lib/db';
import { usersTable } from '$lib/db/schema';
import { eq } from 'drizzle-orm';
import { serialize } from 'cookie';

export async function GET({ url }) {
  const token = url.searchParams.get('token');

  if (!token) {
    return new Response('Invalid token', { status: 400 });
  }

  let user;
  try {
    user = await db.select().from(usersTable).where(eq(usersTable.token, token)).get();
  } catch (error) {
    return new Response('Error finding user', { status: 500 });
  }

  if (!user) {
    return new Response('Invalid token', { status: 400 });
  }

  const cookie = serialize('session', user.id.toString(), {
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 7,
    sameSite: 'strict',
    secure: true
  });

  return new Response('Login successful', {
    status: 200,
    headers: {
      'Set-Cookie': cookie
    }
  });
}
