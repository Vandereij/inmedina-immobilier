import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient, type CookieOptions } from '@supabase/ssr';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  const res = NextResponse.json({ ok: true }, { headers: { 'Cache-Control': 'no-store' } });

  // 1) Read Bearer token from client (best source of truth)
  const authHeader = req.headers.get('authorization') ?? '';

  // 2) Create Supabase client. We pass:
  //   - req/res cookie adapter (for any auth cookies you might also be using)
  //   - Authorization header so we can fetch the *current* user from the token
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return req.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            res.cookies.set(name, value, options as CookieOptions);
          });
        },
      },
      global: authHeader ? { headers: { Authorization: authHeader } } : undefined,
    }
  );

  // 3) Use the token to fetch the freshest user (with app_metadata)
  //    This avoids relying on possibly-stale sessions.
  const { data: { user }, error } = await supabase.auth.getUser();

  // If no user, clear to 0
  if (error || !user) {
    res.cookies.set('is-admin', '0', {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24,
    });
    return res;
  }

  const roles = ((user.app_metadata as any)?.roles ?? []) as string[];
  const isAdmin = roles.includes('admin');

  // 4) Set the admin flag cookie for proxy gating
  res.cookies.set('is-admin', isAdmin ? '1' : '0', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24,
  });

  return res;
}
