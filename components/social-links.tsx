"use client";
import Link from "next/link";
import { CIcon } from '@coreui/icons-react';
import { cibFacebookF, cibInstagram, cibWhatsapp, cibPinterest } from '@coreui/icons';

type SocialProps = {
	isHomePage: boolean;
}

export default function SocialLinks(linksProps: SocialProps) {
	const color = linksProps.isHomePage ? "fill-secondary" : "fill-secondary-foreground";
	return (
		<nav className="w-full p-4 flex gap-8 text-sm items-center">
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
