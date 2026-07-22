// app/display/[business]/[panel]/page.tsx
// One physical screen of a wall install. TV 1 -> /display/la-morelita/1, etc.
// Each Fire Stick opens its own panel URL; panels are independent (no sync needed).

import { store } from "@/app/lib/store";
import { PanelView } from "@/app/components/PanelView";

export default async function PanelPage({
  params,
}: {
  params: Promise<{ business: string; panel: string }>;
}) {
  const { business: slug, panel: panelParam } = await params;
  const business = await store.get(slug);
  const panels = business?.panels || [];
  const idx = Math.max(0, parseInt(panelParam, 10) - 1); // 1-based URL -> 0-based
  const panel = panels[idx];

  if (!business || !panel) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-ink text-gold">
        <div className="text-center">
          <div className="text-3xl font-bold">Panel not found</div>
          <div className="mt-2 opacity-70">/display/{slug}/{panelParam}</div>
          <div className="mt-1 text-sm opacity-50">{panels.length} panels available</div>
        </div>
      </div>
    );
  }
  return <PanelView business={business} panel={panel} />;
}
