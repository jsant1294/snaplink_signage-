// app/lib/types.ts
// A signage "business" = one branded display at /display/[slug]. Multi-tenant,
// same pattern as SnapLink: each business is isolated, identified by its slug.

export type MenuItem = { name: string; price: string; note?: string };
export type MenuSection = { title: string; items: MenuItem[] };

export type Slide =
  | { kind: "menu"; section: MenuSection }
  | { kind: "special"; headline: string; subtext?: string; price?: string; image?: string }
  | { kind: "photo"; image: string; caption?: string }
  | { kind: "hours"; lines: string[] };

// A "panel" = one physical screen in a multi-screen wall install. Each Fire Stick
// opens one panel at /display/[business]/[panelIndex]. Panels are independent —
// they don't sync, each just shows its own content reliably.
export type PanelKind = "grid" | "hero" | "steps";

export type GridItem = { name: string; sub?: string; image?: string; video?: string; tag?: string };

export type Panel = {
  kind: PanelKind;
  // shared
  stepNumber?: string;      // "1", "2", "3" badge
  title?: string;           // "PICK IT", "DIP IT"
  subtitle?: string;        // the descriptive line under the title
  // grid panels (flavors, dips, toppings)
  columns?: number;         // grid columns
  items?: GridItem[];
  // a second grid block on the same panel (e.g. DIP IT + TOP IT stacked)
  title2?: string;
  subtitle2?: string;
  items2?: GridItem[];
  // hero panel (center brand)
  heroImage?: string;
  heroVideo?: string;       // mp4 hero (loops muted) — overrides heroImage if set
  heroName?: string;        // "LA MORELITA"
  heroSub?: string;         // "DE MORELIA"
  heroKicker?: string;      // "PALETAS GOURMET"
  heroBanner?: string;      // "HANDMADE · FRESH · NATURAL INGREDIENTS"
  heroFooter?: string;      // "VOTED A TOP DESTINATION FOR PALETAS!"
  // a call-to-action button shown at the bottom of a panel
  ctaLabel?: string;        // "PLACE ORDER"
};

export type Business = {
  slug: string;
  name: string;
  tagline?: string;
  // brand
  primaryColor: string;   // accent / price color
  bgColor: string;        // display background
  textColor: string;
  logo?: string;
  // display content
  slides: Slide[];
  slideSeconds: number;        // how long each slide holds
  promoBar?: string;           // scrolling ticker text
  qrUrl?: string;              // what the QR points to (menu/order/book)
  qrLabel?: string;            // caption under the QR
  showClock: boolean;
  // Multi-screen wall installs: each panel = one physical screen / Fire Stick.
  // If present, the business is shown panel-by-panel at /display/[slug]/[n].
  panels?: Panel[];
};
