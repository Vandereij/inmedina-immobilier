import Link from "next/link";
import { createClient } from "@/lib/supabase-server";
import { Button } from "@/components/ui/button";
import { Metadata } from "next";
import PropertyCardList from "@/components/property-card-list";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
	return {
		title: "",
		description: "",
	};
}

export default async function PropertiesPage({
	searchParams,
}: {
	searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
	const rawParams = await searchParams;

	// Helper to always get a single string
	const getParam = (value: string | string[] | undefined) =>
		Array.isArray(value) ? value[0] : value;

	const params = {
		page: getParam(rawParams.page),
		availability_type: getParam(rawParams.availability_type),
		featured: getParam(rawParams.featured),
		locationId: getParam(rawParams.locationId),
		property_type: getParam(rawParams.property_type),
		minPrice: getParam(rawParams.minPrice || rawParams.min_price),
		maxPrice: getParam(rawParams.maxPrice || rawParams.max_price),
		bedrooms: getParam(rawParams.bedrooms),
		bathrooms: getParam(rawParams.bathrooms),
		q: getParam(rawParams.q),
	};

	const page = Number(params.page || 1);
	const pageSize = 12;
	const from = (page - 1) * pageSize;
	const to = from + pageSize - 1;

	const supabase = await createClient();

	let query = supabase
		.from("properties")
		.select(
			`
      id,
      title,
      slug,
      price,
      currency,
      bedrooms,
      bathrooms,
      cover_image_url,
      property_type,
      address_line1,
      area_sqm,
      availability_type,
      locations ( name )
    `,
			{ count: "exact" }
		)
		.eq("status", "published")
		.order("created_at", { ascending: false })
		.range(from, to);

	// 🔹 Availability type (sale, rent...)
	if (params.availability_type) {
		query = query.eq("availability_type", params.availability_type);
	}

	// 🔹 Featured (URL gives "true"/"false" as string)
	if (params.featured === "true") {
		query = query.eq("featured", true);
	} else if (params.featured === "false") {
		query = query.eq("featured", false);
	}

	// 🔹 Location (ID)
	if (params.locationId) {
		query = query.eq("location_id", params.locationId);
	}

	// 🔹 Property type
	if (params.property_type) {
		query = query.eq("property_type", params.property_type);
	}

	// 🔹 Price range
	if (params.minPrice && params.maxPrice) {
		query = query
			.gte("price", Number(params.minPrice))
			.lte("price", Number(params.maxPrice));
	} else if (params.minPrice) {
		query = query.gte("price", Number(params.minPrice));
	} else if (params.maxPrice) {
		query = query.lte("price", Number(params.maxPrice));
	}

	// 🔹 Bedrooms
	if (params.bedrooms && params.bedrooms !== "any") {
		query = query.eq("bedrooms", Number(params.bedrooms));
	}

	// 🔹 Bathrooms
	if (params.bathrooms && params.bathrooms !== "any") {
		query = query.eq("bathrooms", Number(params.bathrooms));
	}

	// 🔹 Amenities search
	if (params.q) {
		query = query.contains("amenities", [params.q]);
	}

	const { data, count, error } = await query;

	if (error) {
		console.error("Error loading properties:", error);
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
						<div className="flex justify-center gap-4 mt-8">
							<Button asChild size="sm" variant="secondary">
								<Link href="/contact">Contact Us</Link>
							</Button>
						</div>
					</div>
				</div>
			</div>

			{/* 🏠 Properties Grid */}
			<div className="flex justify-center">
				<div className="m-auto max-w-7xl px-4 md:px-8 pb-16">
					<h2 className="text-xl md:text-2xl mb-10">
						Available Properties {count !== null && `(${count})`}
					</h2>

					<PropertyCardList parentData={data ?? []} />

					{/* No Results Message */}
					{data?.length === 0 && (
						<div className="text-center py-12">
							<p className="text-muted-foreground text-lg">
								No properties found matching your criteria.
							</p>
							<Button asChild variant="outline" className="mt-4">
								<Link href="/properties">Clear Filters</Link>
							</Button>
						</div>
					)}

					{/* Pagination */}
					{totalPages > 1 && (
						<div className="flex gap-2 mt-6 justify-center">
							{Array.from({ length: totalPages }).map((_, i) => {
								const paginationParams = new URLSearchParams();

								Object.entries(rawParams).forEach(
									([key, value]) => {
										if (key !== "page" && value) {
											const v = Array.isArray(value)
												? value[0]
												: value;
											paginationParams.set(
												key,
												String(v)
											);
										}
									}
								);

								paginationParams.set("page", String(i + 1));

								return (
									<Link
										key={i}
										href={`/properties?${paginationParams.toString()}`}
									>
										<Button
											variant={
												page === i + 1
													? "secondary"
													: "outline"
											}
											className="rounded-xl"
										>
											{i + 1}
										</Button>
									</Link>
								);
							})}
						</div>
					)}
				</div>
			</div>
		</section>
	);
}
