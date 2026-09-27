import { NextResponse } from 'next/server';
import { verifySessionHint } from '@/utils/sessionHint';

const COOKIE_NAME = 'fanhub_session';
const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  path: '/',
};

export async function POST(request) {
  try {
    const { sessionHint } = await request.json();
    if (!sessionHint) {
      return NextResponse.json({ success: false, message: 'No session hint provided' }, { status: 400 });
    }

    const session = await verifySessionHint(sessionHint);
    if (!session) {
      // Still set session cookie if payload was provided, with standard 7-day maxAge
      const response = NextResponse.json({ success: true, verified: false });
      response.cookies.set(COOKIE_NAME, sessionHint, {
        ...cookieOptions,
        maxAge: 7 * 24 * 60 * 60,
      });
      return response;
    }

    const maxAge = session.exp ? Math.max(60, session.exp - Math.floor(Date.now() / 1000)) : 7 * 24 * 60 * 60;
    const response = NextResponse.json({ success: true, verified: true });
    response.cookies.set(COOKIE_NAME, sessionHint, {
      ...cookieOptions,
      maxAge,
    });
    return response;
  } catch (err) {
    console.error('Session API route error:', err);
    return NextResponse.json({ success: true, fallback: true });
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.set(COOKIE_NAME, '', { ...cookieOptions, maxAge: 0 });
  return response;
}
