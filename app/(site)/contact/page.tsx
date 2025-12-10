"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import CIcon from "@coreui/icons-react";
import { cibWhatsapp } from "@coreui/icons";

type Status = "idle" | "loading" | "success" | "error";

export default function ContactPage() {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [phone, setPhone] = useState("");
	const [enquiryType, setEnquiryType] = useState("sale");
	const [message, setMessage] = useState("");

	const [status, setStatus] = useState<Status>("idle");
	const [feedback, setFeedback] = useState("");

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!email || !message) {
			setStatus("error");
			setFeedback(
				"Please provide at least your email and a short message."
			);
			return;
		}

		setStatus("loading");
		setFeedback("");

		try {
			const res = await fetch("/api/enquiry", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					name,
					email,
					phone,
					enquiryType,
					message,
				}),
			});

			const data = await res.json();

			if (!res.ok || data?.error) {
				setStatus("error");
				setFeedback(
					data?.error || "Failed to send enquiry. Please try again."
				);
				return;
			}

			setStatus("success");
			setFeedback(
				data?.message ||
					"Your enquiry has been sent. We’ll be in touch soon."
			);

			setName("");
			setEmail("");
			setPhone("");
			setEnquiryType("sale");
			setMessage("");
		} catch (err) {
			console.error(err);
			setStatus("error");
			setFeedback("Network error. Please try again.");
		}
	};

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

					{/* Content with same style as Services section */}
					<div className="relative mx-auto flex h-full max-w-7xl items-center px-4 py-20 md:px-8">
						<div className="max-w-3xl text-white">
							<p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">
								Contact
							</p>
							<h1 className="mt-4 max-w-3xl font-serif text-4xl md:text-5xl">
								Start a conversation about your Moroccan
								property
							</h1>
							<p className="mt-6 max-w-2xl text-base leading-relaxed">
								Whether you&apos;re exploring a first purchase,
								looking for a long-term rental, or planning a
								careful restoration, we&apos;re based on the
								ground in Morocco and can guide you through each
								step with clear, practical advice.
							</p>

							<div className="mt-8 flex flex-wrap gap-3 text-sm">
								<div className="flex items-center gap-2">
									<Mail className="h-4 w-4 text-primary" />
									<span>
										Prefer email? Use the form below.
									</span>
								</div>
								<div className="flex items-center gap-2">
									<MessageCircle className="h-4 w-4 text-primary" />
									<span>
										Or reach out via WhatsApp for quicker
										questions.
									</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Main contact section with form */}
			<section className="bg-muted/50">
				<div className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:grid md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] md:gap-16">
					{/* Left: explanatory content */}
					<div className="mb-10 md:mb-0">
						<h2 className="font-serif text-2xl md:text-3xl">
							Tell us what you&apos;re looking for in Morocco
						</h2>
						<p className="mt-4 text-base leading-relaxed text-muted-foreground">
							Working with property in Morocco is as much about
							understanding local rhythms and regulations as it is
							about architecture. Share a little about your plans
							and we&apos;ll respond with honest, grounded
							feedback, not a generic sales pitch.
						</p>
						<p className="mt-4 text-base leading-relaxed text-muted-foreground">
							We regularly support:
						</p>
						<ul className="mt-3 space-y-2 text-sm leading-relaxed text-muted-foreground">
							<li>
								&bull; Buyers searching for a riad, village
								house, or contemporary home.
							</li>
							<li>
								&bull; Clients looking for long-term rentals
								with reliable management.
							</li>
							<li>
								&bull; Owners planning restorations or upgrades
								to existing properties.
							</li>
							<li>
								&bull; Investors wanting a clear picture of
								what&apos;s realistic on the ground.
							</li>
						</ul>

						<div className="mt-8 space-y-3 text-sm text-muted-foreground">
							<div className="flex items-start gap-2">
								<MapPin className="mt-0.5 h-4 w-4 text-primary" />
								<p>
									We work on site across Morocco, with a
									particular focus on historic medinas and
									carefully chosen rural or coastal locations.
								</p>
							</div>
							<div className="flex flex-wrap items-center gap-3">
								<Button
									asChild
									variant="outline"
									className="rounded-full"
								>
									<a
										href="https://wa.me/0000000000"
										target="_blank"
										rel="noreferrer"
									>
										<CIcon
											className="mr-2 h-4 w-4"
											icon={cibWhatsapp}
										/>
										Chat on WhatsApp
									</a>
								</Button>
								<p className="text-xs text-muted-foreground">
									(Replace the number with your WhatsApp
									contact.)
								</p>
							</div>
						</div>
					</div>

					{/* Right: form */}
					<div className="rounded-2xl border border-border bg-background p-6 shadow-sm md:p-8">
						<h2 className="font-serif text-xl md:text-2xl">
							Send us an enquiry
						</h2>
						<p className="mt-2 text-sm leading-relaxed text-muted-foreground">
							Share a few details and we&apos;ll reply within a
							reasonable timeframe with next steps, clarifying
							questions, or a suggested way forward.
						</p>

						<form
							onSubmit={handleSubmit}
							className="mt-6 space-y-4"
						>
							<div className="space-y-2 text-left">
								<label
									className="text-sm font-medium"
									htmlFor="name"
								>
									Name
								</label>
								<Input
									id="name"
									placeholder="Your full name"
									value={name}
									onChange={(e) => setName(e.target.value)}
									className="bg-muted/80"
								/>
							</div>

							<div className="space-y-2 text-left">
								<label
									className="text-sm font-medium"
									htmlFor="email"
								>
									Email *
								</label>
								<Input
									id="email"
									type="email"
									placeholder="you@domain.com"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									className="bg-muted/80"
									required
								/>
							</div>

							<div className="space-y-2 text-left">
								<label
									className="text-sm font-medium"
									htmlFor="phone"
								>
									Phone / WhatsApp
								</label>
								<Input
									id="phone"
									type="tel"
									placeholder="+212 ..."
									value={phone}
									onChange={(e) => setPhone(e.target.value)}
									className="bg-muted/80"
								/>
							</div>

							<div className="space-y-2 text-left">
								<label
									className="text-sm font-medium"
									htmlFor="enquiry-type"
								>
									Enquiry type
								</label>
								<select
									id="enquiry-type"
									value={enquiryType}
									onChange={(e) =>
										setEnquiryType(e.target.value)
									}
									className="w-full rounded-md border border-input bg-muted/80 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/60"
								>
									<option value="sale">
										Property purchase / sale
									</option>
									<option value="rent">Long-term rent</option>
									<option value="restoration">
										Restoration / renovation
									</option>
									<option value="other">
										Other enquiries
									</option>
								</select>
							</div>

							<div className="space-y-2 text-left">
								<label
									className="text-sm font-medium"
									htmlFor="message"
								>
									Message *
								</label>
								<Textarea
									id="message"
									placeholder="Tell us about your plans, preferred locations, budget range, and any timelines you already have in mind..."
									value={message}
									onChange={(e) => setMessage(e.target.value)}
									className="bg-muted/80 min-h-[140px]"
									required
								/>
							</div>

							{feedback && (
								<p
									className={`text-sm ${
										status === "error"
											? "text-red-600"
											: "text-green-700"
									}`}
								>
									{feedback}
								</p>
							)}

							<Button
								type="submit"
								className="mt-2 w-full bg-[#c98a5a] text-white hover:bg-[#b37750]"
								disabled={status === "loading"}
							>
								{status === "loading"
									? "Sending your enquiry..."
									: "Send enquiry"}
							</Button>

							<p className="mt-2 text-xs text-muted-foreground">
								By sending this form you&apos;re simply starting
								a conversation. We&apos;ll never pressure you
								into a decision, and your details stay between
								us and our trusted collaborators on the ground.
							</p>
						</form>
					</div>
				</div>
			</section>
		</>
	);
}
