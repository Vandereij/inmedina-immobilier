import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import ContactCta from "@/components/contact-cta";

export default function AboutInmedina() {
	return (
		<>
			{/* Hero / Intro (structure kept the same as Services hero) */}
			<section className="bg-background border-b border-border">
				<div className="relative h-[500px] w-full overflow-hidden border-b border-border">
					{/* Background image (unchanged) */}
					<img
						src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1920&auto=format&fit=crop"
						alt="Luxury homes hero banner"
						className="absolute inset-0 h-full w-full object-cover"
					/>

					{/* Dark overlay */}
					<div className="absolute inset-0 bg-linear-to-b from-black/60 via-black/75 to-black/85" />

					{/* Content with same style as Services section */}
					<div className="relative mx-auto flex h-full max-w-7xl items-center px-4 py-20 md:px-8">
						<div className="max-w-3xl text-white">
							<p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">
								About
							</p>
							<h1 className="mt-4 max-w-3xl font-serif text-4xl md:text-5xl">
								Moroccan property shaped by lived experience,
								not theory
							</h1>
							<p className="mt-6 max-w-2xl text-base leading-relaxed text">
								InMedina grew out of years spent welcoming
								guests to Morocco and restoring houses in its
								historic neighborhoods. Today we use that
								ground-level experience to help buyers and
								investors find, shape, and enjoy properties that
								feel genuinely connected to place.
							</p>

							<div className="mt-8 flex flex-wrap gap-3">
								<Button asChild>
									<Link href="/contact">
										Schedule an introduction call
									</Link>
								</Button>
								<Button asChild>
									<Link href="/properties">
										Explore our selected properties
									</Link>
								</Button>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Who we are / From hospitality to real estate */}
			<section className="bg-muted/50">
				<div className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:grid md:grid-cols-2 md:gap-16">
					<div className="mb-10 md:mb-0">
						<h2 className="font-serif text-2xl md:text-3xl">
							From welcoming guests to guiding homeowners
						</h2>
						<p className="mt-4 text-base leading-relaxed text-muted-foreground">
							Before launching InMedina, we spent decades working
							in Moroccan hospitality, running guest houses,
							restoring riads, and learning how travelers actually
							experience these spaces. Those years taught us what
							really matters: good bones, thoughtful circulation,
							reliable comfort, and a feeling of ease the moment
							you step inside. Now we bring that perspective to
							buyers and investors who want properties that are
							beautiful, functional, and resilient over time.
						</p>
						<p className="mt-4 text-base leading-relaxed text-muted-foreground">
							We understand not just how a house looks in photos,
							but how it feels to live in, to host in, and to
							maintain year after year. That is the lens we use
							when we walk into a potential property on your
							behalf.
						</p>
					</div>
					<div className="space-y-4 text-sm text-muted-foreground">
						<div>
							<p className="font-medium text-primary">
								Genuine care and long-term relationships
							</p>
							<p className="mt-1">
								We treat every project as a long-term
								collaboration, not a single transaction. Many
								clients come to us as buyers and stay in touch
								as their home or guest house evolves.
							</p>
						</div>
						<div>
							<p className="font-medium text-primary">
								Deep connection to Moroccan culture
							</p>
							<p className="mt-1">
								Years of living and working in medinas, desert
								towns, and coastal cities mean we understand
								local rhythms, customs, and craft traditions,
								and how to integrate them respectfully into your
								project.
							</p>
						</div>
						<div>
							<p className="font-medium text-primary">
								Accessible, clear, and flexible
							</p>
							<p className="mt-1">
								We are used to working with clients at different
								stages and budgets, from first-time buyers to
								experienced investors. Our role is to make the
								process understandable, realistic, and as light
								as possible, wherever you are starting from.
							</p>
						</div>
					</div>
				</div>
			</section>

			{/* Our Story / Founders */}
			<section className="bg-background">
				<div className="mx-auto max-w-7xl px-4 py-24 md:px-8">
					<div className="mb-16 max-w-2xl">
						<p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">
							Our story
						</p>
						<h2 className="mt-4 text-3xl md:text-5xl font-serif">
							Two different journeys leading to the same medina
						</h2>
						<p className="mt-6 text-base leading-relaxed text-muted-foreground">
							InMedina was born from two parallel stories: one of
							returning to Morocco again and again, drawn by its
							balance of intensity and quiet; the other of leaving
							a traditional craft behind to follow the call of the
							desert. Together, they shape how we approach each
							property: with curiosity, respect, and a clear sense
							of what really works for the people who will use it.
						</p>
					</div>

					<div className="grid gap-12 md:grid-cols-2 md:gap-16">
						{/* Stefano */}
						<article className="space-y-4">
							<div className="relative h-64 w-full overflow-hidden rounded-2xl">
								<Image
									src="/images/about-stefano.jpg"
									alt="Stefano – founder of InMedina."
									fill
									className="object-cover"
								/>
							</div>
							<div>
								<p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
									Stefano – Founder, Marketing &amp; Digital
									Strategy
								</p>
								<h3 className="mt-3 text-xl font-semibold">
									Shaped by repeated journeys through Morocco
								</h3>
								<p className="mt-3 text-sm leading-relaxed text-muted-foreground">
									Stefano first arrived in Morocco as a
									traveler, moving fast from cities to desert,
									trying to see &quot;everything&quot; in a
									single trip. He kept coming back, slowing
									down, exploring new regions, and paying
									attention to how different spaces made
									people feel. Over time, that curiosity
									turned into a vocation: creating and
									curating places where guests feel grounded,
									whether they stay a weekend or a season.
								</p>
								<p className="mt-3 text-sm leading-relaxed text-muted-foreground">
									That instinct for what feels right now
									shapes how he presents InMedina to the
									world. He builds the brand&apos;s presence,
									tells the story of each property without
									overselling it, and makes sure the
									experience people imagine online matches
									what they&apos;ll actually find when they
									arrive. His work is about clarity and
									trust—helping travelers understand what
									they&apos;re choosing, and why it might be
									exactly what they need.
								</p>
							</div>
						</article>

						{/* Alberto */}
						<article className="space-y-4">
							<div className="relative h-64 w-full overflow-hidden rounded-2xl">
								<Image
									src="/images/about-alberto.jpg"
									alt="Alberto, manager and strategist of InMedina."
									fill
									className="object-cover"
								/>
							</div>
							<div>
								<p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
									Alberto – Operations &amp; Project Logistics
									Manager
								</p>
								<h3 className="mt-3 text-xl font-semibold">
									From blacksmithing in Sardinia to dunes in
									the Sahara
								</h3>
								<p className="mt-3 text-sm leading-relaxed text-muted-foreground">
									Alberto left Sardinia and the forge as a
									young craftsman, drawn to the wide
									landscapes of southern Morocco. Crossing the
									Atlas on worn-out buses and shared taxis, he
									discovered desert towns, Berber hospitality,
									and music that spoke of long journeys and
									resilience. Those early years taught him to
									trust instincts, welcome chance encounters,
									and look beneath the surface of things.
								</p>
								<p className="mt-3 text-sm leading-relaxed text-muted-foreground">
									That practical sensibility now drives how he
									manages projects and daily operations. He
									coordinates renovations, oversees
									maintenance, works with local suppliers and
									craftspeople, and makes sure each property
									functions as it should. His role is about
									solving problems before guests notice them,
									keeping timelines realistic, and ensuring
									that the houses InMedina offers are actually
									ready to welcome people: not just beautiful
									in theory, but solid in practice.
								</p>
							</div>
						</article>
					</div>
				</div>
			</section>

			{/* Values / How we work */}
			<section className="bg-secondary">
				<div className="mx-auto max-w-7xl px-4 py-24 md:px-8">
					<div className="mb-14 max-w-2xl">
						<p className="text-xs font-semibold uppercase tracking-[0.25em] text-accent">
							How we work
						</p>
						<h2 className="mt-4 text-3xl md:text-5xl font-serif text-secondary-foreground">
							What you can expect when you work with us
						</h2>
						<p className="mt-6 text-base leading-relaxed text-secondary-foreground/80">
							Buying or renovating a property in Morocco means
							navigating a new culture, legal system, and way of
							building. Our role is to make that experience clear
							and human, so you can focus on the bigger question:
							does this place feel right for you, your guests, and
							your future plans?
						</p>
					</div>

					<div className="grid gap-8 md:grid-cols-3">
						<div className="rounded-2xl border border-border bg-secondary/40 p-6">
							<p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">
								Genuine care
							</p>
							<h3 className="mt-3 text-lg font-semibold text-secondary-foreground">
								We are on your side
							</h3>
							<p className="mt-3 text-sm leading-relaxed text-secondary-foreground/80">
								We listen carefully to what you want from your
								Moroccan property: financially, practically, and
								emotionally. If a house isn&apos;t right, we
								will tell you. If we see hidden potential,
								we&apos;ll show you where and how it can be
								unlocked.
							</p>
						</div>

						<div className="rounded-2xl border border-border bg-secondary/40 p-6">
							<p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">
								Respect for place
							</p>
							<h3 className="mt-3 text-lg font-semibold text-secondary-foreground">
								Authentic, not over-produced
							</h3>
							<p className="mt-3 text-sm leading-relaxed text-secondary-foreground/80">
								We love Moroccan architecture and craft, but we
								also know when to keep things simple. We work
								with traditional techniques like zellige and
								tadelakt alongside clean, modern lines so your
								home feels calm, not themed.
							</p>
						</div>

						<div className="rounded-2xl border border-border bg-secondary/40 p-6">
							<p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">
								Accessible guidance
							</p>
							<h3 className="mt-3 text-lg font-semibold text-secondary-foreground">
								Clarity at every step
							</h3>
							<p className="mt-3 text-sm leading-relaxed text-secondary-foreground/80">
								We explain processes, costs, and timelines in
								plain language, share honest views on risks and
								opportunities, and adapt to your preferred level
								of involvement, whether you want regular
								check-ins or support at key milestones only.
							</p>
						</div>
					</div>

					<div className="mt-16 max-w-3xl text-sm leading-relaxed text-secondary-foreground/80">
						<p>
							Some of our clients are searching for a personal
							retreat; others are building a hospitality business
							or diversifying their investments. Whatever brings
							you to Morocco, we are here to make the journey
							grounded, transparent, and genuinely enjoyable.
						</p>
					</div>
				</div>
			</section>

			{/* Existing CTA */}
			<ContactCta />
		</>
	);
}
