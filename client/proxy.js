import { NextResponse } from 'next/server';
import { verifySessionHint } from '@/utils/sessionHint';

const SESSION_COOKIE = 'fanhub_session';

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
