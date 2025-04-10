import { NextRequest, NextResponse } from 'next/server';
import { getUserFromCookies } from './lib/auth-edge';

export async function middleware(request: NextRequest) {
  const user = await getUserFromCookies(request);

  if (!user) {
    const url = request.nextUrl.clone();
    url.pathname = '/signin';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/profile', '/skills/new'],
};
// This middleware checks if the user is authenticated by looking for a session cookie. If the user is not authenticated, it redirects them to the sign-in page. The matcher specifies which paths this middleware should apply to.
