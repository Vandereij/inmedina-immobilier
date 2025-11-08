// lib/supabase-server.ts
import { cookies } from 'next/headers';
import { createServerClient, type CookieOptions } from '@supabase/ssr';

export async function createClient() {
  const store = await cookies(); // Next 15+: cookies() is async

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        // Supply ALL cookies
        getAll() {
          return store.getAll().map(c => ({ name: c.name, value: c.value }));
        },
        // Set MANY cookies
        setAll(
          cookiesToSet: { name: string; value: string; options?: CookieOptions }[]
        ) {
          cookiesToSet.forEach(({ name, value, options }) => {
            store.set({ name, value, ...options });
          });
        },
      },
    }
  );
}
