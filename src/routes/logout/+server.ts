import { serialize } from 'cookie';

export async function POST() {
  const cookie = serialize('session', '', {
    httpOnly: true,
    maxAge: -1 // Okamžité vypršení cookie
  });

  return new Response('Logout successful', {
    status: 200,
    headers: {
      'Set-Cookie': cookie
    }
  });
}