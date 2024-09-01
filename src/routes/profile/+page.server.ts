import { db } from '$lib/db';
import { usersTable } from '$lib/db/schema';
import { eq } from 'drizzle-orm';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export async function load({ locals }) {
  if (!locals.user) {
    error(404, {
      message: 'Not found',
    });
  }
  
  const user = await db.select().from(usersTable).where(eq(usersTable.id, locals.user.id)).get();
  console.log('Loaded user:', user); // Přidáno logování

  if (!user) {
    error(404, {
      message: 'Not found',
    });
  }

  return {
    props: {
      user: {
        id: user.id,
        email: user.email,
        nickname: user.nickname
      }
    }
  };
}
