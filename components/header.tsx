"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import SocialLinks from "./social-links";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import nmlogo from "../public/nmlogo.png";
import nmlogodark from "../public/nmlogodark.png";
import { Menu, X } from "lucide-react";

export default function Header() {
	const pathname = usePathname();
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const isAuthPage = pathname?.startsWith("/auth");
	const isHomePage = pathname === "/";
	const headerPosition = isHomePage ? "absolute left-0 right-0" : "";
	const linkColor = isHomePage ? "text-secondary" : "text-secondary-foreground";
	const iconColor = isHomePage ? "fill-secondary" : "fill-secondary-foreground";
	const logoImage = isHomePage ? nmlogodark : nmlogo;

	const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
	const closeMobileMenu = () => setIsMobileMenuOpen(false);

	return (
		<>
			<header
				className={`pt-4 pb-6 flex items-center justify-center ${headerPosition} z-50`}
			>
				<div className="w-10/12">
					<SocialLinks isHomePage={isHomePage} />
					<div className="flex">
						<nav className="flex w-full items-center justify-between">
							<Link href="/" className="font-semibold text-lg">
								<Image
									alt="InMedina Logo"
									src={logoImage}
									width={90}
									height={90}
								/>
							</Link>

							{/* Desktop Navigation */}
							<div className="hidden lg:flex gap-4 transition-all">
								<Button
									className={`${linkColor}`}
									size="sm"
									variant="link"
									asChild
								>
									<Link
										href="/"
										className="hover:underline font-medium"
									>
										Home
									</Link>
								</Button>

								<Button
									className={`${linkColor}`}
									size="sm"
									variant="link"
									asChild
								>
									<Link
										href="/properties"
										className="hover:underline font-medium"
									>
										Properties
									</Link>
								</Button>

								<Button
									className={`${linkColor}`}
									size="sm"
									variant="link"
									asChild
								>
									<Link
										href="/about-inmedina"
										className="hover:underline"
									>
										Who We Are
									</Link>
								</Button>

								<Button
									className={`rounded-2xl`}
									size="sm"
									variant="secondary"
									asChild
								>
									<Link href="/contact">Contact Us</Link>
								</Button>

								<Button
									className={`${linkColor}`}
									size="sm"
									variant="link"
									asChild
								>
									<Link
										href="/admin"
										className="hover:underline"
									>
										Admin
									</Link>
								</Button>
							</div>

							{/* Desktop Auth Button */}
							{!isAuthPage && (
								<Button
									size="lg"
									variant="default"
									className="rounded-full hidden lg:flex"
									asChild
								>
									<Link href="/auth">Login / Sign up</Link>
								</Button>
							)}

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
						</nav>
					</div>
				</div>
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

					<Button
						className="justify-start"
						size="lg"
						variant="ghost"
						asChild
						onClick={closeMobileMenu}
					>
						<Link href="/" className="font-medium">
							Home
						</Link>
					</Button>

					<Button
						className="justify-start"
						size="lg"
						variant="ghost"
						asChild
						onClick={closeMobileMenu}
					>
						<Link href="/properties" className="font-medium">
							Properties
						</Link>
					</Button>

					<Button
						className="justify-start"
						size="lg"
						variant="ghost"
						asChild
						onClick={closeMobileMenu}
					>
						<Link href="/about-inmedina">
							Who We Are
						</Link>
					</Button>

					<Button
						className="justify-start"
						size="lg"
						variant="ghost"
						asChild
						onClick={closeMobileMenu}
					>
						<Link href="/contact">Contact Us</Link>
					</Button>

					<Button
						className="justify-start"
						size="lg"
						variant="ghost"
						asChild
						onClick={closeMobileMenu}
					>
						<Link href="/admin">
							Admin
						</Link>
					</Button>

					{!isAuthPage && (
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
				</div>
			</div>
		</>
	);
}