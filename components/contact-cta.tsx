'use client'

import { Mail } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import CIcon from "@coreui/icons-react";
import { cibWhatsapp } from "@coreui/icons";

export default function ContactCta() {
	return (
		
			<section className="bg-[#f8f3ee]">
				<div className="mx-auto max-w-6xl px-4 py-20 text-center md:px-8">
					<h3 className="font-serif text-3xl md:text-4xl">
						Let's begin your journey
					</h3>
					<p className="mt-3 text-neutral-800">
						Reach out for a tailored property selection or
						renovation consultation.
					</p>
					<div className="mt-6 flex flex-col items-center gap-3 md:flex-row md:justify-center">
						<Input
							placeholder="you@domain.com"
							className="max-w-xs bg-[#f8f3ee]/80"
						/>
						<Button className="bg-[#c98a5a] text-white hover:bg-[#b37750]">
							Subscribe
						</Button>
					</div>
					<div className="mt-8 flex justify-center gap-3">
						<Button
							variant="default"
							className="rounded-full"
						>
							<Mail className="mr-2 h-4 w-4" /> Email
						</Button>
						<Button
							variant="default"
							className="rounded-full"
						>
							<CIcon className="fill-accent-foreground" icon={cibWhatsapp}/> Chat
						</Button>
					</div>
				</div>
			</section>
	)
}