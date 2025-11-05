import Link from "next/link";
import { createClient } from "@/lib/supabase-server";
import {
	Card,
	CardHeader,
	CardContent,
	CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const revalidate = 60;

export default async function PropertiesPage({
	searchParams,
}: {
	searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
	const params = await searchParams;
	const page = Number(params.page || 1);
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

	if (params.property_type)
		query = query.eq("property_type", params.property_type);
	if (params.location) query = query.eq("location_id", params.location);
	if (params.q) query = query.contains("amenities", [params.q]);

	const { data, count } = await query;
	const totalPages = Math.max(1, Math.ceil((count || 0) / pageSize));

	return (
		<section className="flex flex-col gap-12">
			{/* 🏡 Hero Banner */}
			<div className="relative h-[400px] w-full overflow-hidden shadow-lg">
				<img
					src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1920&auto=format&fit=crop"
					alt="Luxury homes hero banner"
					className="absolute inset-0 w-full h-full object-cover"
				/>
				<div className="absolute inset-0 bg-linear-to-b from-black/50 to-black/70 flex items-center justify-center text-center px-6">
					<div className="max-w-2xl text-white space-y-4">
						<h1 className="text-4xl md:text-5xl font-semibold">
							Find Your Dream Property
						</h1>
						<p className="text-lg text-gray-200">
							Explore our curated listings of luxury homes, apartments, and
							villas for every lifestyle.
						</p>
						<div className="flex justify-center gap-4">
							<Button asChild size="lg" variant="secondary">
								<Link href="/properties">Browse Properties</Link>
							</Button>
							<Button asChild size="lg" variant="secondary">
								<Link href="/contact">Contact Agent</Link>
							</Button>
						</div>
					</div>
				</div>
			</div>

			{/* 🏠 Properties Grid */}
			<div className="flex justify-center">
				<div className="w-10/12 pb-16">
					<h2 className="text-2xl font-semibold mb-4">Available Properties</h2>
					<div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
						{data?.map((p: any) => (
							<Link key={p.id} href={`/properties/${p.slug}`}>
								<Card className="hover:shadow-md transition-shadow overflow-hidden rounded-2xl">
									<div className="relative">
										<img
											src={
												p.cover_image_url ||
												"https://images.unsplash.com/photo-1560448204-e02f11c3d0e2"
											}
											alt={p.title}
											className="w-full h-48 object-cover"
										/>
										<div className="absolute top-2 right-2">
											<Badge variant="secondary">
												{p.locations?.name || "Unknown"}
											</Badge>
										</div>
									</div>
									<CardHeader className="pb-2">
										<h3 className="font-semibold text-lg">{p.title}</h3>
									</CardHeader>
									<CardContent>
										<div className="text-sm text-muted-foreground">
											{p.bedrooms} bd • {p.bathrooms} ba
										</div>
										<div className="text-base font-medium mt-1">
											{p.currency} {Number(p.price).toLocaleString()}
										</div>
									</CardContent>
									<CardFooter>
										<Button variant="outline" className="w-full">
											View Details
										</Button>
									</CardFooter>
								</Card>
							</Link>
						))}
					</div>

					{/* Pagination */}
					<div className="flex gap-2 mt-6 justify-center">
						{Array.from({ length: totalPages }).map((_, i) => (
							<Link key={i} href={`/properties?page=${i + 1}`}>
								<Button
									variant={page === i + 1 ? "secondary" : "outline"}
									className="rounded-xl"
								>
									{i + 1}
								</Button>
							</Link>
						))}
					</div>
				</div>
			</div>
		</section>
	);
}
