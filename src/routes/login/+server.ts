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
    return new Response('Invalid input', { status: 400 });
  }

  let user;
  try {
    user = await db.select().from(usersTable).where(eq(usersTable.nickname, nickname)).get();
  } catch (error) {
    return new Response('Error finding user', { status: 500 });
  }

  if (!user) {
    return new Response('User not found', { status: 404 });
  }

  let valid;
  try {
    valid = await bcrypt.compare(password, user.password_hash);
  } catch (error) {
    return new Response('Error comparing password', { status: 500 });
  }

  if (!valid) {
    return new Response('Invalid password', { status: 401 });
  }

  const token = generateToken(); // Generování tokenu

  try {
    await db.update(usersTable).set({ token }).where(eq(usersTable.id, user.id)).run();
  } catch (error) {
    return new Response('Error saving token', { status: 500 });
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
      'Set-Cookie': cookie,
      'Location': '/profile'
    }
  });
}

function generateToken() {
  return Math.random().toString(36).substr(2); // Jednoduchý generátor tokenů
}
