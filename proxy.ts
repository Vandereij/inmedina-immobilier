import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Edge gate based solely on our own 'is-admin' flag cookie.
// (Do NOT rely on supabase auth cookies — supabase-js stores session in localStorage client-side.)
export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith('/admin')) {
    const isAdmin = req.cookies.get('is-admin')?.value === '1';
    if (!isAdmin) {
      const url = new URL('/auth', req.url);
      url.searchParams.set('next', pathname);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
