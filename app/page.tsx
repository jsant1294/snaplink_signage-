// app/page.tsx
// Admin home: the control center. Lists every business display, shows the exact
// URL to point each shop's Fire Stick at, and links to preview/edit.

import Link from "next/link";
import { store } from "@/app/lib/store";

export default async function Home() {
  const businesses = await store.all();
  return (
    <main className="mx-auto max-w-4xl p-10">
      <div className="mb-1 text-2xl font-bold text-gold">Southline Signage</div>
      <p className="mb-8 text-sm text-neutral-400">
        Branded display system. Point a shop&apos;s Fire Stick browser at a display URL — it loops fullscreen.
      </p>

      <h2 className="mb-3 flex items-center justify-between text-sm font-semibold uppercase tracking-wide text-neutral-400">
        Displays
        <Link href="/admin/new" className="rounded-full border border-line px-3 py-1 text-xs normal-case text-neutral-300 hover:border-gold hover:text-gold">+ New display</Link>
      </h2>
      <div className="space-y-3">
        {businesses.map((b) => (
          <div key={b.slug} className="card flex items-center justify-between p-4">
            <div>
              <div className="text-lg font-semibold" style={{ color: b.primaryColor }}>{b.name}</div>
              {b.panels && b.panels.length > 0 ? (
                <div className="mt-1 space-y-0.5">
                  <div className="font-mono text-[11px] text-neutral-500">{b.panels.length}-screen wall — one Fire Stick per URL:</div>
                  {b.panels.map((p, i) => (
                    <div key={i} className="font-mono text-xs text-neutral-300">
                      TV {i + 1} → /display/{b.slug}/{i + 1} <span className="text-neutral-600">({p.title || p.kind})</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="mt-1 font-mono text-xs text-neutral-500">
                  Fire Stick URL → <span className="text-neutral-300">/display/{b.slug}</span>
                </div>
              )}
            </div>
            <div className="flex flex-col gap-2">
              {b.panels && b.panels.length > 0 ? (
                b.panels.map((_, i) => (
                  <Link key={i} href={`/display/${b.slug}/${i + 1}`} target="_blank"
                    className="rounded-full border border-line px-4 py-1.5 text-xs text-neutral-300 hover:border-gold hover:text-gold">
                    Open TV {i + 1}
                  </Link>
                ))
              ) : (
                <>
                  <Link href={`/display/${b.slug}`} className="btn-gold" target="_blank">Open display</Link>
                  <Link href={`/admin?b=${b.slug}`} className="rounded-full border border-line px-4 py-2 text-sm text-neutral-300 hover:border-gold hover:text-gold">Edit</Link>
                </>
              )}
              <Link href={`/admin/panels?b=${b.slug}`}
                className="rounded-full border border-gold/40 px-4 py-1.5 text-xs text-gold hover:bg-gold/10">
                Build panels
              </Link>
            </div>
          </div>
        ))}
      </div>

      <div className="card mt-8 p-5 text-sm text-neutral-400">
        <div className="mb-2 font-semibold text-gold">Install on the Fire Stick</div>
        <ol className="list-decimal space-y-1 pl-5 text-[13px]">
          <li>Open the <strong>Silk browser</strong> on the Fire Stick.</li>
          <li>Go to <span className="font-mono text-neutral-300">http://YOUR-SERVER:3500/display/&lt;business&gt;</span></li>
          <li>Tap the menu → <strong>Request Desktop Site</strong> + fullscreen.</li>
          <li>It loops on its own. Set the TV input to that HDMI and walk away.</li>
        </ol>
      </div>
    </main>
  );
}
