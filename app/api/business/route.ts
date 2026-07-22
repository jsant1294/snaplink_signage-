// app/api/business/route.ts
import { NextRequest, NextResponse } from "next/server";
import { store } from "@/app/lib/store";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get("slug");
  if (slug) return NextResponse.json(await store.get(slug));
  return NextResponse.json(await store.all());
}

export async function POST(req: NextRequest) {
  try {
    const biz = await req.json();
    if (!biz.slug || !biz.name) {
      return NextResponse.json({ ok: false, error: "slug and name required" }, { status: 400 });
    }
    const saved = await store.save(biz);
    return NextResponse.json({ ok: true, business: saved });
  } catch (e) {
    return NextResponse.json({ ok: false, error: e instanceof Error ? e.message : "save failed" }, { status: 500 });
  }
}
