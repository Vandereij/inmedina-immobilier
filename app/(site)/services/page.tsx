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
				<div className="mx-auto max-w-7xl px-4 py-20 md:px-8">
					<p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">
						Services
					</p>
					<h1 className="mt-4 max-w-3xl font-serif text-4xl md:text-5xl">
						Bespoke support for buying and creating property in Morocco
					</h1>
					<p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground">
						InMedina helps you find, purchase, restore, and enjoy Moroccan
						properties with confidence. From first ideas to a finished riad
						or villa ready for guests, we combine local knowledge and
						hospitality experience so that every step feels clear and well
						supported.
					</p>

					<div className="mt-8 flex flex-wrap gap-3">
						<Button asChild>
							<Link href="/contact">Book a consultation</Link>
						</Button>
						<Button variant="outline" asChild>
							<Link href="/properties">View current listings</Link>
						</Button>
					</div>
				</div>
			</section>

			{/* Overview / Why work with us */}
			<section className="bg-muted/50">
				<div className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:grid md:grid-cols-2 md:gap-16">
					<div className="mb-10 md:mb-0">
						<h2 className="font-serif text-2xl md:text-3xl">
							More than a real estate agency
						</h2>
						<p className="mt-4 text-base leading-relaxed text-muted-foreground">
							Buying a property in Morocco is exciting, but it can also feel
							overwhelming if you are new to the market. Our team has spent
							years running successful guest houses and working with
							architects, artisans, and legal partners. That experience allows
							us to guide you through the small decisions that make a big
							difference to the long term value and enjoyment of your home.
						</p>
					</div>
					<div className="space-y-4 text-sm text-muted-foreground">
						<div>
							<p className="font-medium text-primary">Local expertise</p>
							<p className="mt-1">
								We understand how medina neighborhoods work, how building
								regulations are applied in practice, and what guests look
								for when choosing a stay.
							</p>
						</div>
						<div>
							<p className="font-medium text-primary">
								Focus on quality and potential
							</p>
							<p className="mt-1">
								We look at structure, light, circulation, and layout,
								not just surface finishes, so you invest in a property
								that will age well.
							</p>
						</div>
						<div>
							<p className="font-medium text-primary">Clear, honest advice</p>
							<p className="mt-1">
								We are transparent about the work a building may need,
								expected timelines, and realistic rental performance,
								so you can plan with confidence.
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
							Support at every phase of your Moroccan property journey
						</h2>
						<p className="mt-6 text-base leading-relaxed text-secondary-foreground/80">
							Whether you want to buy a private riad, open a guest house,
							or renovate a historic home for occasional stays, we provide
							clear and practical support. You can work with us on a single
							stage or from first viewing through to opening your doors.
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
									Property sourcing and sales
								</p>
								<h3 className="mt-4 text-2xl font-semibold">
									Finding the right riad, villa, or retreat
								</h3>
								<p className="mt-5 text-base leading-relaxed text-secondary-foreground/80">
									Instead of browsing hundreds of generic listings,
									you receive a curated selection of Moroccan
									properties that match your brief. We focus on
									houses and apartments with strong fundamentals,
									good light, and clear potential, whether you plan
									to live in the property or welcome guests.
								</p>
								<ul className="mt-4 space-y-1 text-sm text-secondary-foreground/75">
									<li>Tailored shortlist based on your budget and goals</li>
									<li>Accompanied viewings and honest feedback on each option</li>
									<li>Support with negotiation and the purchase process</li>
								</ul>
								<p className="mt-4 text-sm text-secondary-foreground/70">
									This service is ideal if you are at the stage of
									comparing neighborhoods, considering different
									property types, or want a trusted local partner to
									represent your interests.
								</p>
								<div className="mt-6 flex flex-wrap gap-3">
									<Button size="sm" variant="outline" asChild>
										<Link href="/properties">Explore selected properties</Link>
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
									Renovation and restoration
								</p>
								<h3 className="mt-4 text-2xl font-semibold">
									Transforming character properties with care
								</h3>
								<p className="mt-5 text-base leading-relaxed text-secondary-foreground/80">
									Many of the most interesting Moroccan buildings need
									work before they feel comfortable and ready for
									modern living. We help you plan and coordinate
									renovation projects that respect original details
									while introducing thoughtful upgrades to layout,
									lighting, plumbing, and climate control.
								</p>
								<ul className="mt-4 space-y-1 text-sm text-secondary-foreground/75">
									<li>Concept development and high level design direction</li>
									<li>Connections to experienced architects and artisans</li>
									<li>Regular updates, site visits, and progress reports</li>
								</ul>
								<p className="mt-4 text-sm text-secondary-foreground/70">
									We work with traditional materials such as zellige,
									tadelakt, carved cedar, and ironwork, and combine
									them with simple contemporary finishes that feel
									fresh rather than theme based.
								</p>
								<div className="mt-6 flex flex-wrap gap-3">
									<Button size="sm" asChild>
										<Link href="/contact">Discuss a renovation project</Link>
									</Button>
								</div>
							</div>
						</div>

						{/* Service 3: Expert Consultation */}
						<div className="grid items-start gap-10 md:grid-cols-5 md:gap-12 border-t border-border pt-14">
							<div className="relative h-56 md:h-72 overflow-hidden md:col-span-2 rounded-2xl">
								<Image
									src="/images/service-consulting.jpg"
									alt="Consultation about Moroccan real estate strategy."
									fill
									className="object-cover transition-transform duration-500 hover:scale-105"
								/>
							</div>

							<div className="md:col-span-3 max-w-prose text-secondary-foreground">
								<p className="text-xs font-medium uppercase tracking-[0.2em] text-accent">
									Advisory and planning
								</p>
								<h3 className="mt-4 text-2xl font-semibold">
									Strategic advice before you commit
								</h3>
								<p className="mt-5 text-base leading-relaxed text-secondary-foreground/80">
									If you are still deciding whether to buy, or you
									are weighing up several projects, a focused
									consultation can save you time and money. We help
									you understand legal structures, renovation costs,
									and likely rental performance so that you can move
									forward with a realistic plan.
								</p>
								<ul className="mt-4 space-y-1 text-sm text-secondary-foreground/75">
									<li>One to one calls to explore your ideas and constraints</li>
									<li>Context on local regulations and ownership models</li>
									<li>Guidance on rental strategy and guest expectations</li>
								</ul>
								<p className="mt-4 text-sm text-secondary-foreground/70">
									This works well if you are at the research stage,
									need a second opinion on a specific property, or
									want to understand whether your budget matches
									your ambitions.
								</p>
								<div className="mt-6 flex flex-wrap gap-3">
									<Button size="sm" variant="outline" asChild>
										<Link href="/contact">Schedule a consultation</Link>
									</Button>
								</div>
							</div>
						</div>

						{/* Optional: Ongoing support */}
						<div className="grid items-start gap-10 md:grid-cols-5 md:gap-12 border-t border-border pt-14">
							<div className="md:col-span-2">
								<h3 className="text-2xl font-semibold text-secondary-foreground">
									Ongoing support and trusted partners
								</h3>
							</div>
							<div className="md:col-span-3 max-w-prose text-secondary-foreground">
								<p className="text-base leading-relaxed text-secondary-foreground/80">
									Many clients stay in touch after a project is
									complete. We can introduce you to property
									managers, housekeeping teams, photographers, and
									other specialists who help keep your home or guest
									house running smoothly and looking its best.
								</p>
								<ul className="mt-4 space-y-1 text-sm text-secondary-foreground/75">
									<li>Recommendations for operations and guest experience</li>
									<li>Suggestions for seasonal improvements and upgrades</li>
									<li>Access to a network of reliable local partners</li>
								</ul>
								<p className="mt-4 text-sm text-secondary-foreground/70">
									You decide how involved you would like us to be.
									Some owners prefer regular check ins, while others
									ask for advice only at key milestones such as a new
									phase of renovation or a change in rental strategy.
								</p>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Reuse your existing CTA */}
			<ContactCta />
		</>
	);
}
