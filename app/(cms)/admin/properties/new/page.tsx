"use client";

import { useState } from "react";
import { slugify } from "@/lib/slugify";
import RichEditor from "@/components/editor";
import { ImageUploader } from "@/components/image-uploader";
import { SeoFields } from "@/components/seo-fields";

export default function NewProperty() {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [availability, setAvailability] = useState<"for_sale" | "for_rent">("for_sale");
  const [price, setPrice] = useState<number>(0);
  const [cover, setCover] = useState("");
  const [gallery, setGallery] = useState<string[]>([]);
  const [desc, setDesc] = useState<any>("");
  const [seo, setSeo] = useState<any>({});
  const [saving, setSaving] = useState(false);

  async function save() {
    setSaving(true);
    try {
      const finalSlug = slug || slugify(title);

      const res = await fetch("/api/properties", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          slug: finalSlug,
          availability,
          price,
          cover_image_url: cover,
          gallery: gallery.map((u) => ({ url: u })),
          description: desc,
          status: "draft",
          ...seo, // only the API’s allowlist is inserted
        }),
      });

const json = await res.json().catch(() => ({}));
if (!res.ok) {
  console.error(json);
  alert(json.error || "Insert failed");
  return;
}
      if (!res.ok) {
        const { error } = await res.json().catch(() => ({ error: "Failed to create" }));
        alert(error || "Failed to create");
        return;
      }

      window.location.href = "/admin/properties";
    } finally {
      setSaving(false);
    }
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
              const v = e.target.value;
              setTitle(v);
              setSlug(slugify(v));
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
            onChange={(e) => setAvailability(e.target.value as "for_sale" | "for_rent")}
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
              <img src={cover} alt="cover" className="w-full h-40 object-cover rounded-xl" />
            ) : null}
            <ImageUploader onUploaded={(u) => setCover(u)} />
          </label>
          <label className="grid gap-2">
            <span className="text-sm">Gallery</span>
            <div className="grid grid-cols-3 gap-2">
              {gallery.map((u, i) => (
                <img key={i} src={u} className="w-full h-24 object-cover rounded" />
              ))}
            </div>
            <ImageUploader onUploaded={(u) => setGallery((g) => [...g, u])} />
          </label>
        </div>
        <div className="grid gap-3">
          <span className="text-sm">Description</span>
          <RichEditor value={desc} onChange={setDesc} />
          <span className="text-sm">SEO</span>
          <SeoFields value={seo} onChange={setSeo} />
          <button
            onClick={save}
            disabled={saving}
            className="border rounded-xl p-2 disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
