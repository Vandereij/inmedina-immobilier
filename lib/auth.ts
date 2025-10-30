// lib/auth.ts
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { createServerClient, type CookieOptions } from '@supabase/ssr';

// Helper that works with both sync and async cookies()
async function getCookieStore() {
  const value = cookies();
  return typeof (value as any).then === 'function' ? await value : value;
}

export async function createSupabaseServerClient() {
  const store = await getCookieStore();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        // ✅ handle both sync/async cookies API
        getAll() {
          return store.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            store.set(name, value, options as CookieOptions);
          });
        },
      },
    }
  );
}

// Optional: for API routes or server actions needing the Supabase session
export async function getSession() {
  const supabase = await createSupabaseServerClient();
  const { data: { session } } = await supabase.auth.getSession();
  return session;
}

// ✅ requireAdmin now trusts the httpOnly cookie created by /api/auth/sync-admin
export async function requireAdmin() {
  const store = await getCookieStore();
  const isAdmin = store.get('is-admin')?.value === '1';
  if (!isAdmin) {
    redirect('/auth?next=/admin');
  }
  return true;
}
