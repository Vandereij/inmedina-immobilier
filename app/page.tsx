import { createClient } from "@/lib/supabase-server";
import { useMemo } from "react";
import Hero from "@/components/hero";
import ContactCta from "@/components/contact-cta";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import PropertyCardList from "@/components/property-card-list";
import Image from "next/image";

export default async function HomePage() {
	const supabase = await useMemo(() => createClient(), []);
	const { data: locations } = await supabase
		.from("locations")
		.select("*")
		.order("name");
	return (
		<>
			<Hero />
			<section className="bg-[#f8f3ee]">
				<div className="mx-auto max-w-7xl px-4 py-20 md:px-8">
					<div className="mb-10 flex items-center justify-between gap-4">
						<h2 className="font-serif text-3xl md:text-4xl">
							Featured Properties
						</h2>
						<Button
							variant="link"
							className="text-[#c98a5a]"
							asChild
						>
							<Link href={"/properties?featured=true"}>
								View all →
							</Link>
						</Button>
					</div>
					<PropertyCardList
						status="published"
						featured={true}
						locations={locations || []}
					/>
				</div>
			</section>
			<section className="m-auto max-w-7xl pt-20 pb-20 px-4 md:px-8 vision md:grid md:gap-x-20 grid-cols-1 md:grid-cols-2 md:grid-rows-none">
				<span className="max-w-lg pb-4 text-primary uppercase row-start-1 col-start-1 flex flex-none">
					About InMedina
				</span>
				<h2 className="text-4xl max-w-lg row-start-2 col-start-1">
					Built on a Legacy of Excellence
				</h2>
				<p className="text-sm row-start-2 col-start-2">
					InMedina was founded by hospitality professionals who have
					spent more than two decades welcoming guests to Morocco's
					most beautiful accommodations. Our deep understanding of
					what makes a space truly special, from the play of light
					through traditional zellige tiles to the perfect courtyard
					layout now guides our work in real estate and renovation. We
					don't just sell properties. We help you discover homes that
					capture the authentic spirit of Morocco while meeting modern
					standards of comfort and quality.
				</p>
			</section>
			<section className="bg-[#fdf4ea]">
				<div className="m-auto max-w-7xl px-4 md:px-8 py-24">
					{/* Section header */}
					<div className="mb-20 max-w-2xl">
						<p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">
							Our Services
						</p>
						<h2 className="mt-4 text-3xl md:text-5xl font-serif">
							From First Viewing to Finished Riad
						</h2>
						<p className="mt-6 text-base leading-relaxed text-muted-foreground">
							We help you buy, restore, and enjoy properties that
							capture the true spirit of Morocco, balancing
							character, craftsmanship, and modern comfort.
						</p>
					</div>

					{/* Services list with breathable spacing */}
					<div className="space-y-24 md:space-y-32">
						{/* Row 1 */}
						<div className="grid items-start gap-10 md:grid-cols-5 md:gap-12 border-t border-border pt-14">
							<div className="relative h-48 md:h-64 overflow-hidden md:col-span-2">
								<Image
									src="/images/service-sales.jpg"
									alt=""
									fill
									className="object-cover transition-transform duration-500 hover:scale-105"
								/>
							</div>

							<div className="md:col-span-3 max-w-prose">
								<p className="text-xs font-medium uppercase tracking-[0.2em] text-primary">
									Property Sales
								</p>
								<h3 className="mt-4 text-2xl font-semibold">
									Curated Moroccan Properties
								</h3>
								<p className="mt-5 text-base leading-relaxed text-muted-foreground">
									Whether you're seeking a riad in the medina,
									a villa with Atlas Mountain views, or a
									coastal retreat, we connect you with
									exceptional Moroccan properties, handpicked
									for authenticity, beauty, and quality.
								</p>
								<ul className="mt-4 space-y-1 text-sm text-muted-foreground">
									<li>Vetted listings</li>
									<li>Local market insight</li>
									<li>Guidance throughout purchase</li>
								</ul>
							</div>
						</div>

						{/* Row 2 */}
						<div className="grid items-start gap-10 md:grid-cols-5 md:gap-12 border-t border-border pt-14">
							<div className="md:order-2 relative h-48 md:h-64 overflow-hidden md:col-span-2">
								<Image
									src="/images/service-renovation.jpg"
									alt=""
									fill
									className="object-cover transition-transform duration-500 hover:scale-105"
								/>
							</div>

							<div className="md:order-1 md:col-span-3 max-w-prose">
								<p className="text-xs font-medium uppercase tracking-[0.2em] text-primary">
									Renovation & Restoration
								</p>
								<h3 className="mt-4 text-2xl font-semibold">
									Honouring Architectural Heritage
								</h3>
								<p className="mt-5 text-base leading-relaxed text-muted-foreground">
									We restore and transform properties using
									traditional Moroccan craftsmanship—zellige,
									tadelakt, carved cedar, and
									ironwork, combined with modern design
									sensibilities for comfort and longevity.
								</p>
								<ul className="mt-4 space-y-1 text-sm text-muted-foreground">
									<li>Concept & design direction</li>
									<li>Skilled local artisans</li>
									<li>Project coordination</li>
								</ul>
							</div>
						</div>

						{/* Row 3 */}
						<div className="grid items-start gap-10 md:grid-cols-5 md:gap-12 border-t border-border pt-14">
							<div className="relative h-48 md:h-64 overflow-hidden md:col-span-2">
								<Image
									src="/images/service-consulting.jpg"
									alt=""
									fill
									className="object-cover transition-transform duration-500 hover:scale-105"
								/>
							</div>

							<div className="md:col-span-3 max-w-prose">
								<p className="text-xs font-medium uppercase tracking-[0.2em] text-primary">
									Expert Consultation
								</p>
								<h3 className="mt-4 text-2xl font-semibold">
									Local Insight, Clear Guidance
								</h3>
								<p className="mt-5 text-base leading-relaxed text-muted-foreground">
									Moroccan real estate can be complex. We help
									you navigate everything: property selection,
									legal frameworks, renovation logistics, and
									investment potential, ensuring a smooth,
									transparent experience.
								</p>
								<ul className="mt-4 space-y-1 text-sm text-muted-foreground">
									<li>Property scouting</li>
									<li>Legal & administrative context</li>
									<li>Rental & investment guidance</li>
								</ul>
							</div>
						</div>
					</div>
				</div>
			</section>
			<ContactCta />
		</>
	);
}
