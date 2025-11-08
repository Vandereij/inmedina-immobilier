"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
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

// ---------- Tiptap Toolbar ----------
function TiptapToolbar({ editor }: { editor: any }) {
  if (!editor) return null;

  const addLink = () => {
    const url = window.prompt("Enter URL:");
    if (url) editor.chain().focus().setLink({ href: url }).run();
  };

  const addImage = () => {
    const url = window.prompt("Enter image URL:");
    if (url) editor.chain().focus().setImage({ src: url }).run();
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
        variant={editor.isActive({ textAlign: "left" }) ? "secondary" : "ghost"}
        size="sm"
        onClick={() => editor.chain().focus().setTextAlign("left").run()}
      >
        <AlignLeft className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant={
          editor.isActive({ textAlign: "center" }) ? "secondary" : "ghost"
        }
        size="sm"
        onClick={() => editor.chain().focus().setTextAlign("center").run()}
      >
        <AlignCenter className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant={editor.isActive({ textAlign: "right" }) ? "secondary" : "ghost"}
        size="sm"
        onClick={() => editor.chain().focus().setTextAlign("right").run()}
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

type SeoState = {
  seo_title: string;
  seo_description: string;
  seo_canonical: string;
  seo_robots: string;
};

export default function EditPropertyForm() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  // Memoize Supabase client so it’s stable across renders
  const supabase = useMemo(() => createClient(), []);

  // ------- Form state -------
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [propertyType, setPropertyType] = useState<"sale" | "rent">("sale");
  const [price, setPrice] = useState<string>("");
  const [cover, setCover] = useState<string>("");
  const [gallery, setGallery] = useState<string[]>([]);
  const [seo, setSeo] = useState<SeoState>({
    seo_title: "",
    seo_description: "",
    seo_canonical: "",
    seo_robots: "",
  });
  const [status, setStatus] = useState<"draft" | "published">("draft");

  // Keep the fetched description separately; apply it when editor is ready
  const [descriptionHTML, setDescriptionHTML] = useState<string>("");

  // Memoize extensions array so it's not re-created each render
  const editorExtensions = useMemo(
    () => [
      StarterKit,
      Underline,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Link.configure({ openOnClick: false }),
      Image,
    ],
    []
  );

  // Editor
  const editor = useEditor({
    extensions: editorExtensions,
    content: "",
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "prose prose-sm max-w-none focus:outline-none min-h-[300px] p-4",
      },
    },
  });

  // ------- Load existing record (depends ONLY on stable supabase + id) -------
  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      const { data, error } = await supabase
        .from("properties")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error(error);
        alert(error.message);
        if (!cancelled) setLoading(false);
        return;
      }
      if (cancelled) return;

      setTitle(data?.title || "");
      setSlug(data?.slug || "");
      setPropertyType((data?.availability_type as any) || "sale");
      setPrice(data?.price != null ? String(data.price) : "");
      setCover(data?.cover_image_url || "");
      setGallery(
        Array.isArray(data?.gallery)
          ? data.gallery.map((g: any) => g?.url || g).filter(Boolean)
          : []
      );
      setSeo({
        seo_title: data?.seo_title || "",
        seo_description: data?.seo_description || "",
        seo_canonical: data?.seo_canonical || "",
        seo_robots: data?.seo_robots || "",
      });
      setStatus((data?.status as any) || "draft");
      setDescriptionHTML(data?.description || "");

      setLoading(false);
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [id, supabase]);

  // ------- Apply content when editor instance is ready (separate effect) -------
  useEffect(() => {
    if (editor) {
      editor.commands.setContent(descriptionHTML || "");
    }
  }, [editor, descriptionHTML]);

  // ------- Validation -------
  function validateForm() {
    const newErrors: Record<string, string> = {};

    if (!title.trim()) newErrors.title = "Title is required";
    if (!slug.trim()) newErrors.slug = "Slug is required";
    else if (!/^[a-z0-9-]+$/.test(slug))
      newErrors.slug =
        "Use lowercase letters, numbers, and hyphens only";

    const numeric = parseFloat(price || "");
    if (!Number.isFinite(numeric) || numeric <= 0)
      newErrors.price = "Price must be greater than 0";

    if (!cover) newErrors.cover = "Cover image is required";
    if (!editor || !editor.getText().trim())
      newErrors.description = "Description is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  // ------- Save -------
  async function save(nextStatus: "draft" | "published") {
    const isDraft = nextStatus === "draft";

    // Only run strict validation for Publish.
    if (!isDraft && !validateForm()) return;

    // For draft saves, allow light validation
    if (isDraft) {
      if (!title.trim()) {
        setErrors((p) => ({ ...p, title: "Title is required" }));
        return;
      }
      if (!slug.trim()) setSlug((s) => s || slugify(title));
    }

    setSaving(true);
    try {
      const payload: any = {
        title,
        slug: slug || slugify(title),
        availability_type: propertyType,
        price: parseFloat(price || "0"),
        cover_image_url: cover,
        gallery: gallery.map((u) => ({ url: u })),
        description: editor?.getHTML() || "",
        status: nextStatus,
        seo_title: seo.seo_title || "",
        seo_description: seo.seo_description || "",
        seo_canonical: seo.seo_canonical || "",
        seo_robots: seo.seo_robots || "",
      };

      const { error } = await supabase.from("properties").update(payload).eq("id", id);

      if (error) {
        console.error(error);
        alert(error.message || "Update failed");
        return;
      }

      setStatus(nextStatus);
      router.push("/admin/properties");
    } finally {
      setSaving(false);
    }
  }

  function removeGalleryImage(index: number) {
    setGallery((g) => g.filter((_, i) => i !== index));
  }

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center text-muted-foreground">
        <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Loading property…
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Edit Property</h1>
            <p className="text-muted-foreground mt-1">
              Update an existing property listing
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => save("draft")}
              disabled={saving}
            >
              Save Draft
            </Button>
            <Button
              type="button"
              onClick={() => save("published")}
              disabled={saving}
            >
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving…
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
                  Update the core details about the property
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">
                    Title <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="title"
                    placeholder="Enter property title"
                    value={title}
                    onChange={(e) => {
                      const v = e.target.value;
                      setTitle(v);
                      if (!slug) setSlug(slugify(v));
                      if (errors.title)
                        setErrors((prev) => ({ ...prev, title: "" }));
                    }}
                    className={errors.title ? "border-red-500" : ""}
                  />
                  {errors.title && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" /> {errors.title}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="slug">
                    Slug <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="slug"
                    placeholder="auto-generated-from-title"
                    value={slug}
                    onChange={(e) => {
                      setSlug(slugify(e.target.value));
                      if (errors.slug)
                        setErrors((prev) => ({ ...prev, slug: "" }));
                    }}
                    className={errors.slug ? "border-red-500" : ""}
                  />
                  {errors.slug && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" /> {errors.slug}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="property-type">
                    Availability Type <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={propertyType}
                    onValueChange={(v: "sale" | "rent") => setPropertyType(v)}
                  >
                    <SelectTrigger id="property-type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sale">For Sale</SelectItem>
                      <SelectItem value="rent">For Rent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price">
                    Price <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="price"
                    type="number"
                    placeholder="0"
                    value={price}
                    onChange={(e) => {
                      setPrice(e.target.value);
                      if (errors.price)
                        setErrors((prev) => ({ ...prev, price: "" }));
                    }}
                    className={errors.price ? "border-red-500" : ""}
                    min="0"
                    step="0.01"
                  />
                  {errors.price && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" /> {errors.price}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Images</CardTitle>
                <CardDescription>Update property images</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>
                    Cover Image <span className="text-red-500">*</span>
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
                          if (errors.cover)
                            setErrors((prev) => ({ ...prev, cover: "" }));
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
                      <AlertCircle className="h-3 w-3" /> {errors.cover}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Gallery Images</Label>
                  {gallery.length > 0 && (
                    <div className="grid grid-cols-3 gap-2">
                      {gallery.map((u, i) => (
                        <div key={i} className="relative group">
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
                            onClick={() => removeGalleryImage(i)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                  <ImageUploader
                    prefix="properties/"
                    onUploaded={(url) => setGallery((g) => [...g, url])}
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
                <CardDescription>Describe the property in detail</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Label>
                  Content <span className="text-red-500">*</span>
                </Label>
                <div
                  className={`border rounded-lg ${
                    errors.description ? "border-red-500" : ""
                  }`}
                >
                  <TiptapToolbar editor={editor} />
                  <EditorContent editor={editor} />
                </div>
                {errors.description && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" /> {errors.description}
                  </p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>SEO Settings</CardTitle>
                <CardDescription>Optimize your listing for search</CardDescription>
              </CardHeader>
              <CardContent>
                <SeoFields value={seo} onChange={setSeo} />
              </CardContent>
            </Card>

            {Object.keys(errors).length > 0 && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Please fix the validation errors before saving.
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
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving…
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
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving…
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
