import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Oswald } from "next/font/google";
import "./globals.css";
import { SITE } from "@/lib/constants";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Providers } from "@/components/providers";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const oswald = Oswald({ variable: "--font-display", subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: `${SITE.name} — ${SITE.motto}`,
    template: `%s | ${SITE.name}`,
  },
  description:
    "Shop premium gym & fitness equipment, training gear, running & athletics accessories, kids sports, kids toys and board games in Kenya. Made to move.",
  keywords: [
    "gym equipment Kenya",
    "gym accessories Kenya",
    "fitness equipment Kenya",
    "home workout equipment Kenya",
    "running accessories Kenya",
    "athletics accessories Kenya",
    "kids sports accessories Kenya",
    "kids toys Kenya",
    "board games Kenya",
    "sports accessories Nairobi",
    "fitness accessories Nairobi",
  ],
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  openGraph: {
    title: `${SITE.name} — ${SITE.motto}`,
    description: SITE.tagline,
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${oswald.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-paper text-ink" suppressHydrationWarning>
        <Providers>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
