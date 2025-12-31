import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getEnv(name: string) {
  const v = process.env[name];
  if (!v) throw new Error(`${name} is not set`);
  return v;
}

function getExtFromMime(mime: string) {
  switch (mime) {
    case "image/jpeg":
      return "jpg";
    case "image/png":
      return "png";
    case "image/webp":
      return "webp";
    default:
      return null;
  }
}

export async function POST(req: Request) {
  // middleware.ts 會保護 /api/admin/*，未登入會直接 401

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json({ error: "INVALID_FORMDATA" }, { status: 400 });
  }

  const file = formData.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "MISSING_FILE" }, { status: 400 });
  }

  const maxBytes = 2 * 1024 * 1024; // 2MB
  if (file.size <= 0 || file.size > maxBytes) {
    return NextResponse.json({ error: "FILE_TOO_LARGE", maxBytes }, { status: 400 });
  }

  const ext = getExtFromMime(file.type);
  if (!ext) {
    return NextResponse.json({ error: "UNSUPPORTED_TYPE", allowed: ["image/jpeg", "image/png", "image/webp"] }, { status: 400 });
  }

  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!supabaseUrl) {
    return NextResponse.json({ error: "SUPABASE_URL_NOT_SET" }, { status: 500 });
  }

  const serviceRoleKey = getEnv("SUPABASE_SERVICE_ROLE_KEY");
  const bucket = process.env.SUPABASE_STORAGE_BUCKET || "doctor-photos";

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const bytes = Buffer.from(await file.arrayBuffer());
  const path = `doctors/${Date.now()}-${crypto.randomUUID()}.${ext}`;

  const uploadRes = await supabase.storage.from(bucket).upload(path, bytes, {
    contentType: file.type,
    upsert: false,
    cacheControl: "3600",
  });

  if (uploadRes.error) {
    return NextResponse.json({ error: "UPLOAD_FAILED", detail: uploadRes.error.message }, { status: 500 });
  }

  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  if (!data?.publicUrl) {
    return NextResponse.json({ error: "PUBLIC_URL_FAILED" }, { status: 500 });
  }

  return NextResponse.json({ url: data.publicUrl, path, bucket });
}
