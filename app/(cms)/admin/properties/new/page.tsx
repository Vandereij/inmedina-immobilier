"use client";
import { useState } from "react";
import { supabaseServer } from "@/lib/supabase-client";
import { slugify } from "@/lib/slugify";
import RichEditor from "@/components/editor";
import { ImageUploader } from "@/components/image-uploader";
import { SeoFields } from "@/components/seo-fields";

export default function NewProperty() {
	const [title, setTitle] = useState("");
	const [slug, setSlug] = useState("");
	const [availability, setAvailability] = useState("for_sale");
	const [price, setPrice] = useState(0);
	const [cover, setCover] = useState("");
	const [gallery, setGallery] = useState<string[]>([]);
	const [desc, setDesc] = useState<any>("");
	const [seo, setSeo] = useState<any>({});
	const supabase = supabaseServer();

	async function save() {
		const finalSlug = slug || slugify(title);
		const { error } = await supabase.from("properties").insert({
			title,
			slug: finalSlug,
			availability,
			price,
			cover_image_url: cover,
			gallery: gallery.map((u) => ({ url: u })),
			description: desc,
			status: "draft",
			...seo,
		});
		if (error) alert(error.message);
		else window.location.href = "/admin/properties";
	}

	return (
		<div className="grid gap-4">
			<h1 className="text-xl font-semibold">New Property</h1>
			<div className="grid md:grid-cols-2 gap-4">
				<div className="grid gap-3">
					<input
						className="border rounded-xl p-2"
						placeholder="Title"
						value={title}
						onChange={(e) => {
							setTitle(e.target.value);
							setSlug(slugify(e.target.value));
						}}
					/>
					<input
						className="border rounded-xl p-2"
						placeholder="Slug"
						value={slug}
						onChange={(e) => setSlug(slugify(e.target.value))}
					/>
					<select
						className="border rounded-xl p-2"
						value={availability}
						onChange={(e) => setAvailability(e.target.value)}
					>
						<option value="for_sale">For sale</option>
						<option value="for_rent">For rent</option>
					</select>
					<input
						type="number"
						className="border rounded-xl p-2"
						placeholder="Price"
						value={price}
						onChange={(e) => setPrice(Number(e.target.value))}
					/>
					<label className="grid gap-2">
						<span className="text-sm">Cover image</span>
						{cover ? (
							<img
								src={cover}
								alt="cover"
								className="w-full h-40 object-cover rounded-xl"
							/>
						) : null}
						<ImageUploader onUploaded={(u) => setCover(u)} />
					</label>
					<label className="grid gap-2">
						<span className="text-sm">Gallery</span>
						<div className="grid grid-cols-3 gap-2">
							{gallery.map((u, i) => (
								<img
									key={i}
									src={u}
									className="w-full h-24 object-cover rounded"
								/>
							))}
						</div>
						<ImageUploader
							onUploaded={(u) => setGallery((g) => [...g, u])}
						/>
					</label>
				</div>
				<div className="grid gap-3">
					<span className="text-sm">Description</span>
					<RichEditor value={desc} onChange={setDesc} />
					<span className="text-sm">SEO</span>
					<SeoFields value={seo} onChange={setSeo} />
					<button onClick={save} className="border rounded-xl p-2">
						Save
					</button>
				</div>
			</div>
		</div>
	);
}
