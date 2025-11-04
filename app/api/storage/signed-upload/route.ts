import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const bucket = body.bucket ?? "images";
    const path = body.path;

    if (!path || typeof path !== "string" || path.includes("..")) {
      return NextResponse.json({ error: "Invalid path" }, { status: 400 });
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!, // Server-only key!
      { auth: { persistSession: false } }
    );

    // ✅ Correct usage — only pass the path
    const { data, error } = await supabase.storage
      .from(bucket)
      .createSignedUploadUrl(path);

    if (error || !data) {
      return NextResponse.json(
        { error: error?.message ?? "Could not create signed URL" },
        { status: 400 }
      );
    }

    // Construct the public URL (for public buckets)
    const publicUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${bucket}/${path}`;

    return NextResponse.json({
      signedUrl: data.signedUrl,
      path,
      publicUrl,
    });
  } catch (err: any) {
    console.error("Signed upload error:", err);
    return NextResponse.json(
      { error: err?.message ?? "Server error" },
      { status: 500 }
    );
  }
}
