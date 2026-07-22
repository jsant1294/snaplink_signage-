// app/components/PanelView.tsx
// Renders ONE physical screen of a multi-screen wall install. Three kinds:
//   - grid: a photographed item grid (flavors, dips, toppings) with a numbered step
//   - hero: the center brand panel (illustration, name, banner, footer)
//   - steps: (alias of grid for a single block)
// Styled to match a premium paleta menu: deep background, gold accents, ornate feel.

import { Business, Panel, GridItem } from "@/app/lib/types";

export function PanelView({ business, panel }: { business: Business; panel: Panel }) {
  const gold = business.primaryColor || "#D4AF37";
  const bg = business.bgColor || "#2A0E14";
  const text = business.textColor || "#FFF7EC";

  if (panel.kind === "hero") {
    return (
      <div className="relative flex h-screen w-screen flex-col items-center justify-between overflow-hidden p-12"
        style={{ backgroundColor: bg, color: text }}>
        <GoldFrame gold={gold} />
        <header className="z-10 text-center">
          {panel.heroKicker && <div className="mb-2 text-2xl tracking-[0.4em]" style={{ color: gold }}>✦ {panel.heroKicker} ✦</div>}
          {panel.heroName && <div className="font-serif text-8xl font-bold leading-none" style={{ color: gold }}>{panel.heroName}</div>}
          {panel.heroSub && <div className="mt-2 font-serif text-5xl tracking-wide">{panel.heroSub}</div>}
        </header>
        <div className="z-10 flex flex-1 items-center justify-center">
          {panel.heroVideo
            ? <video src={panel.heroVideo} autoPlay loop muted playsInline className="max-h-[55vh] object-contain drop-shadow-2xl" />
            : panel.heroImage
            ? <img src={panel.heroImage} alt={panel.heroName || ""} className="max-h-[55vh] object-contain drop-shadow-2xl" />
            : <div className="text-3xl opacity-40">[ hero image ]</div>}
        </div>
        <footer className="z-10 text-center">
          {panel.heroBanner && (
            <div className="mb-3 inline-block rounded-full border px-8 py-2 text-2xl tracking-widest" style={{ borderColor: gold, color: gold }}>
              {panel.heroBanner}
            </div>
          )}
          {panel.heroFooter && <div className="font-serif text-3xl font-semibold" style={{ color: gold }}>{panel.heroFooter}</div>}
        </footer>
      </div>
    );
  }

  // grid / steps panel
  return (
    <div className="relative flex h-screen w-screen flex-col overflow-hidden p-12"
      style={{ backgroundColor: bg, color: text }}>
      <GoldFrame gold={gold} />
      <GridBlock gold={gold} step={panel.stepNumber} title={panel.title} subtitle={panel.subtitle}
        items={panel.items || []} columns={panel.columns || 6} />
      {panel.items2 && panel.items2.length > 0 && (
        <div className="mt-8">
          <GridBlock gold={gold} title={panel.title2} subtitle={panel.subtitle2}
            items={panel.items2} columns={panel.columns || 4} />
        </div>
      )}
      {panel.ctaLabel && (
        <div className="z-10 mt-auto pt-6 text-center">
          <span className="inline-block rounded-full px-16 py-4 text-3xl font-bold tracking-widest"
            style={{ backgroundColor: gold, color: bg }}>{panel.ctaLabel}</span>
        </div>
      )}
    </div>
  );
}

function GridBlock({ gold, step, title, subtitle, items, columns }:
  { gold: string; step?: string; title?: string; subtitle?: string; items: GridItem[]; columns: number }) {
  return (
    <div className="z-10">
      <div className="mb-2 flex items-baseline gap-4">
        {step && <span className="font-serif text-7xl font-bold leading-none" style={{ color: gold }}>{step}</span>}
        {title && <span className="font-serif text-6xl font-bold tracking-wide" style={{ color: gold }}>{title}</span>}
      </div>
      {subtitle && <p className="mb-6 max-w-3xl text-2xl opacity-85">{subtitle}</p>}
      <div className="grid gap-x-6 gap-y-7" style={{ gridTemplateColumns: `repeat(${columns}, minmax(0,1fr))` }}>
        {items.map((it, i) => (
          <div key={i} className="flex flex-col items-center text-center">
            <div className="mb-2 aspect-square w-full overflow-hidden rounded-xl bg-black/30">
              {it.video
                ? <video src={it.video} autoPlay loop muted playsInline className="h-full w-full object-cover" />
                : it.image
                ? <img src={it.image} alt={it.name} className="h-full w-full object-cover" />
                : <div className="flex h-full items-center justify-center text-sm opacity-30">photo</div>}
            </div>
            <div className="text-lg font-semibold leading-tight">{it.name}{it.tag && <span style={{ color: gold }}> {it.tag}</span>}</div>
            {it.sub && <div className="text-sm opacity-60">{it.sub}</div>}
          </div>
        ))}
      </div>
    </div>
  );
}

// A decorative gold inner border, like the printed menu frame.
function GoldFrame({ gold }: { gold: string }) {
  return (
    <div className="pointer-events-none absolute inset-6 rounded-lg border-2"
      style={{ borderColor: gold, opacity: 0.55 }} />
  );
}
