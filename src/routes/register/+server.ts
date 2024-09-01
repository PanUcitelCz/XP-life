import { db } from '$lib/db';
import { usersTable } from '$lib/db/schema';
import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';
import { serialize } from 'cookie';
import nodemailer from 'nodemailer';

export async function POST({ request }) {
  const formData = await request.formData();
  const email = formData.get('email') as string;
  const nickname = formData.get('nickname') as string;
  const password = formData.get('password') as string;

  if (!email || !nickname || !password) {
    return new Response('Invalid input', { status: 400 });
  }

  try {
    const existingUserByNickname = await db.select().from(usersTable).where(eq(usersTable.nickname, nickname)).get();
    const existingUserByEmail = await db.select().from(usersTable).where(eq(usersTable.email, email)).get();

    if (existingUserByNickname || existingUserByEmail) {
      return new Response('User with this email or nickname already exists', { status: 409 });
    }
  } catch (error) {
    return new Response('Error checking existing user', { status: 500 });
  }

  let password_hash;
  try {
    password_hash = await bcrypt.hash(password, 10);
  } catch (error) {
    return new Response('Error hashing password', { status: 500 });
  }

  const token = generateToken(); // Generování tokenu

  let user;
  try {
    user = await db.insert(usersTable).values({
      email,
      nickname,
      password_hash,
      token // Uložení tokenu
    }).returning().get();
  } catch (error) {
    return new Response('Error registering user', { status: 500 });
  }

  const cookie = serialize('session', user.id.toString(), {
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 7,
    sameSite: 'strict',
    secure: true
  });

  // Odeslání ověřovacího e-mailu
  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.resend.com',
      port: 465,
      secure: false, // true for 465, false for other ports
      auth: {
        user: 'resend',
        pass: 're_cqj2nbNz_JuifGReNHGUG6K85fDpYpRZZ'
      }
    });

    const mailOptions = {
      from: 'smtp.resend.com',
      to: email,
      subject: 'Verify your email',
      text: `Hello ${nickname}, please verify your email using this token: ${token}`
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    return new Response('Error sending verification email', { status: 500 });
  }

  return new Response('User registered', {
    status: 201,
    headers: {
      'Set-Cookie': cookie,
      'Location': '/profile'
    }
  });
}

function generateToken() {
  return Math.random().toString(36).substr(2); // Jednoduchý generátor tokenů
}
