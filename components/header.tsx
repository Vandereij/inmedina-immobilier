"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import SocialLinks from "./social-links";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import nmlogosvg from "../public/nmlogo.svg";
import { Menu, X } from "lucide-react";
import { UserAvatar } from "./user-avatar";
import { createClient } from "@/lib/supabase-client";
import {
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
} from "@/components/ui/hover-card";

type HeaderProps = {
	isAdmin: boolean;
	user: { id: string; email?: string | null } | null;
};

export default function Header({ isAdmin, user }: HeaderProps) {
	const pathname = usePathname();
	const router = useRouter();
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

	const isAuthPage = pathname?.startsWith("/auth");
	const isHomePage = pathname === "/";

	const supabase = createClient();

	const navItems = [
		{ name: "Home", url: "/" },
		{ name: "Properties", url: "/properties" },
		{ name: "Services", url: "/services" },
		{ name: "Who we are", url: "/about-inmedina" },
		{ name: "Contact us", url: "/contact" },
	];

	const toggleMobileMenu = () =>
		setIsMobileMenuOpen((prev) => !prev);
	const closeMobileMenu = () => setIsMobileMenuOpen(false);

	const handleLogout = async () => {
		// Sign out of Supabase
		await supabase.auth.signOut();

		// Close mobile menu if open
		setIsMobileMenuOpen(false);

		// Go to homepage and force a refresh so server components rerun
		router.push("/");
		router.refresh();
	};

	return (
		<>
			<header className="bg-background/90 backdrop-blur text-sm">
				<SocialLinks isHomePage={isHomePage} />
				<nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-8">
					<Link className="flex items-center gap-3" href="/">
						<Image
							className="grid h-8 w-8 p-1.5 place-items-center bg-foreground/90 rounded-xl"
							alt="InMedina Logo"
							src={nmlogosvg}
							width={40}
							height={40}
						/>
						<div className="font-serif text-lg">InMedina</div>
					</Link>

					<div>
						{/* Desktop Navigation */}
						<div className="hidden gap-6 text-sm text-neutral-700 md:flex items-center">
							{navItems.map((item) => (
								<Button
									key={item.url}
									variant="linkHeader"
									size="header"
									asChild
								>
									<Link href={item.url}>{item.name}</Link>
								</Button>
							))}

							{user ? (
								<>
									{isAdmin && (
										<Button
											variant="linkHeader"
											size="header"
											asChild
										>
											<Link href="/admin">Admin</Link>
										</Button>
									)}

									<HoverCard openDelay={80} closeDelay={120}>
										<HoverCardTrigger asChild>
											<button
												className="rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
												aria-label="User menu"
											>
												<UserAvatar email={user.email} />
											</button>
										</HoverCardTrigger>

										<HoverCardContent
											align="end"
											className="w-64 space-y-3"
										>
											<div>
												<div className="text-xs text-muted-foreground">
													Signed in as
												</div>
												<div className="text-sm font-medium truncate">
													{user.email ?? "Unknown"}
												</div>
											</div>

											<div className="h-px bg-border" />

											{isAdmin && (
												<Button
													variant="ghost"
													size="sm"
													className="w-full justify-start"
													asChild
												>
													<Link href="/admin">
														Admin
													</Link>
												</Button>
											)}

											<Button
												variant="ghost"
												size="sm"
												className="w-full justify-start"
												onClick={handleLogout}
											>
												Log out
											</Button>
										</HoverCardContent>
									</HoverCard>
								</>
							) : (
								<Button
									size="lg"
									variant="default"
									className="rounded-full hidden lg:flex"
									asChild
								>
									<Link href="/auth">
										Login / Sign up
									</Link>
								</Button>
							)}
						</div>

						{/* Mobile Menu Button */}
						<Button
							variant={isHomePage ? "default" : "ghost"}
							size="icon"
							className="lg:hidden"
							onClick={toggleMobileMenu}
							aria-label="Toggle menu"
						>
							{isMobileMenuOpen ? (
								<X className="h-6 w-6" />
							) : (
								<Menu className="h-6 w-6" />
							)}
						</Button>
					</div>
				</nav>
			</header>

			{/* Mobile Menu Overlay */}
			{isMobileMenuOpen && (
				<div
					className="fixed inset-0 bg-black/50 z-40 lg:hidden"
					onClick={closeMobileMenu}
				/>
			)}

			{/* Mobile Menu Slide-out */}
			<div
				className={`fixed top-0 right-0 h-full w-64 bg-background shadow-lg z-50 transform transition-transform duration-300 ease-in-out lg:hidden ${
					isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
				}`}
			>
				<div className="flex flex-col p-6 gap-4">
					<Button
						variant="ghost"
						size="icon"
						className="self-end mb-4"
						onClick={closeMobileMenu}
						aria-label="Close menu"
					>
						<X className="h-6 w-6" />
					</Button>

					{/* Mobile nav items (same as desktop) */}
					{navItems.map((item) => (
						<Button
							key={item.url}
							className="justify-start"
							size="lg"
							variant="ghost"
							asChild
							onClick={closeMobileMenu}
						>
							<Link href={item.url} className="font-medium">
								{item.name}
							</Link>
						</Button>
					))}

					{/* Admin link only when logged in & isAdmin */}
					{user && isAdmin && (
						<Button
							className="justify-start"
							size="lg"
							variant="ghost"
							asChild
							onClick={closeMobileMenu}
						>
							<Link href="/admin">Admin</Link>
						</Button>
					)}

					{/* Auth actions */}
					{!user && !isAuthPage && (
						<Button
							size="lg"
							variant="default"
							className="rounded-full mt-4"
							asChild
							onClick={closeMobileMenu}
						>
							<Link href="/auth">Login / Sign up</Link>
						</Button>
					)}

					{user && (
						<Button
							size="lg"
							variant="outline"
							className="mt-4"
							onClick={handleLogout}
						>
							Log out
						</Button>
					)}
				</div>
			</div>
		</>
	);
}
