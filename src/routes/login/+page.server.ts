import { db } from '$lib/db';
import { usersTable } from '$lib/db/schema';

export async function load() {
  const users = await db.select().from(usersTable).all();
  return { users };
}