// app/api/enquiry/route.ts
import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const isDev = process.env.NODE_ENV !== "production";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log("[/api/enquiry] Incoming body:", body);

    const {
      name,
      email,
      message,
      phone,
      enquiryType, // new
      source,      // optional: e.g. "contact-page", "property-card"
    } = body;

    // Basic validation (keep the same so old callers still work)
    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { error: "A valid email is required." },
        { status: 400 }
      );
    }

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Please include a message." },
        { status: 400 }
      );
    }

    const toEmail = process.env.ENQUIRY_TO_EMAIL;
    const resendKey = process.env.RESEND_API_KEY;

    console.log("[/api/enquiry] Env check:", {
      hasEnquiryToEmail: !!toEmail,
      hasResendKey: !!resendKey,
    });

    if (!toEmail || !resendKey) {
      return NextResponse.json(
        {
          error: "Server misconfigured.",
          ...(isDev && {
            details: "Missing one of: ENQUIRY_TO_EMAIL, RESEND_API_KEY",
          }),
        },
        { status: 500 }
      );
    }

    const displayName =
      name && typeof name === "string" ? name : "Website visitor";

    // Optional: human-friendly label for enquiry type
    const enquiryTypeLabel = (() => {
      if (!enquiryType || typeof enquiryType !== "string") return "Not specified";
      const map: Record<string, string> = {
        sale: "Property purchase / sale",
        rent: "Long-term rent",
        restoration: "Restoration / renovation",
        other: "Other enquiry",
      };
      return map[enquiryType] ?? enquiryType;
    })();

    const subjectParts = [
      "New enquiry",
      source === "contact-page" ? "via Contact page" : null,
      enquiryType ? `(${enquiryTypeLabel})` : null,
      `from ${displayName}`,
    ].filter(Boolean);

    const subject = subjectParts.join(" ");

    console.log("[/api/enquiry] Sending email via Resend…");

    const { error } = await resend.emails.send({
      from: "Enquiries <info@inmedina.com>", // must use a verified domain in Resend
      to: [toEmail],
      replyTo: email,
      subject,
      html: `
        <div style="font-family: system-ui, -apple-system, BlinkMacSystemFont, sans-serif; line-height: 1.6;">
          <h2>New enquiry from your website</h2>

          <p><strong>Name:</strong> ${displayName}</p>
          <p><strong>Email:</strong> ${email}</p>

          ${
            phone
              ? `<p><strong>Phone / WhatsApp:</strong> ${phone}</p>`
              : ""
          }

          ${
            enquiryType
              ? `<p><strong>Enquiry type:</strong> ${enquiryTypeLabel}</p>`
              : ""
          }

          ${
            source
              ? `<p><strong>Source:</strong> ${source}</p>`
              : ""
          }

          <hr style="margin: 20px 0; border: none; border-top: 1px solid #ddd;" />

          <p><strong>Message:</strong></p>
          <p>${message.replace(/\n/g, "<br/>")}</p>
        </div>
      `,
    });

    if (error) {
      console.error("[/api/enquiry] Resend error:", error);
      return NextResponse.json(
        {
          error: "Failed to send enquiry. Please try again later.",
          ...(isDev && { details: JSON.stringify(error) }),
        },
        { status: 500 }
      );
    }

    console.log("[/api/enquiry] Email sent successfully");

    return NextResponse.json(
      {
        ok: true,
        message: "Your enquiry has been sent. We'll be in touch soon.",
      },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("[/api/enquiry] Uncaught error:", err);

    return NextResponse.json(
      {
        error: "Unexpected server error.",
        ...(isDev && { details: String(err?.message || err) }),
      },
      { status: 500 }
    );
  }
}
