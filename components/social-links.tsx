"use client";
import Link from "next/link";
import { CIcon } from '@coreui/icons-react';
import { cibFacebookF, cibInstagram, cibWhatsapp, cibPinterest } from '@coreui/icons';

export default function SocialLinks() {
	return (
		<nav className="w-full p-4 flex gap-8 text-sm items-center">
			<Link className="w-3 text-background" href={"https://inmedina.com"}>
				<CIcon icon={cibFacebookF} />
			</Link>
			<Link className="w-3" href={"https://inmedina.com"}>
				<CIcon icon={cibInstagram} />
			</Link>
			<Link className="w-3" href={"https://inmedina.com"}>
				<CIcon icon={cibPinterest} />
			</Link>
			<Link className="w-3" href={"https://inmedina.com"}>
				<CIcon icon={cibWhatsapp} />
			</Link>
		</ nav>
	);
}
