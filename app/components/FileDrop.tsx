// app/components/FileDrop.tsx
// Drag-drop or click to upload an image or mp4. Uploads immediately, returns the
// saved path + kind. No URLs. Used for item photos/videos and hero media.

"use client";

import { useState, useRef } from "react";

export function FileDrop({
  value,
  kind,
  onUploaded,
  label = "Drop image or mp4",
  compact = false,
}: {
  value?: string;
  kind?: "image" | "video";
  onUploaded: (path: string, kind: "image" | "video") => void;
  label?: string;
  compact?: boolean;
}) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [over, setOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const upload = async (file: File) => {
    setBusy(true); setErr(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const r = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await r.json();
      if (!data.ok) throw new Error(data.error || "upload failed");
      onUploaded(data.path, data.kind);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "failed");
    } finally {
      setBusy(false);
    }
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault(); setOver(false);
    const f = e.dataTransfer.files?.[0];
    if (f) upload(f);
  };

  const box = compact ? "h-16 w-16" : "h-28 w-full";

  return (
    <div>
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setOver(true); }}
        onDragLeave={() => setOver(false)}
        onDrop={onDrop}
        className={`${box} flex cursor-pointer items-center justify-center overflow-hidden rounded-lg border-2 border-dashed transition-colors ${over ? "border-gold bg-gold/10" : "border-line"}`}
      >
        {busy ? (
          <span className="text-[10px] text-neutral-400">uploading…</span>
        ) : value ? (
          kind === "video"
            ? <video src={value} muted className="h-full w-full object-cover" />
            : <img src={value} alt="" className="h-full w-full object-cover" />
        ) : (
          <span className="px-2 text-center text-[10px] text-neutral-500">{label}</span>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*,video/mp4,video/webm,video/quicktime"
        className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) upload(f); }}
      />
      {err && <p className="mt-1 text-[10px] text-red-400">{err}</p>}
    </div>
  );
}
