"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
	const pathname = usePathname();
	const isAuthPage = pathname?.startsWith("/auth");

	return (
		<header className="p-4 border-b flex items-center justify-between">
			<Link href="/" className="font-semibold text-lg">
				RealEstate
			</Link>

			<nav className="flex gap-4 text-sm items-center">
				<Link href="/properties" className="hover:underline">
					Properties
				</Link>
				<Link href="/blog" className="hover:underline">
					Blog
				</Link>
				<Link href="/admin" className="hover:underline">
					Admin
				</Link>
				{!isAuthPage && (
					<Link
						href="/auth"
						className="border rounded-xl px-3 py-1 hover:bg-gray-100"
					>
						Login / Sign up
					</Link>
				)}
			</nav>
		</header>
	);
}
