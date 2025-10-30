"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabaseServer } from "@/lib/supabase-client";
import { slugify } from "@/lib/slugify";
import RichEditor from "@/components/editor";
import { ImageUploader } from "@/components/image-uploader";
import { SeoFields } from "@/components/seo-fields";

export default function EditProperty() {
	const { id } = useParams();
	const [loading, setLoading] = useState(true);
	const [model, setModel] = useState<any>({});
	const supabase = supabaseServer();

	useEffect(() => {
		(async () => {
			const { data } = await supabase
				.from("properties")
				.select("*")
				.eq("id", id)
				.single();
			setModel(data || {});
			setLoading(false);
		})();
	}, [id]);

	async function save(status?: "draft" | "published") {
		const payload = {
			...model,
			slug: slugify(model.slug || model.title),
			status: status || model.status,
		};
		const { error } = await supabase
			.from("properties")
			.update(payload)
			.eq("id", id);
		if (error) alert(error.message);
		else window.location.href = "/admin/properties";
	}

	if (loading) return <p>Loading…</p>;
	return (
		<div className="grid gap-4">
			<h1 className="text-xl font-semibold">Edit Property</h1>
			<div className="grid md:grid-cols-2 gap-4">
				<div className="grid gap-3">
					<input
						className="border rounded-xl p-2"
						placeholder="Title"
						value={model.title || ""}
						onChange={(e) =>
							setModel({ ...model, title: e.target.value })
						}
					/>
					<input
						className="border rounded-xl p-2"
						placeholder="Slug"
						value={model.slug || ""}
						onChange={(e) =>
							setModel({
								...model,
								slug: slugify(e.target.value),
							})
						}
					/>
					<select
						className="border rounded-xl p-2"
						value={model.availability || "for_sale"}
						onChange={(e) =>
							setModel({ ...model, availability: e.target.value })
						}
					>
						<option value="for_sale">For sale</option>
						<option value="for_rent">For rent</option>
					</select>
					<input
						type="number"
						className="border rounded-xl p-2"
						placeholder="Price"
						value={model.price || 0}
						onChange={(e) =>
							setModel({
								...model,
								price: Number(e.target.value),
							})
						}
					/>
					<label className="grid gap-2">
						<span className="text-sm">Cover image</span>
						{model.cover_image_url ? (
							<img
								src={model.cover_image_url}
								className="w-full h-40 object-cover rounded-xl"
							/>
						) : null}
						<ImageUploader
							onUploaded={(u) =>
								setModel({ ...model, cover_image_url: u })
							}
						/>
					</label>
					<label className="grid gap-2">
						<span className="text-sm">Gallery</span>
						<div className="grid grid-cols-3 gap-2">
							{(model.gallery || []).map((g: any, i: number) => (
								<img
									key={i}
									src={g.url}
									className="w-full h-24 object-cover rounded"
								/>
							))}
						</div>
						<ImageUploader
							onUploaded={(u) =>
								setModel({
									...model,
									gallery: [
										...(model.gallery || []),
										{ url: u },
									],
								})
							}
						/>
					</label>
				</div>
				<div className="grid gap-3">
					<span className="text-sm">Description</span>
					<RichEditor
						value={model.description}
						onChange={(v) => setModel({ ...model, description: v })}
					/>
					<span className="text-sm">SEO</span>
					<SeoFields
						value={model}
						onChange={(v) => setModel({ ...model, ...v })}
					/>
				</div>
			</div>
		</div>
	);
}
