import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { error: "Valid email is required" },
        { status: 400 }
      );
    }

    const apiKey = process.env.MAILCHIMP_API_KEY;
    const listId = process.env.MAILCHIMP_LIST_ID;
    const dc = process.env.MAILCHIMP_DC; // e.g. "us21"

    if (!apiKey || !listId || !dc) {
      console.error("Missing Mailchimp env vars");
      return NextResponse.json(
        { error: "Server misconfigured" },
        { status: 500 }
      );
    }

    const url = `https://${dc}.api.mailchimp.com/3.0/lists/${listId}/members`;

    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `anystring ${apiKey}`, // Mailchimp expects this style
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email_address: email,
        status: "subscribed", // use "pending" for double opt-in
      }),
    });

    const data = await res.json();

    // Handle “already subscribed” gracefully
    if (res.status === 400 && data?.title === "Member Exists") {
      return NextResponse.json(
        { ok: true, message: "You’re already subscribed 🎉" },
        { status: 200 }
      );
    }

    if (!res.ok) {
      console.error("Mailchimp error:", data);
      return NextResponse.json(
        { error: data?.detail || "Failed to subscribe" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { ok: true, message: "You’ve been subscribed! 🎉" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Unexpected server error" },
      { status: 500 }
    );
  }
}
