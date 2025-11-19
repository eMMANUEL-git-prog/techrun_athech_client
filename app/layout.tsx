import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { Providers } from "./providers";

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Athech - Athlete Management Simplified",
  description:
    "Track whereabouts, manage submissions, verify locations, and coordinate your team in one centralized platform.",
  icons: {
    icon: [
      {
        url: "/icon1.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon1.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon1.png",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <Providers>{children}</Providers>
        <Analytics />
      </body>
    </html>
  );
}
