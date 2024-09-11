import { db } from '$lib/db';
import { usersTable, activitiesTable } from '$lib/db/schema';
import { eq } from 'drizzle-orm';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
  if (!locals.user) {
    throw error(404, 'Not found');
  }

  // Načtení uživatele
  const user = await db.select().from(usersTable).where(eq(usersTable.id, locals.user.id)).get();
  console.log('Loaded user:', user);

  if (!user) {
    throw error(404, {
      message: 'User not found',
    });
  }

  // Načtení aktivit uživatele
  const activities = await db.select().from(activitiesTable).where(eq(activitiesTable.userId, user.id)).all();
  console.log('Loaded activities:', activities);

  if (!activities) {
    throw error(404, {
      message: 'Activities not found',
    });
  }

  // Předání uživatele a aktivit na stránku
  return {
    props: {
      user: {
        id: user.id,
        email: user.email,
        nickname: user.nickname
      },
      activities // Předání aktivit
    }
  };
};
