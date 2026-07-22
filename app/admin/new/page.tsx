// app/admin/new/page.tsx
// Create a new business display from scratch (name, slug, brand), then jump
// straight into the panel builder. For onboarding a new signage client on-site.

"use client";

import { useState } from "react";
import { Business } from "@/app/lib/types";

export default function NewDisplay() {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [primaryColor, setPrimary] = useState("#E8B23A");
  const [bgColor, setBg] = useState("#2A0E16");
  const [textColor, setText] = useState("#FBEFE0");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const autoSlug = (v: string) =>
    v.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  const create = async () => {
    const s = slug || autoSlug(name);
    if (!name || !s) { setErr("Name required"); return; }
    setBusy(true); setErr(null);
    const biz: Business = {
      slug: s, name, tagline: "",
      primaryColor, bgColor, textColor,
      slides: [], slideSeconds: 10, showClock: false,
      qrUrl: "", qrLabel: "", panels: [],
    };
    const r = await fetch("/api/business", {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(biz),
    });
    const data = await r.json();
    setBusy(false);
    if (!data.ok) { setErr(data.error || "failed"); return; }
    window.location.href = `/admin/panels?b=${s}`;
  };

  return (
    <main className="mx-auto max-w-xl p-10">
      <a href="/" className="text-sm text-neutral-500 hover:text-gold">← all displays</a>
      <h1 className="mb-1 mt-3 text-2xl font-bold">New Display</h1>
      <p className="mb-6 text-sm text-neutral-400">Create the business, then build its panels (any number of screens).</p>
      <div className="card space-y-4 p-5">
        <div><label className="label">Business name</label>
          <input className="field" value={name} onChange={(e) => { setName(e.target.value); setSlug(autoSlug(e.target.value)); }} placeholder="La Morelita de Morelia" /></div>
        <div><label className="label">URL slug</label>
          <input className="field" value={slug} onChange={(e) => setSlug(autoSlug(e.target.value))} placeholder="la-morelita" />
          <p className="mt-1 text-[10px] text-neutral-500">Fire Sticks will open /display/{slug || "your-slug"}/1, /2, …</p></div>
        <div className="grid grid-cols-3 gap-3">
          <div><label className="label">Accent</label><input type="color" className="field h-10 p-1" value={primaryColor} onChange={(e) => setPrimary(e.target.value)} /></div>
          <div><label className="label">Background</label><input type="color" className="field h-10 p-1" value={bgColor} onChange={(e) => setBg(e.target.value)} /></div>
          <div><label className="label">Text</label><input type="color" className="field h-10 p-1" value={textColor} onChange={(e) => setText(e.target.value)} /></div>
        </div>
        {err && <p className="text-sm text-red-400">{err}</p>}
        <button className="btn-gold w-full" onClick={create} disabled={busy}>{busy ? "Creating…" : "Create & build panels →"}</button>
      </div>
    </main>
  );
}
