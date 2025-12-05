"use client";

import { useState } from "react";
import { Mail } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "./ui/dialog";
import CIcon from "@coreui/icons-react";
import { cibWhatsapp } from "@coreui/icons";

type Status = "idle" | "loading" | "success" | "error";

export default function ContactCta() {
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterStatus, setNewsletterStatus] = useState<Status>("idle");
  const [newsletterMessage, setNewsletterMessage] = useState("");

  // enquiry modal state
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [enquiryName, setEnquiryName] = useState("");
  const [enquiryEmail, setEnquiryEmail] = useState("");
  const [enquiryMessage, setEnquiryMessage] = useState("");
  const [enquiryStatus, setEnquiryStatus] = useState<Status>("idle");
  const [enquiryFeedback, setEnquiryFeedback] = useState("");

  const handleNewsletterSubscribe = async () => {
    if (!newsletterEmail) {
      setNewsletterStatus("error");
      setNewsletterMessage("Please enter your email.");
      return;
    }

    setNewsletterStatus("loading");
    setNewsletterMessage("");

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: newsletterEmail }),
      });

      const data = await res.json();

      if (!res.ok || data?.error) {
        setNewsletterStatus("error");
        setNewsletterMessage(data?.error || "Something went wrong. Please try again.");
        return;
      }

      setNewsletterStatus("success");
      setNewsletterMessage(data?.message || "You’ve been subscribed!");
      setNewsletterEmail("");
    } catch (err) {
      console.error(err);
      setNewsletterStatus("error");
      setNewsletterMessage("Network error. Please try again.");
    }
  };

  const handleEnquirySubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    const res = await fetch("/api/enquiry", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: enquiryName,
        email: enquiryEmail,
        message: enquiryMessage,
      }),
    });

    console.log("Response status:", res.status);
    const data = await res.json().catch(() => null);
    console.log("Response data:", data);

    // ...your existing success/error handling...
  } catch (error) {
    console.error("Fetch threw:", error);
  }
};

  return (
    <section className="bg-[#f8f3ee]">
      <div className="mx-auto max-w-6xl px-4 py-20 text-center md:px-8">
        <h3 className="font-serif text-3xl md:text-4xl">
          Let's begin your journey
        </h3>
        <p className="mt-3 text-neutral-800">
          Reach out for a tailored property selection or renovation consultation.
        </p>

        <div className="mt-8 flex justify-center gap-3">
          {/* Email button opens modal */}
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="default" className="rounded-full">
                <Mail className="mr-2 h-4 w-4" /> Email
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Send us an enquiry</DialogTitle>
                <DialogDescription>
                  Tell us a bit about what you&apos;re looking for and we&apos;ll get back to you.
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleEnquirySubmit} className="space-y-4">
                <div className="text-left space-y-2">
                  <label className="text-sm font-medium">Name (optional)</label>
                  <Input
                    placeholder="Your name"
                    value={enquiryName}
                    onChange={(e) => setEnquiryName(e.target.value)}
                    className="bg-[#f8f3ee]/80"
                  />
                </div>
                <div className="text-left space-y-2">
                  <label className="text-sm font-medium">Email</label>
                  <Input
                    type="email"
                    placeholder="you@domain.com"
                    value={enquiryEmail}
                    onChange={(e) => setEnquiryEmail(e.target.value)}
                    className="bg-[#f8f3ee]/80"
                    required
                  />
                </div>
                <div className="text-left space-y-2">
                  <label className="text-sm font-medium">Message</label>
                  <Textarea
                    placeholder="Tell us about your property needs or renovation ideas..."
                    value={enquiryMessage}
                    onChange={(e) => setEnquiryMessage(e.target.value)}
                    className="bg-[#f8f3ee]/80 min-h-[120px]"
                    required
                  />
                </div>

                {enquiryFeedback && (
                  <p
                    className={`text-sm ${
                      enquiryStatus === "error" ? "text-red-600" : "text-green-700"
                    }`}
                  >
                    {enquiryFeedback}
                  </p>
                )}

                <DialogFooter className="mt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-[#c98a5a] text-white hover:bg-[#b37750]"
                    disabled={enquiryStatus === "loading"}
                  >
                    {enquiryStatus === "loading" ? "Sending..." : "Send enquiry"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>

          {/* WhatsApp button unchanged */}
          <Button variant="default" className="rounded-full">
            <CIcon className="fill-accent-foreground" icon={cibWhatsapp} /> Chat
          </Button>
        </div>

        <p className="mt-8 max-w-8/12 md:max-w-5/12 mx-auto text-neutral-800">
          Or you can join our newsletter to receive updates about our properties and services.
        </p>

        <div className="mt-6 flex flex-col items-center gap-3 md:flex-row md:justify-center">
          <Input
            placeholder="you@domain.com"
            className="max-w-xs bg-[#f8f3ee]/80"
            type="email"
            value={newsletterEmail}
            onChange={(e) => setNewsletterEmail(e.target.value)}
          />
          <Button
            className="bg-[#c98a5a] text-white hover:bg-[#b37750]"
            onClick={handleNewsletterSubscribe}
            disabled={newsletterStatus === "loading"}
          >
            {newsletterStatus === "loading" ? "Subscribing..." : "Subscribe"}
          </Button>
        </div>

        {newsletterMessage && (
          <p
            className={`mt-3 text-sm ${
              newsletterStatus === "error" ? "text-red-600" : "text-green-700"
            }`}
          >
            {newsletterMessage}
          </p>
        )}
      </div>
    </section>
  );
}
