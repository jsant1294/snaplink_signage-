// app/admin/page.tsx
// Quick editor for a display's brand + live elements. On-site tweaks: colors,
// slide timing, promo ticker, QR target. (Full slide editing is phase two — for
// the MVP these are the dials you actually turn at an install.)

"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Business } from "@/app/lib/types";

function Editor() {
  const params = useSearchParams();
  const slug = params.get("b") || "la-placita";
  const [biz, setBiz] = useState<Business | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch(`/api/business?slug=${slug}`).then((r) => r.json()).then(setBiz).catch(() => {});
  }, [slug]);

  if (!biz) return <div className="p-10 text-neutral-400">Loading {slug}…</div>;

  const upd = (patch: Partial<Business>) => setBiz({ ...biz, ...patch });
  const save = async () => {
    await fetch("/api/business", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(biz) });
    setSaved(true); setTimeout(() => setSaved(false), 2000);
  };

  return (
    <main className="mx-auto max-w-2xl p-10">
      <a href="/" className="text-sm text-neutral-500 hover:text-gold">← all displays</a>
      <h1 className="mb-1 mt-3 text-2xl font-bold">Edit · {biz.name}</h1>
      <p className="mb-6 text-sm text-neutral-400">Fire Stick URL: <span className="font-mono text-neutral-300">/display/{biz.slug}</span></p>

      <div className="card space-y-4 p-5">
        <div><label className="label">Business name</label>
          <input className="field" value={biz.name} onChange={(e) => upd({ name: e.target.value })} /></div>
        <div><label className="label">Tagline</label>
          <input className="field" value={biz.tagline || ""} onChange={(e) => upd({ tagline: e.target.value })} /></div>
        <div className="grid grid-cols-3 gap-3">
          <div><label className="label">Accent</label>
            <input type="color" className="field h-10 p-1" value={biz.primaryColor} onChange={(e) => upd({ primaryColor: e.target.value })} /></div>
          <div><label className="label">Background</label>
            <input type="color" className="field h-10 p-1" value={biz.bgColor} onChange={(e) => upd({ bgColor: e.target.value })} /></div>
          <div><label className="label">Text</label>
            <input type="color" className="field h-10 p-1" value={biz.textColor} onChange={(e) => upd({ textColor: e.target.value })} /></div>
        </div>
        <div><label className="label">Seconds per slide</label>
          <input type="number" className="field" value={biz.slideSeconds} onChange={(e) => upd({ slideSeconds: Math.max(3, +e.target.value) })} /></div>
        <div><label className="label">Scrolling promo bar</label>
          <input className="field" value={biz.promoBar || ""} onChange={(e) => upd({ promoBar: e.target.value })} /></div>
        <div className="grid grid-cols-2 gap-3">
          <div><label className="label">QR points to (URL)</label>
            <input className="field" value={biz.qrUrl || ""} onChange={(e) => upd({ qrUrl: e.target.value })} /></div>
          <div><label className="label">QR caption</label>
            <input className="field" value={biz.qrLabel || ""} onChange={(e) => upd({ qrLabel: e.target.value })} /></div>
        </div>
        <label className="flex items-center gap-2 text-sm text-neutral-300">
          <input type="checkbox" checked={biz.showClock} onChange={(e) => upd({ showClock: e.target.checked })} /> Show live clock
        </label>
        <div className="flex gap-2">
          <button className="btn-gold" onClick={save}>{saved ? "Saved ✓" : "Save display"}</button>
          <a className="rounded-full border border-line px-4 py-2 text-sm text-neutral-300 hover:border-gold hover:text-gold" href={`/display/${biz.slug}`} target="_blank">Preview →</a>
        </div>
      </div>
    </main>
  );
}

export default function AdminPage() {
  return <Suspense fallback={<div className="p-10 text-neutral-400">Loading…</div>}><Editor /></Suspense>;
}
