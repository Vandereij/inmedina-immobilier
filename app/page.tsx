import { createClient } from "@/lib/supabase-server";
import { useMemo } from "react";
import SearchBar from "@/components/search-bar";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function HomePage() {
	const supabase = await useMemo(() => createClient(), []);
	const { data: locations } = await supabase
		.from("locations")
		.select("*")
		.order("name");
	return (
		<>
			<section className="w-full grid h-fit gap-6  bg-cover bg-center bg-gray-400 bg-blend-multiply bg-[url(https://inmedina.com/wp-content/uploads/2024/03/riad-bamileke-suite-wide-shot.jpg)]">
				<div className="flex justify-center">
					<div className="w-10/12">
						<div className="pt-65 pb-20 text-white">
							<h1 className="text-5xl font-light">
								<span className="uppercase">
									Real Estate InMedina
								</span>
							</h1>
							<h2 className="text-2xl font-normal">
								Where Heritage Meets Modern Living
							</h2>
						</div>
						<SearchBar />
					</div>
				</div>
			</section>
			<section className="pt-8 pb-30 flex flex-1 justify-center bg-radial-[100%_100%_at_50%_-10%] to-transparent via-card-foreground via-100% from-card-foreground text-secondary vision">
				<div className="w-10/12 md:w-8/12">
					<span className="flex pb-4 text-primary uppercase">
						Our Vision
					</span>
					<h2 className="text-3xl font-medium">
						For over 25 years, a trusted name in Moroccan
						hospitality. Now, we're bringing that same passion and
						expertise to help you find your perfect property in
						Morocco.
					</h2>
					<div className="pt-6 grid grid-cols-6 gap-6">
						<Button
							asChild
							className="col-start-2 col-span-2 bg-transparent border-2 border-accent text-accent-foreground"
						>
							<Link href="/properties">Explore Properties</Link>
						</Button>
						<Button asChild className="col-span-2">
							<Link href="/contact">Contact Us</Link>
						</Button>
					</div>
				</div>
			</section>

			<section className="pt-40 pb-20 flex flex-1 justify-center vision">
				<div className="w-10/12 md:w-6/12">
					<span className="flex pb-4 text-primary uppercase">
						About InMedina
					</span>
					<div className="lg:flex lg:gap-20">
						<h2 className="text-4xl font-medium">
							Built on a Legacy of Excellence
						</h2>
						<p className="text-sm">
							InMedina was founded by hospitality professionals
							who have spent more than two decades welcoming
							guests to Morocco's most beautiful accommodations.
							Our deep understanding of what makes a space truly
							special—from the play of light through traditional
							zellige tiles to the perfect courtyard layout—now
							guides our work in real estate and renovation. We
							don't just sell properties. We help you discover
							homes that capture the authentic spirit of Morocco
							while meeting modern standards of comfort and
							quality.
						</p>
					</div>
				</div>
			</section>
			<section className="py-20 flex flex-1 justify-center bg-secondary vision">
				<div className="w-10/12 md:w-8/12">
					<h2 className="text-3xl pb-4 vision">Our Services</h2>
					<div className="grid">
						<div className="grid grid-cols-1 md:grid-cols-3 gap-x-6">
							<h3 className="font-semibold row-start-1 md:col-auto md:row-auto pb-2">Property Sales</h3>
							<h3 className="font-semibold row-start-3 md:col-auto md:row-auto pb-2">Renovation & Restoration</h3>
							<h3 className="font-semibold row-start-5 md:col-auto md:row-auto pb-2">Expert Consultation</h3>
							<p className="pb-6 text-sm">
								Whether you're seeking a riad in the heart of
								the medina, a villa with Atlas Mountain views,
								or a coastal retreat, we connect you with
								exceptional Moroccan properties. Our portfolio
								reflects our commitment to authenticity,
								quality, and location.
							</p>
							<p className="pb-6 text-sm">
								We transform properties while honoring their
								architectural heritage. Our team combines
								traditional Moroccan craftsmanship with
								contemporary design sensibilities, creating
								spaces that are both timeless and livable.
							</p>
							<p className="pb-6 text-sm">
								Navigating Moroccan real estate requires local
								knowledge and experience. We guide you through
								every step—from property selection and legal
								processes to design and renovation—ensuring a
								smooth, transparent experience.
							</p>
						</div>
					</div>
				</div>
			</section>
			<section className="py-20 flex flex-1 justify-center vision">
				<div className="w-10/12 md:w-8/12">
					<h2 className="text-3xl pb-4 vision">
						Why Choose InMedina
					</h2>
					<div className="grid">
						<div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-2">
							<h3 className="font-semibold col-start-1 row-start-1 md:col-auto md:row-auto">
								25+ Years of Morocco Expertise
							</h3>
							<h3 className="font-semibold col-start-2 row-start-1 md:col-auto md:row-auto">
								Local Knowledge, International Standards
							</h3>
							<h3 className="font-semibold col-start-1 row-start-3 md:col-auto md:row-auto">
								End-to-End Service
							</h3>
							<h3 className="font-semibold col-start-2 row-start-3 md:col-auto md:row-auto">
								Trusted Network
							</h3>
							<p className="text-sm">
								Our founders' quarter-century in Moroccan
								hospitality gives us unmatched insight into what
								makes properties exceptional.
							</p>
							<p className="text-sm">
								We understand both the traditional heart of
								Morocco and the expectations of international
								buyers.
							</p>
							<p className="text-sm">
								From first viewing to final renovation, we're
								with you throughout your property journey.
							</p>
							<p className="text-sm">
								Our established relationships with craftsmen,
								contractors, and legal professionals ensure
								quality and reliability.
							</p>
						</div>
					</div>
				</div>
			</section>
		</>
	);
}
