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
  // 1. Create a server-side Supabase client
  const supabase = await createSupabaseServerClient();

  // 2. Get the current user from the real session
  const { data: { user } } = await supabase.auth.getUser();

  // 3. If there's no user, they are not logged in. Redirect.
  if (!user) {
    redirect('/auth?next=/admin'); // Or your actual login page
  }

  // 4. Check if the user's metadata contains the 'admin' role.
  //    This MUST match the check in your RLS policy.
  const isAdmin = user.app_metadata?.roles?.includes('admin');

  // 5. If the user is logged in but is NOT an admin, redirect them.
  //    Redirecting to a 404 is often better than an "unauthorized" page
  //    as it doesn't reveal that the protected page exists.
  if (!isAdmin) {
    redirect('/not-found');
  }

  // If all checks pass, you can optionally return the user object
  return user;
}
