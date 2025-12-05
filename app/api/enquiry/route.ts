// app/api/enquiry/route.ts
import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const { name, email, message } = await req.json();

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

    const toEmail = process.env.ENQUIRY_TO_EMAIL; // your email
    if (!toEmail) {
      console.error("Missing ENQUIRY_TO_EMAIL");
      return NextResponse.json(
        { error: "Server misconfigured." },
        { status: 500 }
      );
    }

    const displayName = name && typeof name === "string" ? name : "Website visitor";

    const { error } = await resend.emails.send({
      from: "Enquiries <enquiries@yourdomain.com>", // must be a verified domain in Resend
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
      console.error("Resend error:", error);
      return NextResponse.json(
        { error: "Failed to send enquiry. Please try again later." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { ok: true, message: "Your enquiry has been sent. We'll be in touch soon." },
      { status: 200 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Unexpected server error." },
      { status: 500 }
    );
  }
}
