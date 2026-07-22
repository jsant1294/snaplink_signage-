// app/components/Display.tsx
// The fullscreen display that runs on the TV (via the Fire Stick browser).
// Auto-advances slides on a loop, shows a live clock, a scrolling promo ticker,
// and a QR. Designed to read from across a room: huge type, high contrast.

"use client";

import { useEffect, useState } from "react";
import { Business, Slide } from "@/app/lib/types";

export function Display({ business, qrDataUrl }: { business: Business; qrDataUrl?: string }) {
  const [idx, setIdx] = useState(0);
  const [now, setNow] = useState<string>("");

  // Slide loop
  useEffect(() => {
    const ms = Math.max(3, business.slideSeconds) * 1000;
    const t = setInterval(() => setIdx((i) => (i + 1) % business.slides.length), ms);
    return () => clearInterval(t);
  }, [business.slides.length, business.slideSeconds]);

  // Live clock
  useEffect(() => {
    if (!business.showClock) return;
    const tick = () => setNow(new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }));
    tick();
    const t = setInterval(tick, 1000 * 20);
    return () => clearInterval(t);
  }, [business.showClock]);

  const slide = business.slides[idx];

  return (
    <div
      className="relative flex h-screen w-screen flex-col overflow-hidden"
      style={{ backgroundColor: business.bgColor, color: business.textColor }}
    >
      {/* Header: logo/name + clock */}
      <header className="flex items-center justify-between px-12 pt-10">
        <div>
          <div className="font-serif text-5xl font-bold" style={{ color: business.primaryColor }}>
            {business.name}
          </div>
          {business.tagline && <div className="mt-1 text-xl opacity-80">{business.tagline}</div>}
        </div>
        {business.showClock && now && (
          <div className="text-4xl font-light tabular-nums opacity-90">{now}</div>
        )}
      </header>

      {/* Center: the active slide */}
      <main className="flex flex-1 items-center justify-center px-16">
        <SlideView slide={slide} primary={business.primaryColor} />
      </main>

      {/* QR corner */}
      {qrDataUrl && (
        <div className="absolute bottom-24 right-12 flex flex-col items-center">
          <img src={qrDataUrl} alt="QR" className="h-36 w-36 rounded-lg bg-white p-2" />
          {business.qrLabel && <div className="mt-2 text-lg font-semibold">{business.qrLabel}</div>}
        </div>
      )}

      {/* Slide dots */}
      <div className="flex justify-center gap-2 pb-3">
        {business.slides.map((_, i) => (
          <div key={i} className="h-2 w-2 rounded-full transition-opacity"
            style={{ backgroundColor: business.primaryColor, opacity: i === idx ? 1 : 0.3 }} />
        ))}
      </div>

      {/* Scrolling promo ticker */}
      {business.promoBar && (
        <div className="overflow-hidden border-t-2 py-4" style={{ borderColor: business.primaryColor }}>
          <div className="ticker whitespace-nowrap text-3xl font-semibold">
            <span className="mx-8">{business.promoBar}</span>
            <span className="mx-8">{business.promoBar}</span>
          </div>
        </div>
      )}

      <style>{`
        @keyframes scroll { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        .ticker { display: inline-block; animation: scroll 28s linear infinite; }
      `}</style>
    </div>
  );
}

function SlideView({ slide, primary }: { slide: Slide; primary: string }) {
  if (slide.kind === "menu") {
    return (
      <div className="w-full max-w-5xl">
        <h2 className="mb-8 text-center font-serif text-6xl font-bold" style={{ color: primary }}>
          {slide.section.title}
        </h2>
        <div className="space-y-5">
          {slide.section.items.map((it, i) => (
            <div key={i} className="flex items-baseline justify-between border-b border-white/10 pb-3">
              <div>
                <span className="text-4xl font-semibold">{it.name}</span>
                {it.note && <span className="ml-3 text-2xl opacity-60">{it.note}</span>}
              </div>
              <span className="text-4xl font-bold" style={{ color: primary }}>{it.price}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  if (slide.kind === "special") {
    return (
      <div className="text-center">
        <div className="mb-4 text-3xl uppercase tracking-[0.3em] opacity-70">Today&apos;s Special</div>
        <div className="font-serif text-8xl font-bold" style={{ color: primary }}>{slide.headline}</div>
        {slide.subtext && <div className="mt-4 text-4xl opacity-80">{slide.subtext}</div>}
        {slide.price && <div className="mt-6 text-7xl font-bold">{slide.price}</div>}
      </div>
    );
  }
  if (slide.kind === "photo") {
    return (
      <div className="relative h-full w-full">
        <img src={slide.image} alt={slide.caption || ""} className="h-full w-full object-cover" />
        {slide.caption && <div className="absolute bottom-8 left-8 text-4xl font-bold">{slide.caption}</div>}
      </div>
    );
  }
  // hours
  return (
    <div className="text-center">
      <div className="mb-8 font-serif text-6xl font-bold" style={{ color: primary }}>Hours</div>
      <div className="space-y-3">
        {slide.lines.map((l, i) => <div key={i} className="text-4xl">{l}</div>)}
      </div>
    </div>
  );
}
