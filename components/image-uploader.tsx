// components/image-uploader.tsx
"use client";
import { useState } from "react";

type Props = {
	onUploaded: (url: string) => void; // you’ll get a public URL if bucket is public, otherwise a signed read URL
	bucket?: string; // default "images"
	prefix?: string; // e.g. "properties/"
	accept?: string; // default "image/*"
};

export function ImageUploader({
	onUploaded,
	bucket = "images",
	prefix = "",
	accept = "image/*",
}: Props) {
	const [uploading, setUploading] = useState(false);

	async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
		const input = e.currentTarget; // ← store a stable reference
		const file = input.files?.[0];
		if (!file) return;

		setUploading(true);

		try {
			const safeName = file.name.replace(/\s+/g, "-");
			const objectPath = `${prefix}${Date.now()}-${safeName}`;

			// 1) ask server for signed upload URL
			const res = await fetch("/api/storage/signed-upload", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					bucket,
					path: objectPath,
					contentType: file.type || "application/octet-stream",
				}),
			});

			if (!res.ok) {
				const t = await res.text().catch(() => "");
				throw new Error(
					`Failed to get signed URL (${res.status}). ${t}`
				);
			}

			const { signedUrl, publicUrl, readUrl, path } =
				(await res.json()) as {
					signedUrl: string;
					publicUrl?: string | null;
					readUrl?: string | null;
					path: string;
				};

			// 2) upload directly to storage
			const put = await fetch(signedUrl, {
				method: "PUT",
				headers: {
					"Content-Type": file.type || "application/octet-stream",
				},
				body: file,
			});
			if (!put.ok) {
				const t = await put.text().catch(() => "");
				throw new Error(`Upload failed (${put.status}). ${t}`);
			}

			// 3) notify parent
			const url = publicUrl ?? readUrl ?? path;
			onUploaded(url);
		} catch (err: any) {
			console.error("Upload error:", err);
			alert(err?.message || "Upload failed");
		} finally {
			setUploading(false);
			// allow re-selecting the same file
			if (input) input.value = ""; // ← safe reset
		}
	}

	return (
		<label className="inline-flex items-center gap-2 cursor-pointer">
			<span className="text-sm">
				{uploading ? "Uploading…" : "Upload image"}
			</span>
			<input
				type="file"
				accept={accept}
				onChange={handleFile}
				className="hidden"
				disabled={uploading}
			/>
		</label>
	);
}
