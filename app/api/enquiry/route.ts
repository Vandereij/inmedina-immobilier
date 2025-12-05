// app/api/enquiry/route.ts
import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const isDev = process.env.NODE_ENV !== "production";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log("[/api/enquiry] Incoming body:", body);

    const { name, email, message } = body;

    // Basic validation
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

    console.log("[/api/enquiry] Sending email via Resend…");

    const { error } = await resend.emails.send({
      from: "Enquiries <info@inmedina.com>", // must use a verified domain in Resend
      to: [toEmail],
      replyTo: email,
      subject: `New enquiry from ${displayName}`,
      html: `
        <div style="font-family: system-ui, -apple-system, BlinkMacSystemFont, sans-serif; line-height: 1.6;">
          <h2>New enquiry from your website</h2>
          <p><strong>Name:</strong> ${displayName}</p>
          <p><strong>Email:</strong> ${email}</p>
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
