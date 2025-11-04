// middleware.ts
import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient, type CookieOptions } from '@supabase/ssr'

export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl

  // --- 1) Your original /admin gate (only relies on our own cookie) ---
  if (pathname.startsWith('/admin')) {
    const isAdmin = request.cookies.get('is-admin')?.value === '1'
    if (!isAdmin) {
      const url = new URL('/auth', request.url)
      // Preserve where the user was trying to go (path + query)
      url.searchParams.set('next', `${pathname}${search}`)
      return NextResponse.redirect(url)
    }
  }

   // --- 2) Supabase session refresh ---
  const response = NextResponse.next({
    request: { headers: request.headers },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          // This ensures cookies are written to the response
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  // Keeps the user's Supabase session refreshed
  await supabase.auth.getUser()

  return response
}

export const config = {
  matcher: [
    // Matches all routes except Next.js internals & favicon
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}