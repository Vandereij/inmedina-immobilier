import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

function mustEnv(name: string) {
	const v = process.env[name];
	if (!v) throw new Error(`Missing env: ${name}`);
	return v.trim(); // strip stray spaces/newlines
}

export async function POST(req: Request) {
	try {
		const SUPABASE_URL = mustEnv("NEXT_PUBLIC_SUPABASE_URL");
		const SERVICE_ROLE = mustEnv("SUPABASE_SERVICE_ROLE_KEY");

		// quick sanity checks
		if (
			!SUPABASE_URL.startsWith("https://") ||
			!SUPABASE_URL.includes(".supabase.co")
		) {
			throw new Error(
				"NEXT_PUBLIC_SUPABASE_URL looks wrong (must be https://<ref>.supabase.co)"
			);
		}
		if (SERVICE_ROLE.length < 50)
			throw new Error("Service role key looks too short.");

		const body = await req.json();

		// allowlist the fields you expect
		const allowed = [
			"title",
			"slug",
			"property_type",
			"availability_type",
			"price",
			"cover_image_url",
			"gallery",
			"description",
			"status",
			"seo_title",
			"seo_description",
			"seo_canonical_url",
			"seo_og_image",
			"location_id",
			"bedrooms",
			"bathrooms",
			"area_sqm",
			"area_sqft",
			"featured",
			"address_line1",
			"address_line2",
			"latitude",
			"longitude",
			"excerpt",
		];
		const payload: Record<string, any> = {};
		for (const k of allowed) if (k in body) payload[k] = body[k];

		const admin = createClient(SUPABASE_URL, SERVICE_ROLE);

		const { error, data } = await admin
			.from("properties")
			.insert(payload)
			.select("*");
		if (error) {
			return NextResponse.json(
				{ error: error.message, payload },
				{ status: 400 }
			);
		}
		return NextResponse.json({ ok: true, inserted: data }, { status: 200 });
	} catch (err: any) {
		// shows whether envs are actually present without leaking secrets
		return NextResponse.json(
			{
				error: err?.message ?? "Unknown error",
				urlOk: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
				keyLen: process.env.SUPABASE_SERVICE_ROLE_KEY
					? process.env.SUPABASE_SERVICE_ROLE_KEY.length
					: 0,
			},
			{ status: 500 }
		);
	}
}
