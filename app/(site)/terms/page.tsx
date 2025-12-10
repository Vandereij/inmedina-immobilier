import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Terms & Conditions | InMedina",
	description:
		"Read the terms and conditions for using InMedina, a UK-based platform connecting clients with independent property and renovation providers in Morocco.",
};

export default function TermsPage() {
	return (
		<main className="bg-background">
			<section className="border-b border-border bg-muted/40">
				<div className="mx-auto max-w-5xl px-4 py-16 md:px-8 md:py-24">
					<p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">
						Legal
					</p>
					<h1 className="mt-4 font-serif text-3xl md:text-5xl">
						Terms &amp; Conditions
					</h1>
					<p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground">
						These terms explain how InMedina operates as a platform
						and how we work alongside independent partners in
						Morocco. Please read them carefully before using our
						website or services.
					</p>
					<p className="mt-2 text-xs text-muted-foreground">
						Last updated: {new Date().toLocaleDateString("en-GB")}
					</p>
				</div>
			</section>

			<section className="bg-background">
				<div className="mx-auto max-w-5xl px-4 py-16 md:px-8 md:py-20 space-y-10 text-sm leading-relaxed text-muted-foreground">
					{/* 1. Introduction */}
					<section>
						<h2 className="font-semibold text-base text-foreground">
							1. Introduction
						</h2>
						<p className="mt-3">
							InMedina (&quot;InMedina&quot;, &quot;we&quot;,
							&quot;us&quot; or &quot;our&quot;) is a UK-based
							platform that connects clients with independent
							providers of real estate–related and renovation
							services in Morocco. By using our website, making an
							enquiry, or otherwise interacting with InMedina, you
							agree to these Terms &amp; Conditions
							(&quot;Terms&quot;).
						</p>
						<p className="mt-3">
							If you do not agree with these Terms, please do not
							use the website or our platform.
						</p>
					</section>

					{/* 2. Our role as a platform */}
					<section>
						<h2 className="font-semibold text-base text-foreground">
							2. Our role as a platform
						</h2>
						<p className="mt-3">
							InMedina does not provide real estate brokerage,
							construction, or renovation services. Instead, we
							operate as a platform that offers guidance, project
							insight, and introductions to independent
							third-party companies in Morocco.
						</p>
						<p className="mt-3">
							One of these third-party companies is{" "}
							<strong>RealEstateInMedina</strong>, an independent
							Moroccan entity that operates separately from
							InMedina. RealEstateInMedina and any other local
							providers are responsible for the services they
							offer, the contracts they enter into, and the
							outcomes of their work.
						</p>
						<p className="mt-3">
							Any agreement you enter into for property,
							renovation, or related services is made directly
							between you and the relevant provider, not with
							InMedina.
						</p>
					</section>

					{/* 3. Third-party services and responsibility */}
					<section>
						<h2 className="font-semibold text-base text-foreground">
							3. Third-party services and responsibility
						</h2>
						<p className="mt-3">
							Third-party providers are independent businesses.
							They are solely responsible for:
						</p>
						<ul className="mt-3 list-disc space-y-1 pl-5">
							<li>
								The accuracy of their descriptions, pricing, and
								promises
							</li>
							<li>
								The quality, safety, and legality of the
								services they offer
							</li>
							<li>
								Compliance with local laws, regulations, and
								professional standards
							</li>
							<li>
								Any contracts, invoices, or financial
								arrangements made with you
							</li>
						</ul>
						<p className="mt-3">
							InMedina does not supervise or control how
							third-party providers carry out their work and
							cannot guarantee the outcome of any project or
							transaction.
						</p>
					</section>

					{/* 4. Commissions and fees */}
					<section>
						<h2 className="font-semibold text-base text-foreground">
							4. Commissions and fees
						</h2>
						<p className="mt-3">
							In some cases, InMedina may receive a commission,
							referral fee, or share of profits from third-party
							providers in connection with projects or services
							that arise through our platform or introductions.
						</p>
						<p className="mt-3">
							Unless we explicitly state otherwise, pricing for
							services is set by the third-party provider, and
							payments are made directly between you and that
							provider.
						</p>
					</section>

					{/* 5. Your responsibilities as a client */}
					<section>
						<h2 className="font-semibold text-base text-foreground">
							5. Your responsibilities as a client
						</h2>
						<p className="mt-3">
							We encourage all clients to approach property and
							renovation projects carefully. By using our
							platform, you agree to:
						</p>
						<ul className="mt-3 list-disc space-y-1 pl-5">
							<li>
								Provide accurate and truthful information in
								your enquiries
							</li>
							<li>
								Conduct your own due diligence on any property
								and provider
							</li>
							<li>
								Seek independent legal, financial, or technical
								advice where appropriate
							</li>
							<li>
								Make your own decisions about whether to proceed
								with a purchase or project
							</li>
						</ul>
						<p className="mt-3">
							Your relationship with any provider is your own, and
							you are responsible for reviewing and understanding
							any contracts you sign.
						</p>
					</section>

					{/* 6. No professional advice */}
					<section>
						<h2 className="font-semibold text-base text-foreground">
							6. No professional advice
						</h2>
						<p className="mt-3">
							Information shared via InMedina, including emails,
							calls, reports, or website content, is for general
							guidance only. It should not be treated as legal,
							financial, tax, or architectural advice.
						</p>
						<p className="mt-3">
							You should always consult appropriately qualified
							professionals before making significant decisions
							about property or investment.
						</p>
					</section>

					{/* 7. Limitation of liability */}
					<section>
						<h2 className="font-semibold text-base text-foreground">
							7. Limitation of liability
						</h2>
						<p className="mt-3">
							To the fullest extent permitted by law, InMedina is
							not liable for any loss, damage, delay, cost, or
							claim arising out of or in connection with:
						</p>
						<ul className="mt-3 list-disc space-y-1 pl-5">
							<li>
								The acts, omissions, or services of third-party
								providers (including RealEstateInMedina)
							</li>
							<li>
								Any contracts or agreements you enter into with
								third-party providers
							</li>
							<li>
								Property defects, project delays, cost overruns,
								or changes in market conditions
							</li>
							<li>
								Your use of or reliance on information provided
								through our platform
							</li>
						</ul>
						<p className="mt-3">
							Nothing in these Terms excludes or limits liability
							where it would be unlawful to do so.
						</p>
					</section>

					{/* 8. Website use and availability */}
					<section>
						<h2 className="font-semibold text-base text-foreground">
							8. Website use and availability
						</h2>
						<p className="mt-3">
							While we aim to keep the website available, secure,
							and up to date, we cannot guarantee uninterrupted
							access, error-free content, or complete security. We
							may update, suspend, or withdraw parts of the site
							without notice.
						</p>
					</section>

					{/* 9. Intellectual property */}
					<section>
						<h2 className="font-semibold text-base text-foreground">
							9. Intellectual property
						</h2>
						<p className="mt-3">
							All content on this website, including text, imagery,
							branding, and design, is owned by or licensed to
							InMedina. You may not copy, reproduce, or reuse this
							content for commercial purposes without written
							permission.
						</p>
					</section>

					{/* 10. Governing law */}
					<section>
						<h2 className="font-semibold text-base text-foreground">
							10. Governing law and jurisdiction
						</h2>
						<p className="mt-3">
							These Terms are governed by the laws of England and
							Wales. Any disputes arising in connection with these
							Terms or your use of the website shall be subject to
							the exclusive jurisdiction of the courts of England
							and Wales, unless mandatory law in your country of
							residence requires otherwise.
						</p>
					</section>

					{/* 11. Changes to these Terms */}
					<section>
						<h2 className="font-semibold text-base text-foreground">
							11. Changes to these Terms
						</h2>
						<p className="mt-3">
							We may update these Terms from time to time to
							reflect changes in how we work, legal requirements,
							or our partnerships. When we do, we will update the
							&quot;Last updated&quot; date at the top of this
							page. Your continued use of the website after
							changes are published means you accept the updated
							Terms.
						</p>
					</section>

					{/* 12. Contact */}
					<section>
						<h2 className="font-semibold text-base text-foreground">
							12. Contact
						</h2>
						<p className="mt-3">
							If you have any questions about these Terms, you can
							contact us at:
						</p>
						<p className="mt-2 text-foreground">
							realestate@inmedina.com
						</p>
					</section>
				</div>
			</section>
		</main>
	);
}
