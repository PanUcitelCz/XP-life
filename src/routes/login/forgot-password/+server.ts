import { db } from '$lib/db';
import { usersTable } from '$lib/db/schema';
import { sendEmail } from '$lib/resend'; // Import funkce pro odesílání e-mailů
import { eq } from 'drizzle-orm';
import crypto from 'crypto'; // Pro generování bezpečného tokenu

export async function POST({ request }) {
	const formData = await request.formData();
	const email = formData.get('email') as string;

	if (!email) {
		return new Response(JSON.stringify({ success: false, message: 'Email is required.' }), { status: 400 });
	}

	// Najdeme uživatele podle e-mailu
	const user = await db.select().from(usersTable).where(eq(usersTable.email, email)).get();

	if (!user) {
		return new Response(JSON.stringify({ success: false, message: 'User with this email does not exist.' }), { status: 404 });
	}

	// Vygenerujeme token pro reset hesla
	const resetToken = crypto.randomBytes(32).toString('hex');
	const resetTokenExpires = new Date(Date.now() + 60 * 60 * 1000); // Token bude platný 1 hodinu

	// Uložíme token a expiraci do uživatelského záznamu
	await db
		.update(usersTable)
		.set({
			token: resetToken,
			tokenExpires: resetTokenExpires.toISOString() // Převod na formát ISO string
		})
		.where(eq(usersTable.id, user.id))
		.run();

	// Odeslání e-mailu s odkazem na reset hesla
	const resetLink = `http://localhost:5173/login/reset-password?token=${resetToken}`;
	const emailBody = `
  <p>Click on the following link to reset your password:</p>
  <a href="${resetLink}" target="_blank">Reset your password</a>
`;

	// Posíláme všechny 3 argumenty: příjemce (to), předmět (subject) a obsah (html)
	await sendEmail(email, 'Password Reset', emailBody);

	return new Response(JSON.stringify({ success: true, message: 'Password reset link sent successfully.' }), { status: 200 });
}
