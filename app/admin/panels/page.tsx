// app/admin/panels/page.tsx
// The panel builder. For multi-screen wall installs (3, 6, any number). Add panels,
// set each one's type (grid / hero), build item grids with drag-drop photo/mp4
// upload, reorder, save. This is what you use on-site instead of editing code.

"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Business, Panel, GridItem } from "@/app/lib/types";
import { FileDrop } from "@/app/components/FileDrop";

function emptyPanel(kind: Panel["kind"]): Panel {
  if (kind === "hero") {
    return { kind: "hero", heroName: "BRAND", heroSub: "", heroKicker: "", heroBanner: "", heroFooter: "" };
  }
  return { kind: "grid", stepNumber: "", title: "NEW PANEL", subtitle: "", columns: 6, items: [] };
}

function Builder() {
  const params = useSearchParams();
  const slug = params.get("b") || "la-morelita";
  const [biz, setBiz] = useState<Business | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch(`/api/business?slug=${slug}`).then((r) => r.json()).then((b) => {
      if (b && !b.panels) b.panels = [];
      setBiz(b);
    }).catch(() => {});
  }, [slug]);

  if (!biz) return <div className="p-10 text-neutral-400">Loading {slug}…</div>;
  const panels = biz.panels || [];

  const setPanels = (next: Panel[]) => setBiz({ ...biz, panels: next });
  const updPanel = (i: number, patch: Partial<Panel>) =>
    setPanels(panels.map((p, j) => (j === i ? { ...p, ...patch } : p)));
  const addPanel = (kind: Panel["kind"]) => setPanels([...panels, emptyPanel(kind)]);
  const removePanel = (i: number) => setPanels(panels.filter((_, j) => j !== i));
  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= panels.length) return;
    const next = [...panels];
    [next[i], next[j]] = [next[j], next[i]];
    setPanels(next);
  };

  const updItem = (pi: number, ii: number, patch: Partial<GridItem>) => {
    const p = panels[pi];
    const items = [...(p.items || [])];
    items[ii] = { ...items[ii], ...patch };
    updPanel(pi, { items });
  };
  const addItem = (pi: number) => {
    const p = panels[pi];
    updPanel(pi, { items: [...(p.items || []), { name: "New item" }] });
  };
  const removeItem = (pi: number, ii: number) => {
    const p = panels[pi];
    updPanel(pi, { items: (p.items || []).filter((_, j) => j !== ii) });
  };

  const save = async () => {
    await fetch("/api/business", {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(biz),
    });
    setSaved(true); setTimeout(() => setSaved(false), 2000);
  };

  return (
    <main className="mx-auto max-w-3xl p-8">
      <a href="/" className="text-sm text-neutral-500 hover:text-gold">← all displays</a>
      <h1 className="mb-1 mt-3 text-2xl font-bold">Panel Builder · {biz.name}</h1>
      <p className="mb-4 text-sm text-neutral-400">
        {panels.length} screen{panels.length === 1 ? "" : "s"} — each one is a Fire Stick at
        <span className="font-mono text-neutral-300"> /display/{biz.slug}/{"<n>"}</span>
      </p>

      <div className="mb-5 flex flex-wrap gap-2">
        <button className="btn-gold" onClick={() => addPanel("grid")}>+ Add grid panel</button>
        <button className="rounded-full border border-line px-4 py-2 text-sm text-neutral-300 hover:border-gold hover:text-gold" onClick={() => addPanel("hero")}>+ Add hero panel</button>
        <button className="ml-auto btn-gold" onClick={save}>{saved ? "Saved ✓" : "Save all panels"}</button>
      </div>

      <div className="space-y-5">
        {panels.map((p, pi) => (
          <div key={pi} className="card p-4">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="rounded bg-gold/15 px-2 py-0.5 font-mono text-xs text-gold">TV {pi + 1}</span>
                <span className="text-xs uppercase tracking-wide text-neutral-500">{p.kind}</span>
                <a href={`/display/${biz.slug}/${pi + 1}`} target="_blank" className="text-xs text-neutral-500 hover:text-gold">preview →</a>
              </div>
              <div className="flex gap-1">
                <button className="btn-ghost" onClick={() => move(pi, -1)} disabled={pi === 0}>↑</button>
                <button className="btn-ghost" onClick={() => move(pi, 1)} disabled={pi === panels.length - 1}>↓</button>
                <button className="btn-ghost text-red-400" onClick={() => removePanel(pi)}>✕</button>
              </div>
            </div>

            {p.kind === "hero" ? (
              <div className="grid grid-cols-2 gap-3">
                <div><label className="label">Brand name</label><input className="field" value={p.heroName || ""} onChange={(e) => updPanel(pi, { heroName: e.target.value })} /></div>
                <div><label className="label">Sub line</label><input className="field" value={p.heroSub || ""} onChange={(e) => updPanel(pi, { heroSub: e.target.value })} /></div>
                <div><label className="label">Kicker (top)</label><input className="field" value={p.heroKicker || ""} onChange={(e) => updPanel(pi, { heroKicker: e.target.value })} /></div>
                <div><label className="label">Banner</label><input className="field" value={p.heroBanner || ""} onChange={(e) => updPanel(pi, { heroBanner: e.target.value })} /></div>
                <div className="col-span-2"><label className="label">Footer line</label><input className="field" value={p.heroFooter || ""} onChange={(e) => updPanel(pi, { heroFooter: e.target.value })} /></div>
                <div className="col-span-2">
                  <label className="label">Hero image or mp4</label>
                  <FileDrop value={p.heroVideo || p.heroImage} kind={p.heroVideo ? "video" : "image"}
                    onUploaded={(path, kind) => updPanel(pi, kind === "video" ? { heroVideo: path, heroImage: undefined } : { heroImage: path, heroVideo: undefined })} />
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="grid grid-cols-4 gap-3">
                  <div><label className="label">Step #</label><input className="field" value={p.stepNumber || ""} onChange={(e) => updPanel(pi, { stepNumber: e.target.value })} placeholder="1" /></div>
                  <div className="col-span-2"><label className="label">Title</label><input className="field" value={p.title || ""} onChange={(e) => updPanel(pi, { title: e.target.value })} placeholder="PICK IT" /></div>
                  <div><label className="label">Columns</label><input type="number" className="field" value={p.columns || 6} onChange={(e) => updPanel(pi, { columns: Math.max(1, +e.target.value) })} /></div>
                </div>
                <div><label className="label">Subtitle</label><input className="field" value={p.subtitle || ""} onChange={(e) => updPanel(pi, { subtitle: e.target.value })} /></div>
                <div><label className="label">CTA button (optional)</label><input className="field" value={p.ctaLabel || ""} onChange={(e) => updPanel(pi, { ctaLabel: e.target.value })} placeholder="PLACE ORDER" /></div>

                <label className="label">Items (drop a photo or mp4 on each)</label>
                <div className="grid grid-cols-2 gap-3">
                  {(p.items || []).map((it, ii) => (
                    <div key={ii} className="flex gap-2 rounded-lg border border-line p-2">
                      <div className="w-16 shrink-0">
                        <FileDrop compact value={it.video || it.image} kind={it.video ? "video" : "image"}
                          onUploaded={(path, kind) => updItem(pi, ii, kind === "video" ? { video: path, image: undefined } : { image: path, video: undefined })} />
                      </div>
                      <div className="flex-1 space-y-1">
                        <input className="field" value={it.name} onChange={(e) => updItem(pi, ii, { name: e.target.value })} placeholder="Name" />
                        <div className="flex gap-1">
                          <input className="field" value={it.sub || ""} onChange={(e) => updItem(pi, ii, { sub: e.target.value })} placeholder="note / price" />
                          <button className="btn-ghost text-red-400" onClick={() => removeItem(pi, ii)}>✕</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <button className="btn-ghost" onClick={() => addItem(pi)}>+ Add item</button>
              </div>
            )}
          </div>
        ))}
      </div>

      {panels.length === 0 && (
        <div className="card p-6 text-center text-sm text-neutral-500">No panels yet. Add a grid or hero panel above.</div>
      )}

      <div className="mt-6 flex justify-end">
        <button className="btn-gold" onClick={save}>{saved ? "Saved ✓" : "Save all panels"}</button>
      </div>
    </main>
  );
}

export default function PanelBuilderPage() {
  return <Suspense fallback={<div className="p-10 text-neutral-400">Loading…</div>}><Builder /></Suspense>;
}
