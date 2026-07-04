import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "KettleCraft | Hand-Forged Iron Kettlebells",
  description:
    "Hand-poured iron kettlebells built for intent. Featuring a lifetime warranty and free re-coating. Equipment that outlasts the athlete.",
  keywords: [
    "hand-forged kettlebells",
    "cast iron kettlebells",
    "industrial gym equipment",
    "KettleCraft",
    "lifetime warranty kettlebells",
  ],
  openGraph: {
    title: "KettleCraft | Hand-Forged Iron Kettlebells",
    description:
      "Hand-poured iron kettlebells built for intent. Featuring a lifetime warranty and free re-coating. Equipment that outlasts the athlete.",
    url: "https://kettlecraft.com",
    siteName: "KettleCraft",
    images: [
      {
        url: "https://zkvkbpxrxnfynqqeytke.supabase.co/storage/v1/object/public/marketing-assets/verify-scope-a/cleo/1783166378067-hero.png",
        width: 1200,
        height: 630,
        alt: "A single hand-forged KettleCraft kettlebell on raw concrete with hard directional lighting",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "KettleCraft | Hand-Forged Iron Kettlebells",
    description:
      "Hand-poured iron kettlebells built for intent. Featuring a lifetime warranty and free re-coating. Equipment that outlasts the athlete.",
    images: [
      "https://zkvkbpxrxnfynqqeytke.supabase.co/storage/v1/object/public/marketing-assets/verify-scope-a/cleo/1783166378067-hero.png",
    ],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
