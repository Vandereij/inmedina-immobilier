import { createClient } from "@/lib/supabase-server";
import { notFound } from "next/navigation";

export const revalidate = 300;

export default async function PropertyDetail({
	params,
}: {
	params: { slug: string };
}) {
	const supabase = createClient();
	const { data: property } = await supabase
		.from("properties")
		.select("*")
		.eq("slug", params.slug)
		.single();
	if (!property || property.status !== "published") return notFound();
	return (
		<article className="grid gap-6">
			<div className="flex justify-center">
				<div className="w-10/12">
					<img
						src={property.cover_image_url}
						alt="Cover"
						className="w-full max-h-[480px] object-cover rounded-2xl"
					/>
					<h1 className="text-3xl font-bold">{property.title}</h1>
					<div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
						<div>
							<strong>Price</strong>
							<div>
								{property.currency}{" "}
								{Number(property.price).toLocaleString()}
							</div>
						</div>
						<div>
							<strong>Bedrooms</strong>
							<div>{property.bedrooms}</div>
						</div>
						<div>
							<strong>Bathrooms</strong>
							<div>{property.bathrooms}</div>
						</div>
						<div>
							<strong>Area</strong>
							<div>{property.area_sqft} sqft</div>
						</div>
					</div>
					{property.gallery?.length ? (
						<div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
							{property.gallery.map((img: any, i: number) => (
								<img
									key={i}
									src={img.url}
									alt={img.alt || ""}
									className="w-full h-56 object-cover rounded-xl"
								/>
							))}
						</div>
					) : null}
					<section>
						<h2 className="text-xl font-semibold mb-2">
							Description
						</h2>
						{/* Render TipTap JSON as HTML on server: keep simple here */}
						<pre className="whitespace-pre-wrap text-sm bg-gray-50 p-3 rounded-xl">
							{JSON.stringify(property.description, null, 2)}
						</pre>
					</section>
				</div>
			</div>
		</article>
	);
}
