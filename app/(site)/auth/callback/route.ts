// app/auth/callback/route.ts
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function GET(request: Request) {
	const url = new URL(request.url);
	const code = url.searchParams.get("code");
	const next = url.searchParams.get("next") || "/admin";

	if (code) {
		const cookieStore = await cookies();

		const supabase = createServerClient(
			process.env.NEXT_PUBLIC_SUPABASE_URL!,
			process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
			{
				cookies: {
					// read all cookies
					getAll() {
						return cookieStore.getAll();
					},
					// write/update cookies
					setAll(cookiesToSet) {
						cookiesToSet.forEach(({ name, value, options }) => {
							cookieStore.set(name, value, options);
						});
					},
				},
			}
		);

		// This will set the auth cookies for the logged-in user
		await supabase.auth.exchangeCodeForSession(code);
	}

	// Redirect the user to the desired page (admin by default)
	return NextResponse.redirect(`${url.origin}${next}`);
}
