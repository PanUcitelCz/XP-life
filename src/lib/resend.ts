import fetch from 'node-fetch';
import { SECRET_RESEND_API_KEY } from '$env/static/private';
//import { BASE_URL } from '$env/static/private';

export async function sendVerificationEmail(to: string, nickname: string, token: string) {
    const subject = "Verify Your Email";
    const verifyLink = `https://xp-life.cz/verify?token=${token}`;  // Dynamický link založený na BASE_URL
    const htmlContent = `Hello ${nickname},<br>Please verify your email by clicking on the following link: <a href="${verifyLink}">Verify Email</a>`;

    const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${SECRET_RESEND_API_KEY}`
        },
        body: JSON.stringify({
            from: 'notifications@xp-life.cz',
            to,
            subject,
            html: htmlContent
        })
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error('Failed to send email: ' + errorText);
    }

    return response.json();
}
