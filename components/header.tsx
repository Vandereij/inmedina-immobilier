"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import SocialLinks from "./social-links";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import nmlogo from "../public/nmlogo.png";
import nmlogodark from "../public/nmlogodark.png";

export default function Header() {
	const pathname = usePathname();
	const isAuthPage = pathname?.startsWith("/auth");
	const isHomePage = pathname === "/";
	const headerPosition = isHomePage ? "absolute left-0 right-0" : "";
	const linkColor = isHomePage ? "text-secondary" : "text-secondary-foreground";
	const logoImage = isHomePage ? nmlogodark : nmlogo;

	return (
		<>
			<header
				className={`pt-4 pb-6 flex items-center justify-center ${headerPosition}`}
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

							<div className="flex gap-4 transition-all">
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

								{/* <Button
									className={`${linkColor}`}
									size="sm"
									variant="link"
									asChild
								>
									<Link
										href="/blog"
										className="hover:underline"
									>
										Blog
									</Link>
								</Button> */}

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
							{!isAuthPage && (
								<Button
									size="lg"
									variant="default"
									className="rounded-full"
									asChild
								>
									<Link href="/auth">Login / Sign up</Link>
								</Button>
							)}
						</nav>
					</div>
				</div>
			</header>
		</>
	);
}
