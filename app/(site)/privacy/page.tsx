import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Privacy Policy | InMedina",
	description:
		"Learn how InMedina, a UK-based platform, collects, uses, and protects your personal data when you enquire about properties or services in Morocco.",
};

export default function PrivacyPage() {
	return (
		<main className="bg-background">
			<section className="border-b border-border bg-muted/40">
				<div className="mx-auto max-w-5xl px-4 py-16 md:px-8 md:py-24">
					<p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">
						Legal
					</p>
					<h1 className="mt-4 font-serif text-3xl md:text-5xl">
						Privacy Policy
					</h1>
					<p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground">
						This policy explains how we handle your personal data
						when you visit our website, get in touch, or work with
						us through InMedina.
					</p>
					<p className="mt-2 text-xs text-muted-foreground">
						Last updated: {new Date().toLocaleDateString("en-GB")}
					</p>
				</div>
			</section>

			<section className="bg-background">
				<div className="mx-auto max-w-5xl px-4 py-16 md:px-8 md:py-20 space-y-10 text-sm leading-relaxed text-muted-foreground">
					{/* 1. Who we are */}
					<section>
						<h2 className="font-semibold text-base text-foreground">
							1. Who we are
						</h2>
						<p className="mt-3">
							InMedina (&quot;we&quot;, &quot;us&quot;, or
							&quot;our&quot;) is a UK-based platform that
							connects clients with independent third-party
							providers of property and renovation services in
							Morocco. We are responsible for handling your data
							in relation to the InMedina website and direct
							communications with you.
						</p>
					</section>

					{/* 2. The data we collect */}
					<section>
						<h2 className="font-semibold text-base text-foreground">
							2. The data we collect
						</h2>
						<p className="mt-3">
							The information we collect depends on how you
							interact with us. This may include:
						</p>
						<ul className="mt-3 list-disc space-y-1 pl-5">
							<li>
								<strong>Contact details:</strong> such as your
								name, email address, and phone number when you
								submit an enquiry.
							</li>
							<li>
								<strong>Project details:</strong> such as your
								property preferences, budget indications,
								timeline, and any information you choose to
								share about your plans.
							</li>
							<li>
								<strong>Usage data:</strong> including IP
								address, browser type, device information, and
								pages visited, typically collected through
								cookies and analytics tools.
							</li>
							<li>
								<strong>Communication data:</strong> such as
								emails or messages exchanged with us.
							</li>
						</ul>
					</section>

					{/* 3. How we use your data */}
					<section>
						<h2 className="font-semibold text-base text-foreground">
							3. How we use your data
						</h2>
						<p className="mt-3">
							We use your information for the following purposes:
						</p>
						<ul className="mt-3 list-disc space-y-1 pl-5">
							<li>
								To respond to your enquiries and communicate
								with you
							</li>
							<li>
								To understand your needs and suggest relevant
								properties, services, or partners
							</li>
							<li>
								To introduce you to independent providers where
								requested
							</li>
							<li>
								To operate, maintain, and improve our website
								and services
							</li>
							<li>
								To comply with legal, regulatory, or accounting
								obligations
							</li>
						</ul>
						<p className="mt-3">
							We do not sell your personal data to third parties.
						</p>
					</section>

					{/* 4. Sharing your data with third parties */}
					<section>
						<h2 className="font-semibold text-base text-foreground">
							4. Sharing your data with third parties
						</h2>
						<p className="mt-3">
							We may share your information in limited
							circumstances:
						</p>
						<ul className="mt-3 list-disc space-y-1 pl-5">
							<li>
								<strong>
									Independent providers in Morocco:
								</strong>{" "}
								When you ask us to connect you with a local
								partner (such as RealEstateInMedina), we may
								share relevant details about your project so
								they can respond appropriately.
							</li>
							<li>
								<strong>Service providers:</strong> We use
								trusted third-party tools for hosting, email,
								analytics, and similar functions, who process
								data on our behalf.
							</li>
							<li>
								<strong>Legal and regulatory:</strong> We may
								disclose data if required to do so by law,
								regulation, or legal process.
							</li>
						</ul>
						<p className="mt-3">
							Independent providers (including RealEstateInMedina)
							are separate entities with their own
							responsibilities and policies. Once connected, they
							may collect and handle your data directly. Their use
							of your data is governed by their own agreements and
							practices.
						</p>
					</section>

					{/* 5. International transfers */}
					<section>
						<h2 className="font-semibold text-base text-foreground">
							5. International transfers
						</h2>
						<p className="mt-3">
							Because we are based in the UK and work with
							partners in Morocco and potentially other countries,
							your data may be processed in multiple
							jurisdictions. Where required, we take reasonable
							steps to ensure that any transfers are made in
							compliance with applicable data protection laws.
						</p>
					</section>

					{/* 6. How we protect your data */}
					<section>
						<h2 className="font-semibold text-base text-foreground">
							6. How we protect your data
						</h2>
						<p className="mt-3">
							We use appropriate technical and organisational
							measures to help protect your personal data from
							accidental loss, misuse, or unauthorised access.
							However, no system can be guaranteed to be
							completely secure, and we cannot promise absolute
							security.
						</p>
					</section>

					{/* 7. Data retention */}
					<section>
						<h2 className="font-semibold text-base text-foreground">
							7. How long we keep your data
						</h2>
						<p className="mt-3">
							We retain your data only for as long as necessary
							for the purposes described in this policy,
							including:
						</p>
						<ul className="mt-3 list-disc space-y-1 pl-5">
							<li>
								To stay in contact about ongoing or future
								projects
							</li>
							<li>To maintain business and financial records</li>
							<li>
								To comply with legal or regulatory requirements
							</li>
						</ul>
						<p className="mt-3">
							When data is no longer needed, we will delete or
							anonymise it where reasonably possible.
						</p>
					</section>

					{/* 8. Your rights */}
					<section>
						<h2 className="font-semibold text-base text-foreground">
							8. Your rights
						</h2>
						<p className="mt-3">
							Depending on where you live and the laws that apply,
							you may have rights over your personal data, such
							as:
						</p>
						<ul className="mt-3 list-disc space-y-1 pl-5">
							<li>
								Access to the personal data we hold about you
							</li>
							<li>Correction of inaccurate or incomplete data</li>
							<li>
								Deletion of your data in certain circumstances
							</li>
							<li>
								Restriction or objection to certain types of
								processing
							</li>
							<li>
								Portability of your data to another service
								provider where technically feasible
							</li>
						</ul>
						<p className="mt-3">
							If you wish to exercise any of these rights, please
							contact us using the details below. We may need to
							verify your identity before responding.
						</p>
					</section>

					{/* 9. Cookies and analytics */}
					<section>
						<h2 className="font-semibold text-base text-foreground">
							9. Cookies and analytics
						</h2>
						<p className="mt-3">
							Our website may use cookies and similar technologies
							to understand how it is used, improve performance,
							and tailor content. You can usually control cookies
							through your browser settings. Some features may not
							function properly if cookies are disabled.
						</p>
					</section>

					{/* 10. Third-party websites */}
					<section>
						<h2 className="font-semibold text-base text-foreground">
							10. Third-party websites
						</h2>
						<p className="mt-3">
							Our website may contain links to other sites or
							services that we do not operate. We are not
							responsible for the content, security, or privacy
							practices of these third-party sites. We recommend
							that you review their privacy policies before
							sharing personal data.
						</p>
					</section>

					{/* 11. Changes to this policy */}
					<section>
						<h2 className="font-semibold text-base text-foreground">
							11. Changes to this policy
						</h2>
						<p className="mt-3">
							We may update this Privacy Policy from time to time
							to reflect changes in our practices, partnerships,
							or legal obligations. When we do, we will update the
							&quot;Last updated&quot; date at the top of this
							page. Your continued use of the website after
							changes are published means you accept the updated
							policy.
						</p>
					</section>

					{/* 12. Contact */}
					<section>
						<h2 className="font-semibold text-base text-foreground">
							12. Contact
						</h2>
						<p className="mt-3">
							If you have any questions about this Privacy Policy
							or how we use your data, you can contact us at:
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
