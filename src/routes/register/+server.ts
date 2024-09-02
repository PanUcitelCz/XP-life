import { db } from '$lib/db';
import { usersTable } from '$lib/db/schema';
import bcrypt from 'bcryptjs';
import { sendVerificationEmail } from '$lib/resend';
import { eq } from 'drizzle-orm';

export async function POST({ request }) {
  const formData = await request.formData();
  const email = formData.get('email') as string;
  const nickname = formData.get('nickname') as string;
  const password = formData.get('password') as string;

  if (!email || !nickname || !password) {
    return new Response(JSON.stringify({ success: false, message: 'Invalid input' }), { status: 400 });
  }

  try {
    const existingUserByNickname = await db.select().from(usersTable).where(eq(usersTable.nickname, nickname)).get();
    const existingUserByEmail = await db.select().from(usersTable).where(eq(usersTable.email, email)).get();

    if (existingUserByNickname) {
      return new Response(JSON.stringify({ success: false, message: 'Tento nick již existuje, zkuste jiný' }), { status: 409 });
    }

    if (existingUserByEmail) {
      return new Response(JSON.stringify({ success: false, message: 'Tento email již existuje, zkuste jiný' }), { status: 409 });
    }

    const password_hash = await bcrypt.hash(password, 10);
    const token = Math.random().toString(36).substr(2);

    await db.insert(usersTable).values({
      email,
      nickname,
      password_hash,
      token,
      isEmailVerified: 0, // Nastavení jako neověřený
    }).run();

    // Odeslání ověřovacího emailu
    await sendVerificationEmail(email, nickname, token);

    return new Response(JSON.stringify({ success: true, message: 'User registered. Please verify your email.' }), { status: 201 });
  } catch (error) {
    console.error('Error during registration process:', error);
    return new Response(JSON.stringify({ success: false, message: 'Registration failed: ' + (error instanceof Error ? error.message : "Unknown error") }), { status: 500 });
  }
}
