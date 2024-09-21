import { db } from '$lib/db';
import { usersTable } from '$lib/db/schema';
import bcrypt from 'bcryptjs';
import { serialize } from 'cookie';
import { eq } from 'drizzle-orm';

export async function POST({ request }) {
  const formData = await request.formData();
  const nickname = formData.get('nickname') as string;
  const password = formData.get('password') as string;
  const rememberMe = formData.get('rememberMe') === 'true'; // Získání hodnoty pro "Zapamatovat si mě"

  if (!nickname || !password) {
    return new Response(JSON.stringify({ success: false, message: 'Invalid input' }), { status: 400 });
  }

  try {
    const user = await db.select().from(usersTable).where(eq(usersTable.nickname, nickname)).get();

    if (!user) {
      return new Response(JSON.stringify({ success: false, message: 'User not found' }), { status: 404 });
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
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

    // Pokud je zvoleno "Remember Me", nastavíme maxAge na 30 dní, jinak necháme session cookie
    const cookieOptions = rememberMe
      ? {
          httpOnly: true,
          maxAge: 60 * 60 * 24 * 365, // 30 dní
          sameSite: 'strict' as const, // Nastavíme správný typ
          secure: true,
          path: '/'
        }
      : {
          httpOnly: true,
          sameSite: 'strict' as const, // Session cookie bez maxAge
          secure: true,
          path: '/'
        };

    const cookie = serialize('session', user.id.toString(), cookieOptions);

    return new Response(JSON.stringify({ success: true, message: 'Login successful' }), {
      status: 200,
      headers: {
        'Set-Cookie': cookie,
        'Location': '/profile'
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return new Response(JSON.stringify({ success: false, message: 'Internal Server Error' }), { status: 500 });
  }
}
