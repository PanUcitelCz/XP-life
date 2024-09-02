import { db } from '$lib/db';
import { usersTable } from '$lib/db/schema';
import bcrypt from 'bcryptjs';
import { serialize } from 'cookie';
import { sendVerificationEmail } from '$lib/resend';
import { eq } from 'drizzle-orm';

export async function POST({ request }) {
  const formData = await request.formData();
  const email = formData.get('email') as string;
  const nickname = formData.get('nickname') as string;
  const password = formData.get('password') as string;

  if (!email || !nickname || !password) {
    return new Response('Invalid input', { status: 400 });
  }

  try {
    const existingUserByNickname = await db.select().from(usersTable).where(eq(usersTable.nickname, nickname)).get();
    const existingUserByEmail = await db.select().from(usersTable).where(eq(usersTable.email, email)).get();

    if (existingUserByNickname || existingUserByEmail) { // Ošetření, že 'get' může vrátit 'undefined' nebo objekt
      if (existingUserByNickname !== undefined || existingUserByEmail !== undefined) {
        return new Response('User with this email or nickname already exists', { status: 409 });
      }
    }
  } catch (error) {
    console.error('Error checking existing user:', error);
    return new Response('Error checking existing user', { status: 500 });
  }

  const password_hash = await bcrypt.hash(password, 10);
  const token = Math.random().toString(36).substr(2); // Generování tokenu

  try {
    const user = await db.insert(usersTable).values({
      email,
      nickname,
      password_hash,
      token // Uložení tokenu
    }).returning().get();

    // Odeslání ověřovacího emailu
    await sendVerificationEmail(email, nickname, token);

    const cookie = serialize('session', user.id.toString(), {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 7,
      sameSite: 'strict',
      secure: true
    });

    return new Response('User registered. Please verify your email.', {
      status: 201,
      headers: {
        'Set-Cookie': cookie,
        'Location': '/login'
      }
    });
  } catch (error) {
    console.error('Error during registration process:', error);
    return new Response('Registration failed: ' + (error instanceof Error ? error.message : "Unknown error"), { status: 500 });
  }
}
