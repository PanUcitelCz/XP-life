import type { RequestHandler } from '@sveltejs/kit';
import nodemailer from 'nodemailer';

export const POST: RequestHandler = async ({ request }) => {
  const { to, subject, text } = await request.json();

  const transporter = nodemailer.createTransport({
    host: 'smtp.resend.com',
    port: 465,
    secure: false, // true for 465, false for other ports
    auth: {
      user: 'resend',
      pass: 'YOUR_API_KEY'
    }
  });

  const mailOptions = {
    from: 'your-email@example.com',
    to,
    subject,
    text
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    return new Response(JSON.stringify({ message: 'Email sent: ' + info.response }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to send email: ' + (error as Error).message }), { status: 500 });
  }
};
