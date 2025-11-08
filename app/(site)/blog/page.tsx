import Link from "next/link";
import { createClient } from "@/lib/supabase-server";

export default async function BlogList() {
	const supabase = await createClient();
	const { data: posts } = await supabase
		.from("posts")
		.select("id,title,slug,excerpt,cover_image_url,created_at")
		.eq("status", "published")
		.order("created_at", { ascending: false });
	return (
		<section className="grid gap-6">
			<div className="flex justify-center">
				<div className="w-10/12">
					<h1 className="text-2xl font-semibold">Blog</h1>
					<div className="grid md:grid-cols-2 gap-4">
						{posts?.map((p: any) => (
							<Link
								key={p.id}
								href={`/blog/${p.slug}`}
								className="border rounded-2xl overflow-hidden"
							>
								<img
									src={
										p.cover_image_url ||
										"https://images.unsplash.com/photo-1492724441997-5dc865305da7"
									}
									alt=""
									className="w-full h-40 object-cover"
								/>
								<div className="p-3">
									<div className="font-medium">{p.title}</div>
									<p className="text-sm text-gray-600">
										{p.excerpt}
									</p>
								</div>
							</Link>
						))}
					</div>
				</div>
			</div>
		</section>
	);
}
