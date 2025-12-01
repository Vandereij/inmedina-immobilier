import Link from "next/link";
import { createClient } from "@/lib/supabase-server";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";
import {
	LucideBath,
	LucideBedDouble,
	LucideMapPin,
	LucideRulerDimensionLine,
} from "lucide-react";

export const dynamic = "force-dynamic";
type SearchParams = { [key: string]: string | string[] | undefined };

export default async function PropertiesPage({
	searchParams,
}: {
	searchParams: SearchParams;
}) {
	const params = await searchParams;
	const page = Number(params.page || 1);
	const pageSize = 12;
	const from = (page - 1) * pageSize;
	const to = from + pageSize - 1;

	const supabase = await createClient();

	const [{ data: userRes }, { data: isAdmin }] = await Promise.all([
		supabase.auth.getUser(),
		supabase.rpc("is_admin"),
	]);

	const user = userRes?.user ?? null;
	if (!user) redirect("/sign-in");
	if (!isAdmin) redirect("/");

	// Base query — now selecting status and explicitly including both statuses
	let query = supabase
		.from("properties")
		.select(
			"id,title,slug,price,currency,bedrooms,bathrooms,cover_image_url,property_type,address_line1,area_sqm,availability_type,status,locations(name)",
			{ count: "exact" }
		)
		.order("created_at", { ascending: false })
		.in("status", ["draft", "published"])
		.range(from, to);

	// Filter by availability type (e.g., sale, rent)
	if (params.availability_type) {
		query = query.eq("availability_type", params.availability_type);
	}

	// Filter by location ID (URL param is 'locationId', DB column is 'location_id')
	if (params.locationId) {
		query = query.eq("location_id", params.locationId);
	}

	// Filter by property type (e.g., house, apartment, villa)
	if (params.property_type) {
		query = query.eq("property_type", params.property_type);
	}

	// Filter by price range (between min and max)
	// Support both camelCase and snake_case
	const minPrice = params.minPrice || params.min_price;
	const maxPrice = params.maxPrice || params.max_price;

	if (minPrice && maxPrice) {
		query = query
			.gte("price", Number(minPrice))
			.lte("price", Number(maxPrice));
	} else if (minPrice) {
		query = query.gte("price", Number(minPrice));
	} else if (maxPrice) {
		query = query.lte("price", Number(maxPrice));
	}

	// Filter by number of bedrooms
	if (params.bedrooms && params.bedrooms !== "any") {
		query = query.eq("bedrooms", Number(params.bedrooms));
	}

	// Filter by number of bathrooms
	if (params.bathrooms && params.bathrooms !== "any") {
		query = query.eq("bathrooms", Number(params.bathrooms));
	}

	// Search in amenities
	if (params.q) {
		query = query.contains("amenities", [params.q]);
	}

	const { data, count, error } = await query;
	if (error) {
		// Fail soft with empty list if needed
		console.error("Properties query error:", error);
	}
	const totalPages = Math.max(1, Math.ceil((count || 0) / pageSize));

	return (
		<section className="flex flex-col gap-20">
			<div className="relative h-[500px] w-full overflow-hidden shadow-lg">
				<img
					src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1920&auto=format&fit=crop"
					alt="Luxury homes hero banner"
					className="absolute inset-0 w-full h-full object-cover"
				/>
				<div className="absolute inset-0 bg-linear-to-b from-black/65 to-black/85 flex items-center justify-center text-center px-6">
					<div className="max-w-2xl text-white space-y-4">
						<h1 className="text-xl md:text-2xl font-medium">
							Discover Exceptional Moroccan Properties
						</h1>
						<p className="text-gray-200">
							From traditional riads to contemporary villas,
							explore our curated collection of properties across
							Morocco. Each listing reflects our commitment to
							quality, authenticity, and prime locations.
						</p>
					</div>
				</div>
			</div>

			{/* 🏠 Properties List (Strips) */}
			<div className="flex justify-center">
				<div className="w-8/12 pb-16">
					<h2 className="text-xl md:text-2xl mb-10">
						All Properties
					</h2>

					{/* Strips instead of cards */}
					<div className="flex flex-col gap-4">
						{data?.map((p: any) => (
							<Link
								key={p.id}
								href={`/admin/properties/${p.id}`}
								className="block"
							>
								<div className="flex flex-col sm:flex-row gap-4 border rounded-xl p-4 hover:bg-muted transition-colors">
									{/* Image block */}
									<div className="relative w-full sm:w-64 h-52 sm:h-40 flex-shrink-0 overflow-hidden rounded-lg">
										<img
											src={
												p.cover_image_url ||
												"https://images.unsplash.com/photo-1560448204-e02f11c3d0e2"
											}
											alt={p.title}
											className="w-full h-full object-cover"
										/>
										<div className="absolute top-3 left-3 flex gap-2">
											{/* Status badge (draft/published) */}
											<Badge
												className="bg-[oklch(0.7_0_0/.50)] text-background uppercase text-xs rounded-md"
												variant={
													p.status === "published"
														? "default"
														: "secondary"
												}
											>
												{p.status}
											</Badge>
											{/* Location badge */}
											<Badge
												variant="secondary"
												className="bg-[oklch(0.7_0_0/.50)] text-background uppercase text-xs rounded-md"
											>
												{p.locations?.name ||
													"Unknown"}
											</Badge>
										</div>
									</div>

									{/* Content block */}
									<div className="flex flex-1 flex-col justify-between gap-2">
										<div>
											<div className="flex items-start justify-between gap-2">
												<h3 className="font-semibold line-clamp-2">
													{p.title}
												</h3>
												<div className="text-sm font-semibold whitespace-nowrap">
													{p.currency}{" "}
													{Number(
														p.price
													).toLocaleString()}
												</div>
											</div>

											<div className="mt-1 text-xs uppercase text-muted-foreground flex flex-wrap gap-2">
												{p.property_type && (
													<span>
														{p.property_type}
													</span>
												)}
												{p.availability_type && (
													<span>
														• {p.availability_type}
													</span>
												)}
											</div>
										</div>

										<div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
											{p.bedrooms && (
												<div className="flex items-center gap-1">
													<LucideBedDouble className="size-4" />
													<span>{p.bedrooms}</span>
												</div>
											)}
											{p.bathrooms && (
												<div className="flex items-center gap-1">
													<LucideBath className="size-4" />
													<span>{p.bathrooms}</span>
												</div>
											)}
											{p.area_sqm && (
												<div className="flex items-center gap-1">
													<LucideRulerDimensionLine className="size-4" />
													<span>
														{p.area_sqm + "m\u00B2"}
													</span>
												</div>
											)}
										</div>

										<div className="mt-3 flex items-center text-sm text-muted-foreground">
											<LucideMapPin className="size-4 mr-1" />
											<span className="line-clamp-1">
												{p.address_line1}
											</span>
										</div>
									</div>
								</div>
							</Link>
						))}
					</div>

					{/* Pagination */}
					<div className="flex gap-2 mt-6 justify-center">
						{Array.from({ length: totalPages }).map((_, i) => (
							<Link key={i} href={`/properties?page=${i + 1}`}>
								<Button
									variant={
										page === i + 1 ? "secondary" : "outline"
									}
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
