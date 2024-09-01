import fetch from 'node-fetch';
import { SECRET_RESEND_API_KEY } from '$env/static/private' // Zde ho importují pomocí svelte.kit https://joyofcode.xyz/sveltekit-environment-variables

export async function sendEmail(to: string, subject: string, text: string) {
  const response = await fetch('https://api.resend.com/v1/send', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${SECRET_RESEND_API_KEY}` // takhle se importuje pomocí svelte.kit
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
