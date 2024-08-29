import { db } from '$lib/db';
import { usersTable } from '$lib/db/schema';
import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';

export async function POST({ request }) {
  const formData = await request.formData();
  const email = formData.get('email') as string;
  const nickname = formData.get('nickname') as string;
  const password = formData.get('password') as string;

  // Validace vstupů
  if (!email || !nickname || !password) {
    console.error('Invalid input');
    return new Response('Invalid input', { status: 400 });
  }

  // Kontrola, zda uživatel s daným emailem nebo přezdívkou již existuje
  try {
    const existingUserByNickname = await db.select().from(usersTable).where(eq(usersTable.nickname, nickname)).get();
    const existingUserByEmail = await db.select().from(usersTable).where(eq(usersTable.email, email)).get();

    if (existingUserByNickname || existingUserByEmail) {
      console.error('User with this email or nickname already exists');
      return new Response('User with this email or nickname already exists', { status: 409 });
    }
  } catch (error) {
    console.error('Error checking existing user:', error);
    return new Response('Error checking existing user', { status: 500 });
  }

  // Hashování hesla
  let password_hash;
  try {
    password_hash = await bcrypt.hash(password, 10);
  } catch (error) {
    console.error('Error hashing password:', error);
    return new Response('Error hashing password', { status: 500 });
  }

  // Uložení uživatele do databáze
  try {
    await db.insert(usersTable).values({
      email,
      nickname,
      password_hash
    }).run();
    return new Response('User registered', { status: 201 });
  } catch (error) {
    console.error('Error registering user:', error);
    return new Response('Error registering user', { status: 500 });
  }
}
