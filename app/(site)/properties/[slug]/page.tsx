import { createClient } from "@/lib/supabase-server";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

// --- Helper Icon Component ---
const CheckIcon = ({ className }: { className?: string }) => (
	<svg
		className={className}
		xmlns="http://www.w3.org/2000/svg"
		fill="none"
		viewBox="0 0 24 24"
		strokeWidth={1.5}
		stroke="currentColor"
	>
		<path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
	</svg>
);

type Props = {
	params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: property, error } = await supabase
    .from("properties")
    .select("title, seo_description, status")
    .eq("slug", slug)
    .maybeSingle();

  if (error || !property || property.status !== "published") {
    return { title: "Property Not Found" };
  }

  return {
    title: property.title,
    description: property.seo_description || `View details for ${property.title}`,
  };
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
	const agent = {
		name: "John Appleseed",
		title: "Lead Real Estate Agent",
		imageUrl: "https://via.placeholder.com/100", // Placeholder image
	};

	const amenities = {
		interior: ["Hardwood Floors", "High Ceilings", "Fireplace", "Modern Kitchen"],
		exterior: ["Private Garden", "Patio/Deck", "Two-Car Garage"],
		community: ["Gated Community", "Shared Pool", "Fitness Center"],
	};

	const floorPlanUrl = "https://via.placeholder.com/800x600.png?text=Floor+Plan"; // Placeholder
	const virtualTourUrl = "https://www.youtube.com/embed/dQw4w9WgXcQ"; // Placeholder
	const neighborhoodInfo = {
		title: "A Vibrant and Welcoming Community",
		description: "<p>Located in a serene and sought-after neighborhood, this property offers the perfect blend of peaceful living and urban convenience. Enjoy easy access to top-rated schools, lush green parks, and a variety of boutique shops and gourmet restaurants. The community is known for its friendly atmosphere and beautifully maintained public spaces, making it an ideal place to call home.</p>",
	};
	// A real implementation would use property.latitude, property.longitude
	const mapEmbedUrl = `https://maps.google.com/maps?q=51.5074,-0.1278&hl=es;z=14&amp;output=embed`; 

	return (
		<article className="bg-white">
			<div className="container mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
				{/* --- Cover Image --- */}
				<div className="mb-12">
					<img
						src={property.cover_image_url}
						alt={property.title}
						className="w-full h-[550px] object-cover rounded-lg"
					/>
				</div>

				<div className="lg:grid lg:grid-cols-3 lg:gap-12">
					{/* --- Main Content Column --- */}
					<div className="lg:col-span-2">
						{/* Header */}
						<header className="mb-10">
							<h1 className="text-4xl font-light tracking-tight text-gray-800 mb-4">
								{property.title}
							</h1>
						</header>

						{/* Details Grid */}
						<div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-left border-t border-b border-gray-200 py-8 mb-12">
							<div>
								<strong className="block text-sm font-normal text-gray-500 mb-1">Price</strong>
								<div className="text-xl font-medium text-gray-800">
									{property.currency || "$"}{" "}
									{Number(property.price).toLocaleString()}
								</div>
							</div>
							<div>
								<strong className="block text-sm font-normal text-gray-500 mb-1">Bedrooms</strong>
								<div className="text-xl font-medium text-gray-800">{property.bedrooms}</div>
							</div>
							<div>
								<strong className="block text-sm font-normal text-gray-500 mb-1">Bathrooms</strong>
								<div className="text-xl font-medium text-gray-800">{property.bathrooms}</div>
							</div>
							<div>
								<strong className="block text-sm font-normal text-gray-500 mb-1">Area</strong>
								<div className="text-xl font-medium text-gray-800">
									{property.area_sqft} sqft
								</div>
							</div>
						</div>

						{/* Description */}
						<section className="mb-12">
							<h2 className="text-2xl font-light text-gray-800 mb-4">Description</h2>
							<div
								className="prose prose-lg max-w-none font-light text-gray-600"
								dangerouslySetInnerHTML={{ __html: property.description }}
							/>
						</section>

						{/* Amenities */}
						<section className="mb-12">
							<h2 className="text-2xl font-light text-gray-800 mb-6">Amenities</h2>
							<div className="space-y-6">
								{Object.entries(amenities).map(([category, items]) => (
									<div key={category}>
										<h3 className="text-lg font-medium text-gray-700 mb-3 capitalize border-b border-gray-200 pb-2">{category}</h3>
										<div className="grid grid-cols-2 gap-x-6 gap-y-2">
											{items.map((item) => (
												<div key={item} className="flex items-center">
													<CheckIcon className="h-5 w-5 text-gray-400 mr-2 shrink-0" />
													<span className="text-gray-600 font-light">{item}</span>
												</div>
											))}
										</div>
									</div>
								))}
							</div>
						</section>

						{/* Floor Plan */}
						<section className="mb-12">
							<h2 className="text-2xl font-light text-gray-800 mb-6">Floor Plan</h2>
							<img src={floorPlanUrl} alt="Floor Plan" className="w-full rounded-md border border-gray-200" />
						</section>

						{/* Virtual Tour */}
						<section className="mb-12">
							<h2 className="text-2xl font-light text-gray-800 mb-6">Virtual Tour</h2>
							<div className="aspect-w-16 aspect-h-9">
								<iframe
									src={virtualTourUrl}
									frameBorder="0"
									allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
									allowFullScreen
									className="w-full h-full rounded-md"
								></iframe>
							</div>
						</section>
						
						{/* Gallery */}
						{property.gallery?.length ? (
							<section className="mb-12">
								<h2 className="text-2xl font-light text-gray-800 mb-6">Gallery</h2>
								<div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
									{property.gallery.map((img: any, i: number) => (
										<img key={i} src={img.url} alt={img.alt || `${property.title} - Image ${i + 1}`} className="w-full h-56 object-cover rounded" />
									))}
								</div>
							</section>
						) : null}

						{/* Neighborhood */}
						<section className="mb-12">
							<h2 className="text-2xl font-light text-gray-800 mb-4">{neighborhoodInfo.title}</h2>
							<div className="prose prose-lg max-w-none font-light text-gray-600" dangerouslySetInnerHTML={{ __html: neighborhoodInfo.description }} />
						</section>

						{/* Map */}
						<section>
							<h2 className="text-2xl font-light text-gray-800 mb-6">Location</h2>
							<div className="h-[400px] w-full">
								<iframe
									src={mapEmbedUrl}
									className="w-full h-full border-0 rounded-md"
									loading="lazy"
								></iframe>
							</div>
						</section>
					</div>

					{/* --- Sidebar / Agent Contact --- */}
					<aside className="lg:col-span-1 mt-12 lg:mt-0">
						<div className="sticky top-24">
							<div className="border border-gray-200 rounded-lg p-8 shadow-sm">
								<h3 className="text-xl font-medium text-gray-800 mb-6">Contact Agent</h3>
								<div className="flex items-center space-x-4 mb-6">
									<img src={agent.imageUrl} alt={agent.name} className="w-16 h-16 rounded-full object-cover" />
									<div>
										<div className="font-medium text-gray-800">{agent.name}</div>
										<div className="text-sm text-gray-500">{agent.title}</div>
									</div>
								</div>
								<button type="button" className="w-full bg-gray-800 text-white py-3 px-4 rounded-md hover:bg-gray-700 transition-colors duration-200 text-center font-medium">
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