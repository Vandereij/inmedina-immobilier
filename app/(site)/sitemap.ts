import { createClient } from "@/lib/supabase-server";

export default async function sitemap() {
	const supabase = createClient();
	const base = process.env.SITE_URL?.replace(/\/$/, "") || "";
	const routes = ["", "/properties", "/blog"].map((p) => ({
		url: `${base}${p || "/"}`,
		lastModified: new Date(),
	}));
	const { data: props } = await supabase
		.from("properties")
		.select("slug,updated_at")
		.eq("status", "published");
	const { data: posts } = await supabase
		.from("posts")
		.select("slug,updated_at")
		.eq("status", "published");
	return [
		...routes,
		...(props || []).map((p: any) => ({
			url: `${base}/properties/${p.slug}`,
			lastModified: p.updated_at,
		})),
		...(posts || []).map((p: any) => ({
			url: `${base}/blog/${p.slug}`,
			lastModified: p.updated_at,
		})),
	];
}
