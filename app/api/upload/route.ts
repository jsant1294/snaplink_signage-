// app/api/upload/route.ts
// File-drop ingest. Accepts an image or mp4, saves it to public/uploads, returns
// the path to attach to a panel item or hero. No URL ingestion — businesses hand
// you photos/videos, not links.

import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";

export const runtime = "nodejs";

const OK = new Set([
  "image/jpeg", "image/png", "image/webp", "image/gif", "image/avif",
  "video/mp4", "video/webm", "video/quicktime",
]);

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const file = form.get("file") as File | null;
    if (!file) return NextResponse.json({ ok: false, error: "No file" }, { status: 400 });
    if (!OK.has(file.type)) {
      return NextResponse.json({ ok: false, error: `Unsupported type: ${file.type}. Use image or mp4.` }, { status: 415 });
    }
    const bytes = Buffer.from(await file.arrayBuffer());
    const dir = path.join(process.cwd(), "public", "uploads");
    await mkdir(dir, { recursive: true });
    const safe = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const name = `${Date.now()}-${safe}`;
    await writeFile(path.join(dir, name), bytes);
    const isVideo = file.type.startsWith("video/");
    return NextResponse.json({ ok: true, path: `/uploads/${name}`, kind: isVideo ? "video" : "image" });
  } catch (e) {
    return NextResponse.json({ ok: false, error: e instanceof Error ? e.message : "upload failed" }, { status: 500 });
  }
}
