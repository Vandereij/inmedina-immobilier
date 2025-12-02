"use client";

import { useState, useTransition } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase-client";

export default function AuthPage() {
	const searchParams = useSearchParams();
	const [email, setEmail] = useState("");
	const [pending, startTransition] = useTransition();
	const [message, setMessage] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);

	const supabase = createClient();

	async function handleMagicLink(e: React.FormEvent) {
		e.preventDefault();
		setError(null);
		setMessage(null);

		startTransition(async () => {
			try {
				// Figure out where to send the user AFTER they click the magic link
				const origin =
					typeof window !== "undefined"
						? window.location.origin
						: "";
				const next = searchParams.get("next") || "/admin";
				const emailRedirectTo = `${origin}/auth/callback?next=${encodeURIComponent(
					next
				)}`;

				const { error } = await supabase.auth.signInWithOtp({
					email,
					// unified behavior: if user exists, logs in; if not, signs up
					options: {
						emailRedirectTo,
					},
				});

				if (error) throw error;

				setMessage(
					"Magic link sent! Please check your email to continue."
				);
			} catch (err: any) {
				setError(err?.message ?? "Something went wrong.");
			}
		});
	}

	return (
		<div className="mx-auto max-w-md border rounded-2xl my-20 p-6 grid gap-6">
			<div className="flex justify-center">
				<div className="w-10/12">
					<div className="flex items-center justify-between mb-2">
						<h1 className="text-2xl font-semibold">
							Sign in with a magic link
						</h1>
					</div>

					<p className="text-sm text-gray-600 mb-4">
						Enter your email and we&apos;ll send you a secure link
						to log in. If you don&apos;t have an account yet,
						we&apos;ll create one automatically.
					</p>

					<form className="grid gap-3" onSubmit={handleMagicLink}>
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

						<button
							type="submit"
							className="border rounded-xl p-2 disabled:opacity-60"
							disabled={pending}
						>
							{pending
								? "Sending magic link…"
								: "Send magic link"}
						</button>
					</form>

					{/* If you want OAuth later, you can re-enable this:
					<div className="text-center text-sm text-gray-500 mt-4">or</div>
					<div className="grid gap-2 mt-2">
						<button
							className="border rounded-xl p-2"
							onClick={() => handleOAuth("google")}
							disabled={pending}
						>
							Continue with Google
						</button>
					</div>
					*/}

					{message && (
						<div className="text-green-600 text-sm mt-3">
							{message}
						</div>
					)}
					{error && (
						<div className="text-red-600 text-sm mt-3">
							{error}
						</div>
					)}

					<p className="text-xs text-gray-500 mt-4">
						By continuing, you agree to our Terms and acknowledge
						our Privacy Policy.
					</p>
				</div>
			</div>
		</div>
	);
}
