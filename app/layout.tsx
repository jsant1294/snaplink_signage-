import "./globals.css";
export const metadata = { title: "Southline Signage", description: "Branded display system" };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body>{children}</body></html>;
}
