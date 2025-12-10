"use client";

import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import SearchBar from "./search-bar";

export default function Hero() {
	return (
		<>
			<section className="bg-background">
				<div className="mx-auto flex max-w-7xl flex-col gap-10 px-4 py-16 md:flex-row md:items-center md:px-8 md:pt-24">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6 }}
						className="flex-1"
					>
						<h1 className="text-4xl leading-tight md:text-6xl">
							InMedina
							<br /> Real Estate
						</h1>
						<h2 className="text-2xl">
							Where Heritage Meets Modern Living
						</h2>
						<p className="mt-5 max-w-prose text-neutral-800 md:text-lg">
							A curated portfolio of riads, villas, and
							retreats, crafted for modern living and timeless
							elegance.
						</p>
						<div className="mt-8 flex flex-wrap gap-3">
							<Button className="rounded-full bg-[#c98a5a] text-white shadow-sm hover:bg-[#b37750]">
								<Link
									className="flex items-center"
									href={"/properties"}
									aria-label="Properties link"
								>
									Explore Properties{" "}
									<ArrowRight className="ml-2 h-4 w-4" />
								</Link>
							</Button>
							<Button
								variant="outline"
								className="rounded-full border-[#c98a5a]/70 bg-transparent text-[#1e1e1e] hover:text-[#1e1e1e]/70 hover:bg-[#f8f3ee]"
							>
								<Link
									className="flex items-center"
									href={"/about-inmedina"}
									aria-label="Properties link"
								>
									Our Story
								</Link>
							</Button>
						</div>
					</motion.div>

					<motion.div
						initial={{ opacity: 0, y: 30 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true, amount: 0.4 }}
						transition={{ duration: 0.7 }}
						className="flex-1"
					>
						<motion.img
							src="https://inmedina.com/wp-content/uploads/2024/03/riad-bamileke-suite-wide-shot.jpg?q=80&w=2070&auto=format&fit=crop"
							alt="Moroccan courtyard"
							className="h-[300px] w-full rounded-3xl object-cover md:h-[360px]"
							initial={{ opacity: 0, scale: 0.97 }}
							whileInView={{ opacity: 1, scale: 1 }}
							viewport={{ once: true, amount: 0.5 }}
							transition={{ duration: 0.7 }}
						/>
					</motion.div>
				</div>
			</section>
			<SearchBar />
			<section className="bg-[#f8f3ee]">
				<div className="mx-auto max-w-7xl px-4 py-20 md:px-8">
					<motion.div
						initial={{ opacity: 0, y: 24 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true, amount: 0.4 }}
						transition={{ duration: 0.6 }}
					>
						<div className="grid gap-8 md:grid-cols-2 md:items-center">
							<div className="max-w-md justify-self-center">
								<div className="text-xs font-semibold tracking-[0.25em] text-neutral-500">
									OUR VISION
								</div>
								<h2 className="mt-3 font-serif text-3xl leading-snug md:text-4xl">
									A hospitality mindset, applied to property.
								</h2>
								<p className="mt-4 text-sm text-neutral-700 md:text-base">
									For over 25 years, a trusted name in
									Moroccan hospitality. Now, we&apos;re
									bringing that same passion and expertise to
									help you find your perfect property in
									Morocco.
								</p>
							</div>
							<div className="space-y-4 text-left md:pl-4 max-w-md justify-self-center">
								{[
									{
										label: "25+ years of heritage",
										text: "Hospitality experience that shapes how we guide every client, with clarity and genuine care.",
									},
									{
										label: "Handpicked listings",
										text: "Every property is selected for its architecture, authenticity, and potential to become a timeless home.",
									},
									{
										label: "Full-service guidance",
										text: "From first viewing to final keys, we support each step with a calm and considered approach.",
									},
								].map((item) => (
									<div
										key={item.label}
										className="flex gap-3"
									>
										<div className="mt-1 flex h-7 w-7 items-center justify-center rounded-full bg-[#c98a5a]/12">
											<span className="text-xs text-[#c98a5a]">
												●
											</span>
										</div>
										<div>
											<div className="text-sm font-medium text-[#1e1e1e]">
												{item.label}
											</div>
											<p className="text-xs text-neutral-600 md:text-sm">
												{item.text}
											</p>
										</div>
									</div>
								))}
							</div>
						</div>
					</motion.div>
				</div>
			</section>
		</>
	);
}
