import { db } from '$lib/db';
import { usersTable } from '$lib/db/schema';
import bcrypt from 'bcryptjs';
import { serialize } from 'cookie';
import { eq } from 'drizzle-orm';

export async function POST({ request, locals }) {
  const formData = await request.formData();
  const nickname = formData.get('nickname') as string;
  const password = formData.get('password') as string;

  // Validace vstupů
  if (!nickname || !password) {
    console.error('Invalid input');
    return new Response('Invalid input', { status: 400 });
  }

  // Vyhledání uživatele v databázi
  let user;
  try {
    user = await db.select().from(usersTable).where(eq(usersTable.nickname, nickname)).get();
  } catch (error) {
    console.error('Error finding user:', error);
    return new Response('Error finding user', { status: 500 });
  }

  if (!user) {
    console.error('User not found');
    return new Response('User not found', { status: 404 });
  }

  // Ověření hesla
  let valid;
  try {
    valid = await bcrypt.compare(password, user.password_hash);
  } catch (error) {
    console.error('Error comparing password:', error);
    return new Response('Error comparing password', { status: 500 });
  }

  if (!valid) {
    console.error('Invalid password');
    return new Response('Invalid password', { status: 401 });
  }

  // Nastavení cookie
  const cookie = serialize('session', user.id.toString(), {
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 7 // 1 týden
  });

  locals.user = user;

  return new Response('Login successful', {
    status: 200,
    headers: {
      'Set-Cookie': cookie
    }
  });
}