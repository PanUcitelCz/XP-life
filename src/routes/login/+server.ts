import { db } from '$lib/db';
import { usersTable } from '$lib/db/schema';
import bcrypt from 'bcryptjs';
import { serialize } from 'cookie';
import { eq } from 'drizzle-orm';

export async function POST({ request }) {
  const formData = await request.formData();
  const nickname = formData.get('nickname') as string;
  const password = formData.get('password') as string;

  if (!nickname || !password) {
    return new Response(JSON.stringify({ success: false, message: 'Invalid input' }), { status: 400 });
  }

  try {
    const user = await db.select().from(usersTable).where(eq(usersTable.nickname, nickname)).get();

    if (!user) {
      return new Response(JSON.stringify({ success: false, message: 'User not found' }), { status: 404 });
    }

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return new Response(JSON.stringify({ success: false, message: 'Invalid password' }), { status: 401 });
    }

    if (user.isEmailVerified !== 1) {
      return new Response(JSON.stringify({ success: false, message: 'Please verify your email before logging in.' }), { status: 403 });
    }

    await db.update(usersTable)
      .set({ isOnline: 1 })
      .where(eq(usersTable.id, user.id))
      .run();

    const cookie = serialize('session', user.id.toString(), {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 7,
      sameSite: 'strict',
      secure: true
    });

    return new Response(JSON.stringify({ success: true, message: 'Login successful' }), {
      status: 200,
      headers: {
        'Set-Cookie': cookie,
        'Location': '/profile' // Přesměrování na profil pouze při úspěšném přihlášení
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return new Response(JSON.stringify({ success: false, message: 'Internal Server Error' }), { status: 500 });
  }
}
