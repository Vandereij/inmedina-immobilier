// lib/auth.ts
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { createServerClient, type CookieOptions } from '@supabase/ssr';

// Helper that works with both sync and async cookies()
async function getCookieStore() {
  const v = cookies();
  // Next 15+: cookies() returns a Promise; Next 14: it doesn't
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return typeof (v as any)?.then === 'function' ? await v : v;
}

export async function createSupabaseServerClient() {
  const store = await getCookieStore();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        // Supply ONLY name/value pairs as expected by @supabase/ssr
        getAll() {
          return store.getAll().map((c) => ({ name: c.name, value: c.value }));
        },
        setAll(
          cookiesToSet: { name: string; value: string; options?: CookieOptions }[]
        ) {
          cookiesToSet.forEach(({ name, value, options }) => {
            // Object form is supported on Next 14/15+
            store.set({ name, value, ...options });
          });
        },
      },
    }
  );
}

export async function getSession() {
  const supabase = await createSupabaseServerClient();
  const { data: { session } } = await supabase.auth.getSession();
  return session ?? null;
}

/**
 * Server-side guard for admin-only routes/pages.
 * - Redirects to /auth if not logged in
 * - Redirects to /not-found if logged in but not an admin
 * - Returns the user object if admin
 */
export async function requireAdmin() {
  const supabase = await createSupabaseServerClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    // Send them to login and back to admin after
    return redirect('/auth?next=/admin');
  }

  // Check against your public.admins table (via RPC)
  const { data: isAdmin } = await supabase.rpc('is_admin');
  if (!isAdmin) {
    // Hide existence of the route
    return redirect('/not-found');
    // or: notFound(); from 'next/navigation'
  }

  return user;
}
