// app/services/page.tsx

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import ContactCta from "@/components/contact-cta";

export default function ServicesPage() {
	return (
		<>
			{/* Hero / Intro */}
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

					{/* Content */}
					<div className="relative mx-auto flex h-full max-w-7xl items-center px-4 py-20 md:px-8">
						<div className="max-w-3xl text-white">
							<p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">
								Services
							</p>
							<h1 className="mt-4 max-w-3xl font-serif text-4xl md:text-5xl">
								Bespoke support for buying and creating property
								in Morocco
							</h1>
							<p className="mt-6 max-w-2xl text-base leading-relaxed">
								InMedina helps you navigate the process of
								finding, purchasing, restoring, and enjoying
								Moroccan properties with more clarity. From
								first ideas to a finished riad or villa ready
								for guests, we combine lived experience and
								local connections so that every step feels more
								understandable and well supported.
							</p>

							<div className="mt-8 flex flex-wrap gap-3">
								<Button asChild>
									<Link href="/contact">
										Book a consultation
									</Link>
								</Button>
								<Button asChild>
									<Link href="/properties">
										View selected properties
									</Link>
								</Button>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Overview / Why work with us */}
			<section className="bg-muted/50">
				<div className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:grid md:grid-cols-2 md:gap-16">
					<div className="mb-10 md:mb-0">
						<h2 className="font-serif text-2xl md:text-3xl">
							More than a property search
						</h2>
						<p className="mt-4 text-base leading-relaxed text-muted-foreground">
							Buying a property in Morocco is exciting, but it can
							also feel overwhelming if you are new to the market.
							Our team has spent years running guest houses and
							collaborating with architects, artisans, and legal
							professionals. That experience allows us to
							highlight the small decisions that make a big
							difference to the long-term comfort and potential of
							your home.
						</p>
					</div>
					<div className="space-y-4 text-sm text-muted-foreground">
						<div>
							<p className="font-medium text-primary">
								Local insight
							</p>
							<p className="mt-1">
								We understand medina neighborhoods, how
								buildings are actually used and adapted over
								time, and what guests look for when choosing a
								stay.
							</p>
						</div>
						<div>
							<p className="font-medium text-primary">
								Focus on quality and potential
							</p>
							<p className="mt-1">
								We look at structure, light, circulation, and
								layout, not just surface finishes, so you can
								focus on properties that have the right
								fundamentals for your plans.
							</p>
						</div>
						<div>
							<p className="font-medium text-primary">
								Clear, honest guidance
							</p>
							<p className="mt-1">
								We are transparent about the work a building may
								need, likely timelines, and broad rental
								potential ranges, so you can ask the right
								questions and plan your next steps with more
								confidence. Formal legal, tax, or investment
								advice always sits with your chosen
								professionals.
							</p>
						</div>
					</div>
				</div>
			</section>

			{/* Services list */}
			<section className="bg-secondary">
				<div className="mx-auto max-w-7xl px-4 py-24 md:px-8">
					{/* Section header */}
					<div className="mb-20 max-w-2xl">
						<p className="text-xs font-semibold uppercase tracking-[0.25em] text-accent">
							Our core services
						</p>
						<h2 className="mt-4 text-3xl md:text-5xl font-serif text-secondary-foreground">
							Support at every phase of your Moroccan property
							journey
						</h2>
						<p className="mt-6 text-base leading-relaxed text-secondary-foreground/80">
							Whether you want to buy a private riad, open a guest
							house, or refresh a historic home for occasional
							stays, we offer grounded, practical guidance. You
							can work with us on a single stage or from first
							viewing through to welcoming your first guests, in
							collaboration with independent local specialists.
						</p>
					</div>

					<div className="space-y-24 md:space-y-32">
						{/* Service 1: Property Sales */}
						<div className="grid items-start gap-10 md:grid-cols-5 md:gap-12 border-t border-border pt-14">
							<div className="relative h-56 md:h-72 overflow-hidden md:col-span-2 rounded-2xl">
								<Image
									src="/images/service-sales.jpg"
									alt="A Moroccan riad courtyard with traditional tiles and arches."
									fill
									className="object-cover transition-transform duration-500 hover:scale-105"
								/>
							</div>

							<div className="md:col-span-3 max-w-prose text-secondary-foreground">
								<p className="text-xs font-medium uppercase tracking-[0.2em] text-accent">
									Property sourcing and selection
								</p>
								<h3 className="mt-4 text-2xl font-semibold">
									Finding the right riad, villa, or retreat
								</h3>
								<p className="mt-5 text-base leading-relaxed text-secondary-foreground/80">
									Instead of browsing hundreds of generic
									listings, you receive a curated selection of
									Moroccan properties that align with your
									brief. We focus on houses and apartments
									with strong fundamentals, good light, and
									clear potential, whether you plan to live in
									the property or welcome guests.
								</p>
								<ul className="mt-4 space-y-1 text-sm text-secondary-foreground/75">
									<li>
										Tailored shortlist based on your budget
										and goals
									</li>
									<li>
										Accompanied or remote viewings with
										honest, experience-based feedback on
										each option
									</li>
									<li>
										General guidance on the typical purchase
										process and introductions to qualified
										local professionals where needed
									</li>
								</ul>
								<p className="mt-4 text-sm text-secondary-foreground/70">
									This service is ideal if you are comparing
									neighborhoods, considering different
									property types, or want someone on your side
									to help you interpret what you are seeing on
									the ground.
								</p>
								<div className="mt-6 flex flex-wrap gap-3">
									<Button size="sm" variant="outline" asChild>
										<Link href="/properties">
											Explore selected properties
										</Link>
									</Button>
								</div>
							</div>
						</div>

						{/* Service 2: Renovation & Restoration */}
						<div className="grid items-start gap-10 md:grid-cols-5 md:gap-12 border-t border-border pt-14">
							<div className="md:order-2 relative h-56 md:h-72 overflow-hidden md:col-span-2 rounded-2xl">
								<Image
									src="/images/service-renovation.jpg"
									alt="Artisans working on Moroccan tadelakt and carved wood details."
									fill
									className="object-cover transition-transform duration-500 hover:scale-105"
								/>
							</div>

							<div className="md:order-1 md:col-span-3 max-w-prose text-secondary-foreground">
								<p className="text-xs font-medium uppercase tracking-[0.2em] text-accent">
									Renovation and restoration guidance
								</p>
								<h3 className="mt-4 text-2xl font-semibold">
									Transforming character properties with care
								</h3>
								<p className="mt-5 text-base leading-relaxed text-secondary-foreground/80">
									Many of the most interesting Moroccan
									buildings need work before they feel
									comfortable and ready for modern living. We
									help you think through renovation scenarios,
									clarify your priorities, and stay in the
									loop as independent architects, contractors,
									and craftspeople carry out the work.
								</p>
								<ul className="mt-4 space-y-1 text-sm text-secondary-foreground/75">
									<li>
										Concept discussions and high-level
										direction for layout and atmosphere
									</li>
									<li>
										Connections to experienced architects,
										engineers, and artisans
									</li>
									<li>
										Check-ins, informal site visits, and
										summary updates to help you feel
										informed from a distance
									</li>
								</ul>
								<p className="mt-4 text-sm text-secondary-foreground/70">
									We love working with traditional materials
									such as zellige, tadelakt, carved cedar, and
									ironwork, and combining them with simple
									contemporary finishes that feel fresh rather
									than theme-based. Execution and technical
									responsibility always sit with the licensed
									professionals you appoint.
								</p>
								<div className="mt-6 flex flex-wrap gap-3">
									<Button size="sm" asChild>
										<Link href="/contact">
											Discuss a renovation project
										</Link>
									</Button>
								</div>
							</div>
						</div>

						{/* Service 3: Expert Consultation */}
						<div className="grid items-start gap-10 md:grid-cols-5 md:gap-12 border-t border-border pt-14">
							<div className="relative h-56 md:h-72 overflow-hidden md:col-span-2 rounded-2xl">
								<Image
									src="/images/service-consulting.jpg"
									alt="Consultation about Moroccan property strategy."
									fill
									className="object-cover transition-transform duration-500 hover:scale-105"
								/>
							</div>

							<div className="md:col-span-3 max-w-prose text-secondary-foreground">
								<p className="text-xs font-medium uppercase tracking-[0.2em] text-accent">
									Advisory and planning sessions
								</p>
								<h3 className="mt-4 text-2xl font-semibold">
									Strategic orientation before you commit
								</h3>
								<p className="mt-5 text-base leading-relaxed text-secondary-foreground/80">
									If you are still deciding whether to buy, or
									you are weighing several projects, a focused
									conversation can save time and uncertainty.
									We share context on common ownership models,
									typical renovation cost drivers, and broad
									rental positioning, so you can speak to your
									legal, tax, and financial advisors with a
									clearer brief.
								</p>
								<ul className="mt-4 space-y-1 text-sm text-secondary-foreground/75">
									<li>
										One-to-one calls to explore your ideas,
										constraints, and questions
									</li>
									<li>
										General context on local regulations and
										property structures (not a substitute
										for formal legal advice)
									</li>
									<li>
										Guidance on guest expectations and
										positioning within the hospitality
										landscape
									</li>
								</ul>
								<p className="mt-4 text-sm text-secondary-foreground/70">
									This works well if you are at the research
									stage, need a grounded second view on a
									specific property, or want to test whether
									your budget and ambitions are pointing in a
									realistic direction.
								</p>
								<div className="mt-6 flex flex-wrap gap-3">
									<Button size="sm" variant="outline" asChild>
										<Link href="/contact">
											Schedule a consultation
										</Link>
									</Button>
								</div>
							</div>
						</div>

						{/* Ongoing support */}
						<div className="grid items-start gap-10 md:grid-cols-5 md:gap-12 border-t border-border pt-14">
							<div className="md:col-span-2">
								<h3 className="text-2xl font-semibold text-secondary-foreground">
									Ongoing support and trusted partners
								</h3>
							</div>
							<div className="md:col-span-3 max-w-prose text-secondary-foreground">
								<p className="text-base leading-relaxed text-secondary-foreground/80">
									Many clients stay in touch after a purchase
									or project is complete. We can point you
									towards property managers, housekeeping
									teams, photographers, and other specialists
									who help keep your home or guest house
									running smoothly and looking its best.
								</p>
								<ul className="mt-4 space-y-1 text-sm text-secondary-foreground/75">
									<li>
										Suggestions for operations, guest
										experience, and presentation
									</li>
									<li>
										Ideas for seasonal improvements and
										thoughtful upgrades
									</li>
									<li>
										Access to a network of independent,
										trusted local partners
									</li>
								</ul>
								<p className="mt-4 text-sm text-secondary-foreground/70">
									You decide how involved you would like us to
									be. Some owners prefer regular check-ins,
									while others ask for support only at key
									milestones such as a new phase of renovation
									or a change in rental strategy.
								</p>
							</div>
						</div>
					</div>

					{/* Small legal/platform note */}
					<div className="mt-16 max-w-3xl text-[11px] leading-relaxed text-secondary-foreground/70">
						<p>
							<strong>Note:</strong> InMedina operates as a
							UK-based platform. We offer experience-based
							guidance and introductions, but we do not provide
							legal, tax, architectural, engineering, or brokerage
							services. All on-the-ground real estate,
							construction, and renovation work in Morocco is
							carried out by independent third-party companies,
							who are solely responsible for their services and
							professional advice.
						</p>
					</div>
				</div>
			</section>

			{/* Reuse your existing CTA */}
			<ContactCta />
		</>
	);
}
