import { NextResponse } from "next/server";

export async function POST(req: Request) {
	const secret = req.headers.get("x-revalidate-secret");
	if (secret !== process.env.REVALIDATE_SECRET)
		return NextResponse.json({ ok: false }, { status: 401 });
	// In Next.js App Router on Netlify, pages are revalidated via next-intl. Here we can no-op or integrate Netlify revalidate API if needed.
	return NextResponse.json({ revalidated: true });
}
