import { NextResponse } from 'next/server';

const SESSION_COOKIE = 'fanhub_session';

function decodeBase64Url(value) {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/');
  const binary = atob(normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '='));
  return Uint8Array.from(binary, (char) => char.charCodeAt(0));
}

async function verifySessionHint(token) {
  const secret = process.env.JWT_ACCESS_SECRET || process.env.JWT_SECRET;
  if (!secret) return null;

  try {
    const [encodedHeader, encodedPayload, encodedSignature] = token.split('.');
    if (!encodedHeader || !encodedPayload || !encodedSignature) return null;

    const header = JSON.parse(new TextDecoder().decode(decodeBase64Url(encodedHeader)));
    const payload = JSON.parse(new TextDecoder().decode(decodeBase64Url(encodedPayload)));
    if (header.alg !== 'HS256' || payload.tokenType !== 'session_hint') return null;
    if (payload.aud !== 'fanhub-web' || !payload.exp || payload.exp <= Date.now() / 1000) return null;

    const key = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify']
    );
    const valid = await crypto.subtle.verify(
      'HMAC',
      key,
      decodeBase64Url(encodedSignature),
      new TextEncoder().encode(`${encodedHeader}.${encodedPayload}`)
    );

    return valid ? payload : null;
  } catch {
    return null;
  }
}

export async function proxy(request) {
  const { pathname } = request.nextUrl;
  const needsUser = pathname === '/profile' || pathname.startsWith('/profile/') ||
    pathname === '/mylist' || pathname.startsWith('/mylist/');
  const needsAdmin = pathname === '/admin' || pathname.startsWith('/admin/');
  if (!needsUser && !needsAdmin) return NextResponse.next();

  const cookie = request.cookies.get(SESSION_COOKIE)?.value;
  const session = cookie ? await verifySessionHint(cookie) : null;
  if (!session) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('callbackUrl', `${pathname}${request.nextUrl.search}`);
    return NextResponse.redirect(loginUrl);
  }

  if (needsAdmin && session.role !== 'admin' && session.role !== 'superadmin') {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/profile/:path*', '/mylist/:path*', '/admin/:path*'],
};
