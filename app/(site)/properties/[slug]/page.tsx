import { createClient } from "@/lib/supabase-server";
import { notFound } from "next/navigation";
import { formatLabel } from "@/lib/amenities-template";
import type { Metadata } from "next";
import { Check } from "lucide-react";
import { PropertyGallery } from "@/components/property-gallery";
import Image from "next/image";
import nmlogo from "../../../../public/nmlogo.png";

type Props = {
	params: Promise<{ slug: string }>;
};

import { buildMetadata } from "@/lib/seo";

export async function generateMetadata({
	params,
}: {
	params: Promise<{ slug: string }>;
}): Promise<Metadata> {
	const { slug } = await params;
	const supabase = await createClient();

	const { data: property, error } = await supabase
		.from("properties")
		.select(
			"title, excerpt, seo_title, seo_description, seo_canonical, seo_robots, status"
		)
		.eq("slug", slug)
		.maybeSingle();

	if (error) {
		console.error("[generateMetadata] Supabase error:", error);
	}

	/** Fallback metadata if property is missing */
	const fallback: Metadata = {
		title: "Property not found | Real Estate InMedina",
		description:
			"Explore carefully selected properties across Morocco with Real Estate InMedina.",
		robots: {
			index: false,
			follow: false,
		},
	};

	if (!property) {
		return fallback;
	}

	const defaults: Metadata = {
		title: `Property ${property.title} | Real Estate InMedina`,
		description: property.excerpt ?? undefined,
	};

	return buildMetadata(property, defaults);
}

export default async function PropertyDetail({ params }: Props) {
	const { slug } = await params;
	const supabase = await createClient();

	const { data: property } = await supabase
		.from("properties")
		.select("*")
		.eq("slug", slug)
		.maybeSingle();

	if (!property || property.status !== "published") return notFound();

	// --- Placeholder Data for New Sections ---
	const inmedina = {
		title: "InMedina Team is here to respond to all your enquiries. Don't esitate to contact us via the form or WhatsApp",
	};

	const floorPlanUrl = property.floor_plan_image_url; // Placeholder
	const virtualTourUrl = "https://www.youtube.com/embed/dQw4w9WgXcQ"; // Placeholder

	// Generate map embed URL from property coordinates
	const mapEmbedUrl =
		property.latitude && property.longitude
			? `https://maps.google.com/maps?q=${property.latitude},${property.longitude}&hl=en;z=15&amp;output=embed`
			: null;

	function getAmenitiesFromProperty(propertyAmenities: any) {
		if (!propertyAmenities || typeof propertyAmenities !== "object") {
			return {};
		}

		// Handle if amenities is stored as an array
		const amenitiesData = Array.isArray(propertyAmenities)
			? propertyAmenities[0]
			: propertyAmenities;

		const transformed: Record<string, string[]> = {};

		Object.entries(amenitiesData).forEach(([category, items]) => {
			if (typeof items === "object" && items !== null) {
				// Only include active amenities
				const activeAmenities = Object.entries(items)
					.filter(([_, value]) => {
						if (typeof value === "boolean") return value === true;
						if (typeof value === "number") return value > 0;
						return false;
					})
					.map(([key, value]) => {
						const label = formatLabel(key);
						if (typeof value === "number" && value > 1) {
							return `${label} (${value})`;
						}
						return label;
					});

				if (activeAmenities.length > 0) {
					transformed[formatLabel(category)] = activeAmenities;
				}
			}
		});

		return transformed;
	}
	return (
		<article className="bg-white">
			{/* --- Cover Image --- */}
			<header className="relative min-h-[300px] w-full overflow-hidden shadow-lg">
				<img
					src={property.cover_image_url}
					alt={`${property.title} hero banner`}
					className="absolute inset-0 w-full h-full object-cover"
				/>
				<div className="absolute inset-0 bg-linear-to-b from-black/65 to-black/85 flex items-center justify-center text-center px-6">
					<div className="max-w-2xl text-white space-y-4 p-8">
						<h1 className="text-xl md:text-2xl font-medium">
							{property.title}
						</h1>
						<p className="text-gray-200">{property.excerpt}</p>
					</div>
				</div>
			</header>
			<div className="container mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
				<div className="lg:grid lg:grid-cols-3 lg:gap-12">
					{/* --- Main Content Column --- */}
					<div className="lg:col-span-2">
						{/* Details Grid */}
						<div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-left border-t border-b border-gray-200 py-8 mb-12">
							<div>
								<strong className="block text-sm font-normal text-gray-500 mb-1">
									Price
								</strong>
								<div className="text-xl font-medium text-gray-800">
									{property.currency || "$"}{" "}
									{Number(property.price).toLocaleString()}
								</div>
							</div>
							<div>
								<strong className="block text-sm font-normal text-gray-500 mb-1">
									Bedrooms
								</strong>
								<div className="text-xl font-medium text-gray-800">
									{property.bedrooms}
								</div>
							</div>
							<div>
								<strong className="block text-sm font-normal text-gray-500 mb-1">
									Bathrooms
								</strong>
								<div className="text-xl font-medium text-gray-800">
									{property.bathrooms}
								</div>
							</div>
							<div>
								<strong className="block text-sm font-normal text-gray-500 mb-1">
									Area
								</strong>
								<div className="text-xl font-medium text-gray-800">
									{property.area_sqft} sqft
								</div>
							</div>
						</div>

						{/* Description */}
						<section className="mb-12">
							<h2 className="text-2xl font-light text-gray-800 mb-4">
								Description
							</h2>
							<div
								className="prose prose-lg max-w-none font-light text-gray-600"
								dangerouslySetInnerHTML={{
									__html: property.description,
								}}
							/>
						</section>

						{/* Amenities */}
						{(() => {
							const amenities = getAmenitiesFromProperty(
								property.amenities
							);
							const hasAmenities =
								Object.keys(amenities).length > 0;

							if (!hasAmenities) return null;

							return (
								<section className="mb-12">
									<h2 className="text-2xl font-light text-gray-800 mb-6">
										Amenities
									</h2>
									<div className="space-y-6">
										{Object.entries(amenities).map(
											([category, items]) => (
												<div key={category}>
													<h3 className="text-lg font-medium text-gray-700 mb-3 capitalize border-b border-gray-200 pb-2">
														{category}
													</h3>
													<div className="grid grid-cols-2 gap-x-6 gap-y-2">
														{items.map((item) => (
															<div
																key={item}
																className="flex items-center"
															>
																<Check className="h-5 w-5 text-gray-400 mr-2 shrink-0" />
																<span className="text-gray-600 font-light">
																	{item}
																</span>
															</div>
														))}
													</div>
												</div>
											)
										)}
									</div>
								</section>
							);
						})()}

						{/* Floor Plan */}
						{floorPlanUrl && (
							<section className="mb-12">
								<h2 className="text-2xl font-light text-gray-800 mb-6">
									Floor Plan
								</h2>
								<img
									src={floorPlanUrl}
									alt="Floor Plan"
									className="w-full aspect-3/1 object-contain rounded-md border border-gray-200 bg-gray-50"
								/>
							</section>
						)}

						{/* Virtual Tour */}
						{/* <section className="mb-12">
							<h2 className="text-2xl font-light text-gray-800 mb-6">
								Virtual Tour
							</h2>
							<div className="aspect-w-16 aspect-h-9">
								<iframe
									src={virtualTourUrl}
									frameBorder="0"
									allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
									allowFullScreen
									className="w-full h-full rounded-md"
								></iframe>
							</div>
						</section> */}

						{/* Gallery */}
						<PropertyGallery
							images={property.gallery || []}
							propertyTitle={property.title}
						/>

						{/* Map */}
						{mapEmbedUrl && (
							<section>
								<h2 className="text-2xl font-light text-gray-800 mb-6">
									Location
								</h2>
								<div className="h-[400px] w-full">
									<iframe
										src={mapEmbedUrl}
										className="w-full h-full border-0 rounded-md"
										loading="lazy"
										title="Property location map"
									></iframe>
								</div>
							</section>
						)}
					</div>

					{/* --- Sidebar / Agent Contact --- */}
					<aside className="lg:col-span-1 mt-12 lg:mt-0">
						<div className="sticky top-24">
							<div className="border border-gray-200 rounded-lg p-8 shadow-sm">
								<h3 className="text-xl font-medium text-gray-800 mb-6">
									Contact for more information
								</h3>
								<div className="flex items-center space-x-4 mb-6">
									<Image
										alt="InMedina Logo"
										src={nmlogo}
										width={70}
										height={70}
									/>
									<div>
										<div className="text-sm text-gray-500">
											{inmedina.title}
										</div>
									</div>
								</div>
								<button
									type="button"
									className="w-full bg-gray-800 text-white py-3 px-4 rounded-md hover:bg-gray-700 transition-colors duration-200 text-center font-medium"
								>
									Schedule a Viewing
								</button>
							</div>
						</div>
					</aside>
				</div>
			</div>
		</article>
	);
}
