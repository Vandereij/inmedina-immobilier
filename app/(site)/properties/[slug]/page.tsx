import { createClient } from "@/lib/supabase-server";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

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
	const { slug } = await params; // 👈 unwrap the Promise
	const supabase = await createClient();
	
	const { data: property } = await supabase
		.from("properties")
		.select("*")
		.eq("slug", slug)
		.maybeSingle();

	if (!property || property.status !== "published") return notFound();

	return (
		<article className="py-12">
			<div className="container mx-auto max-w-10/12 px-4">
				{/* Cover Image */}
				<img
					src={property.cover_image_url}
					alt={property.title}
					className="w-full h-[480px] object-cover rounded-2xl shadow-lg mb-8"
				/>

				{/* Header Section */}
				<div className="mb-8">
					<h1 className="text-4xl font-bold tracking-tight text-gray-900 mb-2">
						{property.title}
					</h1>

					{/* Details Grid */}
					<div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm border-y py-4 my-4">
						<div>
							<strong className="block text-gray-500">Price</strong>
							<div className="text-lg font-semibold">
								{property.currency || "$"}{" "}
								{Number(property.price).toLocaleString()}
							</div>
						</div>
						<div>
							<strong className="block text-gray-500">Bedrooms</strong>
							<div className="text-lg font-semibold">{property.bedrooms}</div>
						</div>
						<div>
							<strong className="block text-gray-500">Bathrooms</strong>
							<div className="text-lg font-semibold">{property.bathrooms}</div>
						</div>
						<div>
							<strong className="block text-gray-500">Area</strong>
							<div className="text-lg font-semibold">
								{property.area_sqft} sqft
							</div>
						</div>
					</div>
				</div>

				{/* Description Section */}
				<section className="mb-12">
					<h2 className="text-2xl font-bold mb-4 border-b pb-2">
						Description
					</h2>
					<div
						className="prose prose-lg max-w-none"
						dangerouslySetInnerHTML={{ __html: property.description }}
					/>
				</section>

				{/* Gallery Section */}
				{property.gallery?.length ? (
					<section>
						<h2 className="text-2xl font-bold mb-4 border-b pb-2">Gallery</h2>
						<div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
							{property.gallery.map((img: any, i: number) => (
								<img
									key={i}
									src={img.url}
									alt={img.alt || `${property.title} - Image ${i + 1}`}
									className="w-full h-56 object-cover rounded-xl"
								/>
							))}
						</div>
					</section>
				) : null}
			</div>
		</article>
	);
}
