// components/image-uploader.tsx
"use client";
import { useState } from "react";
import { Loader2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
	onUploaded: (url: string) => void; // Called for each uploaded image
	onAllUploaded?: (urls: string[]) => void; // Called when all images are uploaded
	bucket?: string;
	prefix?: string;
	accept?: string;
	multiple?: boolean; // NEW: Enable multiple file selection
	maxFiles?: number; // NEW: Optional limit on number of files
};

export function ImageUploader({
	onUploaded,
	onAllUploaded,
	bucket = "images",
	prefix = "",
	accept = "image/*",
	multiple = false,
	maxFiles,
}: Props) {
	const [uploading, setUploading] = useState(false);
	const [progress, setProgress] = useState<{ current: number; total: number } | null>(null);

	async function uploadSingleFile(file: File): Promise<string> {
		const safeName = file.name.replace(/\s+/g, "-");
		const objectPath = `${prefix}${Date.now()}-${Math.random().toString(36).substring(7)}-${safeName}`;

		// 1) Get signed upload URL
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
			throw new Error(`Failed to get signed URL (${res.status}). ${t}`);
		}

		const { signedUrl, publicUrl, readUrl, path } = await res.json() as {
			signedUrl: string;
			publicUrl?: string | null;
			readUrl?: string | null;
			path: string;
		};

		// 2) Upload to storage
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

		return publicUrl ?? readUrl ?? path;
	}

	async function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
		const input = e.currentTarget;
		const files = Array.from(input.files || []);
		
		if (files.length === 0) return;

		// Check max files limit
		if (maxFiles && files.length > maxFiles) {
			alert(`You can only upload up to ${maxFiles} images at once.`);
			input.value = "";
			return;
		}

		setUploading(true);
		setProgress({ current: 0, total: files.length });

		const uploadedUrls: string[] = [];
		const errors: string[] = [];

		// Upload files sequentially to avoid overwhelming the server
		for (let i = 0; i < files.length; i++) {
			try {
				const url = await uploadSingleFile(files[i]);
				uploadedUrls.push(url);
				onUploaded(url); // Notify parent for each upload
				setProgress({ current: i + 1, total: files.length });
			} catch (err: any) {
				console.error(`Failed to upload ${files[i].name}:`, err);
				errors.push(`${files[i].name}: ${err?.message || "Unknown error"}`);
			}
		}

		// Notify parent when all uploads complete
		if (onAllUploaded && uploadedUrls.length > 0) {
			onAllUploaded(uploadedUrls);
		}

		// Show errors if any
		if (errors.length > 0) {
			alert(`Some uploads failed:\n\n${errors.join("\n")}`);
		}

		setUploading(false);
		setProgress(null);
		input.value = ""; // Allow re-selecting files
	}

	return (
		<div className="space-y-2">
			<Button
				type="button"
				variant="outline"
				disabled={uploading}
				asChild
				className="w-full"
			>
				<label className="cursor-pointer">
					{uploading ? (
						<>
							<Loader2 className="mr-2 h-4 w-4 animate-spin" />
							Uploading {progress?.current} of {progress?.total}...
						</>
					) : (
						<>
							<Upload className="mr-2 h-4 w-4" />
							{multiple ? "Upload Images" : "Upload Image"}
						</>
					)}
					<input
						type="file"
						accept={accept}
						multiple={multiple}
						onChange={handleFiles}
						className="hidden"
						disabled={uploading}
					/>
				</label>
			</Button>
			
			{uploading && progress && (
				<div className="w-full bg-gray-200 rounded-full h-2">
					<div
						className="bg-blue-600 h-2 rounded-full transition-all duration-300"
						style={{ width: `${(progress.current / progress.total) * 100}%` }}
					/>
				</div>
			)}
		</div>
	);
}