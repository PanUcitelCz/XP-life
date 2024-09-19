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
      return new Response(JSON.stringify({ success: false, message: 'This username already exists, please try another one' }), { status: 409 });
    }

    if (existingUserByEmail) {
      return new Response(JSON.stringify({ success: false, message: 'This email already exists, please try another one' }), { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const token = Math.random().toString(36).substr(2);

    // Vložení nového uživatele bez tokenu
    await db.insert(usersTable).values({
      email,
      nickname,
      passwordHash,
      isEmailVerified: 0, // Neověřený e-mail
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }).run();

    // Získání uživatele podle e-mailu
    const newUser = await db.select().from(usersTable).where(eq(usersTable.email, email)).get();

    if (!newUser) {
      throw new Error('User could not be found after insertion.');
    }

    const userId = newUser.id; // Získání ID nově vloženého uživatele

    try {
      // Pokusíme se odeslat ověřovací e-mail
      await sendVerificationEmail(email, nickname, token);

      // Pokud se e-mail odešle, aktualizujeme token v záznamu uživatele
      await db.update(usersTable)
        .set({ token, updatedAt: new Date().toISOString() })
        .where(eq(usersTable.id, userId))
        .run();

      return new Response(JSON.stringify({ success: true, message: 'User registered. Please verify your email.' }), { status: 201 });
    } catch (emailError) {
      // Pokud selže odeslání e-mailu, smažeme uživatele
      await db.delete(usersTable).where(eq(usersTable.id, userId)).run();
      console.error('Failed to send verification email:', emailError);
      return new Response(JSON.stringify({ success: false, message: 'Registration failed. Unable to send verification email.' }), { status: 500 });
    }

  } catch (error) {
    console.error('Error during registration process:', error);
    return new Response(JSON.stringify({ success: false, message: 'Registration failed: ' + (error instanceof Error ? error.message : "Unknown error") }), { status: 500 });
  }
}
