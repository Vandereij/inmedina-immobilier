"use client";
import { supabaseServer } from "@/lib/supabase-client";
import { useState } from "react";

const supabase = supabaseServer();

export function ImageUploader({
	onUploaded,
}: {
	onUploaded: (url: string) => void;
}) {
	const [uploading, setUploading] = useState(false);
	async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
		const file = e.target.files?.[0];
		if (!file) return;
		setUploading(true);
		const filename = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
		const { data, error } = await supabase.storage
			.from("images")
			.upload(filename, file, { upsert: false });
		setUploading(false);
		if (error) return alert(error.message);
		const { data: pub } = supabase.storage
			.from("images")
			.getPublicUrl(data!.path);
		onUploaded(pub.publicUrl);
	}
	return (
		<label className="inline-flex items-center gap-2 cursor-pointer">
			<span className="text-sm">
				{uploading ? "Uploading…" : "Upload image"}
			</span>
			<input
				type="file"
				accept="image/*"
				onChange={handleFile}
				className="hidden"
			/>
		</label>
	);
}
