import { NextRequest, NextResponse } from 'next/server';

const protectedPaths = ['/checkout', '/orders'];
const authPaths = ['/auth/login', '/auth/register'];

export function proxy(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value;
  const { pathname } = request.nextUrl;

  // Redirect authenticated users away from auth pages
  if (authPaths.some((path) => pathname.startsWith(path))) {
    if (token) {
      return NextResponse.redirect(new URL('/products', request.url));
    }
    return NextResponse.next();
  }

  // Redirect unauthenticated users to login
  if (protectedPaths.some((path) => pathname.startsWith(path))) {
    if (!token) {
      const loginUrl = new URL('/auth/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/checkout/:path*', '/orders/:path*', '/auth/:path*'],
};
