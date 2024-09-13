import { db } from '$lib/db';
import { usersTable } from '$lib/db/schema';
import bcrypt from 'bcryptjs';
import { sendEmail } from '$lib/resend';
import { eq } from 'drizzle-orm';

export async function POST({ request, locals }) {
  const formData = await request.formData();
  
  // Verify if user is logged in
  if (!locals.user) {
    return new Response('Unauthorized', { status: 401 });
  }
  
  const userId = locals.user.id;
  
  const newNickname = formData.get('newNickname') as string | null;
  const newEmail = formData.get('newEmail') as string | null;
  const currentPassword = formData.get('currentPassword') as string | null;
  const newPassword = formData.get('newPassword') as string | null;

  if (!currentPassword) {
    return new Response(JSON.stringify({ success: false, message: 'Current password is required' }), { status: 400 });
  }

  try {
    const user = await db.select().from(usersTable).where(eq(usersTable.id, userId)).get();

    if (!user) {
      return new Response(JSON.stringify({ success: false, message: 'User not found' }), { status: 404 });
    }

    // Verify current password
    const isPasswordValid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isPasswordValid) {
      return new Response(JSON.stringify({ success: false, message: 'Invalid current password' }), { status: 401 });
    }

    const updates: Record<string, any> = {};
    let emailBody = `You have made the following changes to your account:\n`;

    // Change nickname
    if (newNickname && newNickname !== user.nickname) {
      const existingUserByNickname = await db.select().from(usersTable).where(eq(usersTable.nickname, newNickname)).get();
      if (existingUserByNickname) {
        return new Response(JSON.stringify({ success: false, message: 'This nickname already exists. Please choose another.' }), { status: 409 });
      }
      updates['nickname'] = newNickname;
      emailBody += `Nickname: ${user.nickname} -> ${newNickname}\n`;
    }

    // Change email
    if (newEmail && newEmail !== user.email) {
      const existingUserByEmail = await db.select().from(usersTable).where(eq(usersTable.email, newEmail)).get();
      if (existingUserByEmail) {
        return new Response(JSON.stringify({ success: false, message: 'This email already exists. Please choose another.' }), { status: 409 });
      }
      updates['email'] = newEmail;
      emailBody += `Email: ${user.email} -> ${newEmail}\n`;
    }

    // Change password
    if (newPassword && newPassword !== '') {
      const newHashedPassword = await bcrypt.hash(newPassword, 10);
      updates['passwordHash'] = newHashedPassword;
      emailBody = `Your password has been successfully changed.`; // Send a specific message if password is changed
    }

    // Update user in database
    if (Object.keys(updates).length > 0) {
      await db.update(usersTable).set(updates).where(eq(usersTable.id, userId)).run();
    }

    // Send email notifications
    if (newPassword && newPassword !== '') {
      await sendEmail(user.email, 'Password Change Notification', emailBody);
    } else {
      await sendEmail(newEmail || user.email, 'Account Changes Notification', emailBody);
    }

    return new Response(JSON.stringify({ success: true, message: 'Changes saved successfully' }), { status: 200 });

  } catch (error) {
    console.error('Error updating user settings:', error);
    return new Response(JSON.stringify({ success: false, message: 'Internal Server Error' }), { status: 500 });
  }
}
