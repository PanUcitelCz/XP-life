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

    if (existingUserByNickname || existingUserByEmail) {
      return new Response('User with this email or nickname already exists', { status: 409 });
    }

    const password_hash = await bcrypt.hash(password, 10);
    const token = Math.random().toString(36).substr(2);

    const user = await db.insert(usersTable).values({
      email,
      nickname,
      password_hash,
      token,
      isEmailVerified: 0, // Nastavení jako neověřený
    }).returning().get();

    // Odeslání ověřovacího emailu
    await sendVerificationEmail(email, nickname, token);

    return new Response('User registered. Please verify your email.', {
      status: 201,
      headers: {
        'Location': '/login'
      }
    });
  } catch (error) {
    console.error('Error during registration process:', error);
    return new Response('Registration failed: ' + (error instanceof Error ? error.message : "Unknown error"), { status: 500 });
  }
}
