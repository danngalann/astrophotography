import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Daniel Galán · Astrophotography",
    template: "%s · Daniel Galán",
  },
  description:
    "Deep-sky astrophotography, nightscapes, immersive panoramas, and films by Daniel Galán.",
  metadataBase: new URL("https://astro.danielgalan.dev"),
  openGraph: {
    title: "Daniel Galán · Astrophotography",
    description:
      "Deep-sky astrophotography, nightscapes, immersive panoramas, and films.",
    type: "website",
    images: ["/media/images/veil-nebula/2048.webp"],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
