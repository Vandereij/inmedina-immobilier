
"use client";

import { useState, useMemo, useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import { createClient } from "@/lib/supabase-client";
import { slugify } from "@/lib/slugify";
import { ImageUploader } from "@/components/image-uploader";
import { SeoFields } from "@/components/seo-fields";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
	AlertCircle,
	Loader2,
	X,
	Bold,
	Italic,
	Underline as UnderlineIcon,
	List,
	ListOrdered,
	AlignLeft,
	AlignCenter,
	AlignRight,
	Link2,
	Image as ImageIcon,
	Undo,
	Redo,
} from "lucide-react";

// Tiptap Toolbar Component
function TiptapToolbar({ editor }: { editor: any }) {
	if (!editor) return null;

	const addLink = () => {
		const url = window.prompt("Enter URL:");
		if (url) {
			editor.chain().focus().setLink({ href: url }).run();
		}
	};

	const addImage = () => {
		const url = window.prompt("Enter image URL:");
		if (url) {
			editor.chain().focus().setImage({ src: url }).run();
		}
	};

	return (
		<div className="border border-b-0 rounded-t-lg p-2 flex flex-wrap gap-1 bg-gray-50">
			<Button
				type="button"
				variant={editor.isActive("bold") ? "secondary" : "ghost"}
				size="sm"
				onClick={() => editor.chain().focus().toggleBold().run()}
			>
				<Bold className="h-4 w-4" />
			</Button>
			<Button
				type="button"
				variant={editor.isActive("italic") ? "secondary" : "ghost"}
				size="sm"
				onClick={() => editor.chain().focus().toggleItalic().run()}
			>
				<Italic className="h-4 w-4" />
			</Button>
			<Button
				type="button"
				variant={editor.isActive("underline") ? "secondary" : "ghost"}
				size="sm"
				onClick={() => editor.chain().focus().toggleUnderline().run()}
			>
				<UnderlineIcon className="h-4 w-4" />
			</Button>

			<div className="w-px h-8 bg-gray-300 mx-1" />

			<Button
				type="button"
				variant={editor.isActive("bulletList") ? "secondary" : "ghost"}
				size="sm"
				onClick={() => editor.chain().focus().toggleBulletList().run()}
			>
				<List className="h-4 w-4" />
			</Button>
			<Button
				type="button"
				variant={editor.isActive("orderedList") ? "secondary" : "ghost"}
				size="sm"
				onClick={() => editor.chain().focus().toggleOrderedList().run()}
			>
				<ListOrdered className="h-4 w-4" />
			</Button>

			<div className="w-px h-8 bg-gray-300 mx-1" />

			<Button
				type="button"
				variant={
					editor.isActive({ textAlign: "left" })
						? "secondary"
						: "ghost"
				}
				size="sm"
				onClick={() =>
					editor.chain().focus().setTextAlign("left").run()
				}
			>
				<AlignLeft className="h-4 w-4" />
			</Button>
			<Button
				type="button"
				variant={
					editor.isActive({ textAlign: "center" })
						? "secondary"
						: "ghost"
				}
				size="sm"
				onClick={() =>
					editor.chain().focus().setTextAlign("center").run()
				}
			>
				<AlignCenter className="h-4 w-4" />
			</Button>
			<Button
				type="button"
				variant={
					editor.isActive({ textAlign: "right" })
						? "secondary"
						: "ghost"
				}
				size="sm"
				onClick={() =>
					editor.chain().focus().setTextAlign("right").run()
				}
			>
				<AlignRight className="h-4 w-4" />
			</Button>

			<div className="w-px h-8 bg-gray-300 mx-1" />

			<Button type="button" variant="ghost" size="sm" onClick={addLink}>
				<Link2 className="h-4 w-4" />
			</Button>
			<Button type="button" variant="ghost" size="sm" onClick={addImage}>
				<ImageIcon className="h-4 w-4" />
			</Button>

			<div className="w-px h-8 bg-gray-300 mx-1" />

			<Button
				type="button"
				variant="ghost"
				size="sm"
				onClick={() => editor.chain().focus().undo().run()}
				disabled={!editor.can().undo()}
			>
				<Undo className="h-4 w-4" />
			</Button>
			<Button
				type="button"
				variant="ghost"
				size="sm"
				onClick={() => editor.chain().focus().redo().run()}
				disabled={!editor.can().redo()}
			>
				<Redo className="h-4 w-4" />
			</Button>
		</div>
	);
}

export default function NewPropertyForm() {
	// Create client-side Supabase client with auth
	const supabase = useMemo(
		() =>
			createClient(),
		[]
	);

	// Debug: Check session on mount
	useEffect(() => {
		async function checkSession() {
			const {
				data: { session },
				error,
			} = await supabase.auth.getSession();
			console.log("Current session:", session);
			console.log("Session error:", error);
			if (!session) {
				console.warn("No active session found!");
			}
		}
		checkSession();
	}, [supabase]);

	const [title, setTitle] = useState("");
	const [slug, setSlug] = useState("");
	const [availabilityType, setAvailabilityType] = useState<"sale" | "rent">("sale");
	const [propertyType, setPropertyType] = useState<"riad" | "apartment">("riad");
	const [price, setPrice] = useState<string>("");
	const [cover, setCover] = useState("");
	const [gallery, setGallery] = useState<string[]>([]);
	const [seo, setSeo] = useState<any>({});
	const [saving, setSaving] = useState(false);
	const [errors, setErrors] = useState<Record<string, string>>({});

	// Initialize Tiptap editor
	const editor = useEditor({
		extensions: [
			StarterKit,
			Underline,
			TextAlign.configure({
				types: ["heading", "paragraph"],
			}),
			Link.configure({
				openOnClick: false,
			}),
			Image,
		],
		content: "",
		immediatelyRender: false,
		editorProps: {
			attributes: {
				class: "prose prose-sm max-w-none focus:outline-none min-h-[300px] p-4",
			},
		},
		onUpdate: ({ editor }) => {
			if (errors.description) {
				setErrors((prev) => ({ ...prev, description: "" }));
			}
		},
	});

	function validateForm() {
		const newErrors: Record<string, string> = {};

		if (!title.trim()) {
			newErrors.title = "Title is required";
		} else if (title.length < 3) {
			newErrors.title = "Title must be at least 3 characters";
		} else if (title.length > 200) {
			newErrors.title = "Title must not exceed 200 characters";
		}

		if (!slug.trim()) {
			newErrors.slug = "Slug is required";
		} else if (!/^[a-z0-9-]+$/.test(slug)) {
			newErrors.slug =
				"Slug can only contain lowercase letters, numbers, and hyphens";
		}

		if (!price || parseFloat(price) <= 0) {
			newErrors.price = "Price must be greater than 0";
		} else if (parseFloat(price) > 1000000000) {
			newErrors.price = "Price seems unreasonably high";
		}

		if (!cover) {
			newErrors.cover = "Cover image is required";
		}

		if (!editor || !editor.getText().trim()) {
			newErrors.description = "Description is required";
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	}

	async function save(nextStatus?: "draft" | "published") {
		const isDraft = nextStatus === "draft";

		// Only enforce full validation on Publish.
		if (!isDraft && !validateForm()) return;

		if (isDraft) {
			if (!title.trim()) {
				setErrors((p) => ({ ...p, title: "Title is required" }));
				return;
			}
			if (!slug.trim()) setSlug(slugify(title));
		}

		setSaving(true);
		try {
			const finalStatus: "draft" | "published" = nextStatus ?? "draft";
			const finalSlug = slug || slugify(title);

			const res = await fetch("/api/properties", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					title,
					slug: finalSlug,
					property_type: propertyType,
					availability_type: availabilityType,
					price: parseFloat(price || "0"),
					cover_image_url: cover,
					gallery: gallery.map((u) => ({ url: u })),
					description: editor?.getHTML() || "",
					status: finalStatus, // <- force status here
					seo_title: seo?.seo_title || "",
					seo_description: seo?.seo_description || "",
					seo_canonical: seo?.seo_canonical || "",
					seo_robots: seo?.seo_robots || "",
				}),
			});

			const json = await res.json().catch(() => ({}));
			if (!res.ok) {
				console.error(json);
				alert(json.error || "Insert failed");
				return;
			}

			window.location.href = "/admin/properties";
		} finally {
			setSaving(false);
		}
	}

	function removeGalleryImage(index: number) {
		setGallery((g) => g.filter((_, i) => i !== index));
	}

	return (
		<section className="min-h-screen bg-gray-50 py-8">
			<div className="container mx-auto max-w-6xl px-4">
				<div className="mb-6 flex items-end justify-between gap-4">
					<div>
						<h1 className="text-3xl font-bold tracking-tight">
							New Property
						</h1>
						<p className="text-muted-foreground mt-1">
							Create a new property listing for your portfolio
						</p>
					</div>
					<div className="flex gap-2">
						<Button
							type="button"
							variant="outline"
							onClick={() => save("draft")}
							disabled={saving}
						>
							{saving ? (
								<>
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
									Saving…
								</>
							) : (
								"Save Draft"
							)}
						</Button>
						<Button
							type="button"
							onClick={() => save("published")}
							disabled={saving}
						>
							{saving ? (
								<>
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
									Saving…
								</>
							) : (
								"Publish"
							)}
						</Button>
					</div>
				</div>

				<div className="grid gap-6 lg:grid-cols-2">
					{/* Left Column */}
					<div className="space-y-6">
						<Card>
							<CardHeader>
								<CardTitle>Basic Information</CardTitle>
								<CardDescription>
									Enter the core details about the property
								</CardDescription>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="space-y-2">
									<Label htmlFor="title">
										Title{" "}
										<span className="text-red-500">*</span>
									</Label>
									<Input
										id="title"
										placeholder="Enter property title"
										value={title}
										onChange={(e) => {
											const v = e.target.value;
											setTitle(v);
											setSlug(slugify(v));
											if (errors.title) {
												setErrors((prev) => ({
													...prev,
													title: "",
												}));
											}
										}}
										className={
											errors.title ? "border-red-500" : ""
										}
									/>
									{errors.title && (
										<p className="text-sm text-red-500 flex items-center gap-1">
											<AlertCircle className="h-3 w-3" />
											{errors.title}
										</p>
									)}
								</div>

								<div className="space-y-2">
									<Label htmlFor="slug">
										Slug{" "}
										<span className="text-red-500">*</span>
									</Label>
									<Input
										id="slug"
										placeholder="auto-generated-from-title"
										value={slug}
										onChange={(e) => {
											setSlug(slugify(e.target.value));
											if (errors.slug) {
												setErrors((prev) => ({
													...prev,
													slug: "",
												}));
											}
										}}
										className={
											errors.slug ? "border-red-500" : ""
										}
									/>
									{errors.slug && (
										<p className="text-sm text-red-500 flex items-center gap-1">
											<AlertCircle className="h-3 w-3" />
											{errors.slug}
										</p>
									)}
								</div>

								<div className="space-y-2">
									<Label htmlFor="property-type">
										Property Type{" "}
										<span className="text-red-500">*</span>
									</Label>
									<Select
										value={propertyType}
										onValueChange={(
											value: "riad" | "apartment"
										) => setPropertyType(value)}
									>
										<SelectTrigger id="property-type">
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="riad">
												Riad
											</SelectItem>
											<SelectItem value="apartment">
												Apartment
											</SelectItem>
										</SelectContent>
									</Select>
								</div>

								<div className="space-y-2">
									<Label htmlFor="availability-type">
										Availability Type{" "}
										<span className="text-red-500">*</span>
									</Label>
									<Select
										value={availabilityType}
										onValueChange={(
											value: "sale" | "rent"
										) => setAvailabilityType(value)}
									>
										<SelectTrigger id="availability-type">
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="sale">
												For Sale
											</SelectItem>
											<SelectItem value="rent">
												For Rent
											</SelectItem>
										</SelectContent>
									</Select>
								</div>

								<div className="space-y-2">
									<Label htmlFor="price">
										Price{" "}
										<span className="text-red-500">*</span>
									</Label>
									<Input
										id="price"
										type="number"
										placeholder="0"
										value={price}
										onChange={(e) => {
											setPrice(e.target.value);
											if (errors.price) {
												setErrors((prev) => ({
													...prev,
													price: "",
												}));
											}
										}}
										className={
											errors.price ? "border-red-500" : ""
										}
										min="0"
										step="0.01"
									/>
									{errors.price && (
										<p className="text-sm text-red-500 flex items-center gap-1">
											<AlertCircle className="h-3 w-3" />
											{errors.price}
										</p>
									)}
								</div>
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<CardTitle>Images</CardTitle>
								<CardDescription>
									Upload property images to showcase the
									listing
								</CardDescription>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="space-y-2">
									<Label>
										Cover Image{" "}
										<span className="text-red-500">*</span>
									</Label>
									{cover && (
										<div className="relative">
											<img
												src={cover}
												alt="cover"
												className="w-full h-48 object-cover rounded-lg border"
											/>
											<Button
												type="button"
												variant="destructive"
												size="icon"
												className="absolute top-2 right-2 h-8 w-8"
												onClick={() => {
													setCover("");
													if (errors.cover) {
														setErrors((prev) => ({
															...prev,
															cover: "",
														}));
													}
												}}
											>
												<X className="h-4 w-4" />
											</Button>
										</div>
									)}

									<ImageUploader
										prefix="properties/"
										onUploaded={(url) => setCover(url)}
									/>
									{errors.cover && (
										<p className="text-sm text-red-500 flex items-center gap-1">
											<AlertCircle className="h-3 w-3" />
											{errors.cover}
										</p>
									)}
								</div>

								<div className="space-y-2">
									<Label>Gallery Images</Label>
									{gallery.length > 0 && (
										<div className="grid grid-cols-3 gap-2">
											{gallery.map((u, i) => (
												<div
													key={i}
													className="relative group"
												>
													<img
														src={u}
														alt={`gallery-${i}`}
														className="w-full h-24 object-cover rounded-lg border"
													/>
													<Button
														type="button"
														variant="destructive"
														size="icon"
														className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
														onClick={() =>
															removeGalleryImage(
																i
															)
														}
													>
														<X className="h-3 w-3" />
													</Button>
												</div>
											))}
										</div>
									)}
									<ImageUploader
										prefix="properties/"
										onUploaded={(url) =>
											setGallery((g) => [...g, url])
										}
									/>
								</div>
							</CardContent>
						</Card>
					</div>

					{/* Right Column */}
					<div className="space-y-6">
						<Card>
							<CardHeader>
								<CardTitle>Description</CardTitle>
								<CardDescription>
									Provide detailed information about the
									property
								</CardDescription>
							</CardHeader>
							<CardContent className="space-y-2">
								<Label>
									Content{" "}
									<span className="text-red-500">*</span>
								</Label>
								<div
									className={`border rounded-lg ${
										errors.description
											? "border-red-500"
											: ""
									}`}
								>
									<TiptapToolbar editor={editor} />
									<EditorContent editor={editor} />
								</div>
								{errors.description && (
									<p className="text-sm text-red-500 flex items-center gap-1">
										<AlertCircle className="h-3 w-3" />
										{errors.description}
									</p>
								)}
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<CardTitle>SEO Settings</CardTitle>
								<CardDescription>
									Optimize your property for search engines
								</CardDescription>
							</CardHeader>
							<CardContent>
								<SeoFields value={seo} onChange={setSeo} />
							</CardContent>
						</Card>

						{Object.keys(errors).length > 0 && (
							<Alert variant="destructive">
								<AlertCircle className="h-4 w-4" />
								<AlertDescription>
									Please fix the validation errors before
									saving.
								</AlertDescription>
							</Alert>
						)}

						<div className="flex gap-2">
							<Button
								onClick={() => save("draft")}
								disabled={saving}
								variant="outline"
								className="w-1/2"
							>
								{saving ? (
									<>
										<Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
										Saving…
									</>
								) : (
									"Save Draft"
								)}
							</Button>
							<Button
								onClick={() => save("published")}
								disabled={saving}
								className="w-1/2"
							>
								{saving ? (
									<>
										<Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
										Saving…
									</>
								) : (
									"Publish"
								)}
							</Button>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}