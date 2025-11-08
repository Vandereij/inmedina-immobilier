"use client";

import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase-client";

export default function AuthPage() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const [mode, setMode] = useState<"login" | "signup">("login");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [pending, startTransition] = useTransition();
	const [message, setMessage] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);

	// 2. Use the standard Supabase browser client
	const supabase = createClient();

	// 3. The entire `syncAdminCookie` function has been removed. It is not needed.

	// 4. The `useEffect` hook has also been removed. The new library handles this flow automatically.

	async function handleEmailPassword(e: React.FormEvent) {
		e.preventDefault();
		setError(null);
		setMessage(null);

		startTransition(async () => {
			try {
				if (mode === "login") {
					const { error } = await supabase.auth.signInWithPassword({
						email,
						password,
					});
					if (error) throw error;
				} else {
					const { error } = await supabase.auth.signUp({
						email,
						password,
					});
					if (error) throw error;
					setMessage(
						"Account created. Please check your email to verify your account."
					);
				}

				// 5. This is the new, correct way to handle redirects in Next.js 13+
				
				// router.refresh() makes a new request to the server, which will re-run
				// your `requireAdmin` check. This time, it will find the new session cookies.
				router.refresh();

				// Redirect to the page the user was trying to access, or a default.
				const nextUrl = searchParams.get("next") || "/admin";
				router.push(nextUrl);

			} catch (err: any) {
				setError(err?.message ?? "Something went wrong.");
			}
		});
	}

	async function handleOAuth(provider: "google" | "github" | "azure") {
		setError(null);
		const { error } = await supabase.auth.signInWithOAuth({
			provider,
			options: {
				// It's standard practice to have a dedicated callback route
				redirectTo: `${window.location.origin}/auth/callback`,
			},
		});
		if (error) setError(error.message);
	}

	return (
		<div className="mx-auto max-w-md border rounded-2xl p-6 grid gap-6">
			<div className="flex justify-center">
				<div className="w-10/12">
					<div className="flex items-center justify-between">
						<h1 className="text-2xl font-semibold">
							{mode === "login" ? "Log in" : "Create an account"}
						</h1>
						<button
							className="text-sm underline"
							onClick={() =>
								setMode((m) =>
									m === "login" ? "signup" : "login"
								)
							}
							disabled={pending}
						>
							{mode === "login"
								? "Need an account?"
								: "Have an account? Log in"}
						</button>
					</div>

					<form className="grid gap-3" onSubmit={handleEmailPassword}>
						<label className="grid gap-1">
							<span className="text-sm">Email</span>
							<input
								type="email"
								className="border rounded-xl p-2"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								required
								autoComplete="email"
							/>
						</label>

						<label className="grid gap-1">
							<span className="text-sm">Password</span>
							<input
								type="password"
								className="border rounded-xl p-2"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								required
								autoComplete={
									mode === "login"
										? "current-password"
										: "new-password"
								}
								minLength={6}
							/>
						</label>

						<button
							type="submit"
							className="border rounded-xl p-2 disabled:opacity-60"
							disabled={pending}
						>
							{pending
								? mode === "login"
									? "Logging in…"
									: "Signing up…"
								: mode === "login"
								? "Log in"
								: "Sign up"}
						</button>
					</form>

					<div className="text-center text-sm text-gray-500">or</div>

					<div className="grid gap-2">
						<button
							className="border rounded-xl p-2"
							onClick={() => handleOAuth("google")}
							disabled={pending}
						>
							Continue with Google
						</button>
					</div>

					{message && (
						<div className="text-green-600 text-sm">{message}</div>
					)}
					{error && (
						<div className="text-red-600 text-sm">{error}</div>
					)}

					<p className="text-xs text-gray-500">
						By continuing, you agree to our Terms and acknowledge
						our Privacy Policy.
					</p>
				</div>
			</div>
		</div>
	);
}