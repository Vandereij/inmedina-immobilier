// app/(site)/properties/page.tsx
import Link from "next/link";
import { createClient } from "@/lib/supabase-server";

export const revalidate = 60;

export default async function PropertiesPage({
	searchParams,
}: {
	searchParams: Promise<Record<string, string | string[]>>;
}) {
	const params = await searchParams;
	const pageParam = Array.isArray(params.page) ? params.page[0] : params.page;
	const page = Number(pageParam || 1);

	const pageSize = 12;
	const from = (page - 1) * pageSize;
	const to = from + pageSize - 1;

	const supabase = createClient();
	let query = supabase
		.from("properties")
		.select(
			"id,title,slug,price,currency,bedrooms,bathrooms,cover_image_url,locations(name)",
			{ count: "exact" }
		)
		.eq("status", "published")
		.order("created_at", { ascending: false })
		.range(from, to);

	const property_type = Array.isArray(params.property_type)
		? params.property_type[0]
		: params.property_type;
	const location = Array.isArray(params.location)
		? params.location[0]
		: params.location;
	const q = Array.isArray(params.q) ? params.q[0] : params.q;

	if (property_type) query = query.eq("property_type", property_type);
	if (location) query = query.eq("location_id", location);
	if (q) query = query.contains("amenities", [q]);

	const { data, count } = await query;
	const totalPages = Math.max(1, Math.ceil((count || 0) / pageSize));

	return (
		<section className="grid gap-6">
			<div className="flex justify-center">
				<div className="w-10/12">
					<h1 className="text-2xl font-semibold">Properties</h1>
					<div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
						{data?.map((p: any) => (
							<Link
								key={p.id}
								href={`/properties/${p.slug}`}
								className="border rounded-2xl overflow-hidden"
							>
								<img
									src={
										p.cover_image_url ||
										"https://images.unsplash.com/photo-1560448204-e02f11c3d0e2"
									}
									alt=""
									className="w-full h-48 object-cover"
								/>
								<div className="p-3">
									<div className="font-medium">{p.title}</div>
									<div className="text-sm">
										{p.currency}{" "}
										{Number(p.price).toLocaleString()}
									</div>
								</div>
							</Link>
						))}
					</div>
					<div className="flex gap-2">
						{Array.from({ length: totalPages }).map((_, i) => (
							<Link
								key={i}
								href={`/properties?page=${i + 1}`}
								className={`px-3 py-1 border rounded-xl ${
									page === i + 1 ? "bg-gray-100" : ""
								}`}
							>
								{i + 1}
							</Link>
						))}
					</div>
				</div>
			</div>
		</section>
	);
}
