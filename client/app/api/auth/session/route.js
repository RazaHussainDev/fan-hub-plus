import { NextResponse } from 'next/server';
import { verifySessionHint } from '@/utils/sessionHint';

const COOKIE_NAME = 'fanhub_session';
const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  path: '/',
};

export async function POST(request) {
  try {
    const { sessionHint } = await request.json();
    const session = await verifySessionHint(sessionHint);
    if (!session) {
      return NextResponse.json({ success: false }, { status: 401 });
    }

    const response = NextResponse.json({ success: true });
    response.cookies.set(COOKIE_NAME, sessionHint, {
      ...cookieOptions,
      maxAge: Math.max(0, session.exp - Math.floor(Date.now() / 1000)),
    });
    return response;
  } catch {
    return NextResponse.json({ success: false }, { status: 400 });
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.set(COOKIE_NAME, '', { ...cookieOptions, maxAge: 0 });
  return response;
}
