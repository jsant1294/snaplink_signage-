# Southline Signage

Branded digital menu boards / kiosk displays for local businesses. Each business
gets a fullscreen looping display at its own URL; a cheap **Amazon Fire Stick**
in the shop opens that URL and shows it on the wall. Multi-tenant (same pattern
as SnapLink): one app, many businesses, each isolated by slug.

## What it does
- **Fullscreen auto-looping display**: menu slides, daily specials, hours, photos.
- **Live elements**: a clock, a scrolling promo ticker, and a QR (to order/book).
- **Admin**: list displays + a quick editor for brand colors, slide timing,
  promo bar, and QR target — the dials you turn at an install.

## Run the server
```bash
npm install
npm run dev      # http://localhost:3500  (admin home)
```
- Admin / control center: `http://localhost:3500/`
- A display: `http://localhost:3500/display/la-placita`

## The pipeline (how the three pieces fit)
```
 You build the content  ->  This server hosts it  ->  Fire Stick shows it
 (admin editor /            (a display page per        (Silk browser opens
  Motion Studio assets)      business at /display/x)    the URL, fullscreen, loops)
```

## Installing at a shop (the Fire Stick part)
1. Plug the Fire Stick into the TV; connect it to the shop's Wi-Fi.
2. Install/open the **Silk browser** (or any kiosk-browser app).
3. Go to your server's display URL:
   `http://YOUR-SERVER-IP:3500/display/<business-slug>`
   (Deploy the server to a static address/host so the Fire Stick can always reach it.)
4. Request Desktop Site + fullscreen. The display loops on its own.
5. Set the TV to that HDMI input and leave it. Updates you make in admin show on
   the next slide refresh / page reload.

## The Southline moat
You don't just serve the page — you **fabricate the install**: CNC the mount,
print a branded surround (HP Latex), contour-cut it, mount the screen, plug in
the Fire Stick. Software-only signage companies can't do the physical side.
That's the recurring-revenue hardware anchor: install once, keep the content
fresh monthly.

## Adding a business
- Quick: copy the sample in `app/lib/store.ts`, change the slug + content.
- Or POST to `/api/business` with a Business object (see `app/lib/types.ts`).
- Edit brand/timing/promo/QR live in the admin editor at `/admin?b=<slug>`.

## Phase two (when a real install asks for it)
- In-admin slide editor (add/reorder menu sections + photos in the UI).
- Pull display assets straight from Motion Studio / a media library.
- Scheduled content (different menu by daypart), multi-screen sync, offline cache.
- A custom Fire Stick app (vs the browser) for auto-launch on power-on.
