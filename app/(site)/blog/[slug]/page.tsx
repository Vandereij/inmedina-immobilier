import { createClient } from "@/lib/supabase-server";
import { notFound } from "next/navigation";

export default async function PostPage({
	params,
}: {
	params: { slug: string };
}) {
	const supabase = createClient();
	const { data: post } = await supabase
		.from("posts")
		.select("*")
		.eq("slug", params.slug)
		.single();
	if (!post || post.status !== "published") return notFound();
	return (
		<article className="prose max-w-none">
			<div className="flex justify-center">
				<div className="w-10/12">
					<img
						src={post.cover_image_url || ""}
						alt=""
						className="w-full max-h-[380px] object-cover rounded-2xl"
					/>
					<h1>{post.title}</h1>
					<p className="text-gray-600">{post.excerpt}</p>
					<pre className="whitespace-pre-wrap text-sm bg-gray-50 p-3 rounded-xl">
						{JSON.stringify(post.content, null, 2)}
					</pre>
				</div>
			</div>
		</article>
	);
}
