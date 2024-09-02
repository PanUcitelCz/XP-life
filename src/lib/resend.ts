import fetch from 'node-fetch';
import { SECRET_RESEND_API_KEY } from '$env/static/private';

export async function sendVerificationEmail(to: string, nickname: string, token: string) {
  const subject = "Verify Your Email";
  const text = `Hello ${nickname}, please verify your email by clicking on the following link: https://localhost/verify?token=${token}`;

  const response = await fetch('https://api.resend.com/v1/send', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${SECRET_RESEND_API_KEY}`
    },
    body: JSON.stringify({
      to,
      subject,
      text
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Failed to send email:', errorText);
    throw new Error('Failed to send email');
  }
}
