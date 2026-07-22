// app/display/[business]/page.tsx
// The URL the Fire Stick opens: /display/la-placita. Loads the business, builds
// the QR server-side, renders the fullscreen Display. This is the screen on the wall.

import { store } from "@/app/lib/store";
import { Display } from "@/app/components/Display";
import QRCode from "qrcode";

export default async function DisplayPage({
  params,
}: {
  params: Promise<{ business: string }>;
}) {
  const { business: slug } = await params;
  const business = await store.get(slug);

  if (!business) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-ink text-gold">
        <div className="text-center">
          <div className="text-3xl font-bold">Display not found</div>
          <div className="mt-2 opacity-70">No business at /display/{slug}</div>
        </div>
      </div>
    );
  }

  let qrDataUrl: string | undefined;
  if (business.qrUrl) {
    try {
      qrDataUrl = await QRCode.toDataURL(business.qrUrl, { margin: 1, width: 300 });
    } catch {}
  }

  return <Display business={business} qrDataUrl={qrDataUrl} />;
}
