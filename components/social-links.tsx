"use client";
import Link from "next/link";
import { CIcon } from '@coreui/icons-react';
import { cibFacebookF, cibInstagram, cibWhatsapp, cibPinterest } from '@coreui/icons';

type SocialProps = {
	isHomePage: boolean;
}

export default function SocialLinks(linksProps: SocialProps) {
	const color = linksProps.isHomePage ? "fill-foreground/50 hover:fill-foreground" : "fill-foreground/50 hover:fill-foreground";
	return (
		<nav className="mx-auto flex max-w-7xl px-4 pt-4 md:px-8 gap-8 text-sm items-center">
			<Link className="w-3" href={"https://inmedina.com"}>
				<CIcon className={`${color}`} icon={cibFacebookF} />
			</Link>
			<Link className="w-3" href={"https://inmedina.com"}>
				<CIcon className={`${color}`} icon={cibInstagram} />
			</Link>
			<Link className="w-3" href={"https://inmedina.com"}>
				<CIcon className={`${color}`} icon={cibPinterest} />
			</Link>
			<Link className="w-3" href={"https://inmedina.com"}>
				<CIcon className={`${color}`} icon={cibWhatsapp} />
			</Link>
		</ nav>
	);
}
