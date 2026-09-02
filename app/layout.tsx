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
    default: "Daniel Galán | Astrophotography",
    template: "%s · Daniel Galán",
  },
  description:
    "A chronological archive of deep-sky astrophotography, nightscapes, immersive panoramas, and films by Daniel Galán.",
  metadataBase: new URL("https://astro.danngalann.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Daniel Galán | Astrophotography",
    description:
      "Explore a chronological archive of deep-sky images, nightscapes, immersive panoramas, and films.",
    type: "website",
    url: "/",
    siteName: "Daniel Galán Astrophotography",
    locale: "en_US",
    images: [
      {
        url: "/media/social/veil-nebula.jpg",
        width: 1200,
        height: 630,
        alt: "The blue and red filaments of the Eastern Veil Nebula",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Daniel Galán | Astrophotography",
    description:
      "Explore a chronological archive of deep-sky images, nightscapes, immersive panoramas, and films.",
    images: ["/media/social/veil-nebula.jpg"],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
