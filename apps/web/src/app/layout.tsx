import type { Metadata } from "next";
import { DM_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Vishal Gastu — AI Engineer & Software Developer",
  description:
    "AI Engineer & Software Developer. Creating what doesn't exist yet, and building it well enough to change what comes next.",
  keywords: ["AI Engineer", "Software Developer", "Portfolio", "Python", "TypeScript", "ML"],
  openGraph: {
    title: "Vishal Gastu — AI Engineer & Software Developer",
    description: "AI Engineer & Software Developer based in Chennai.",
    type: "website",
  },
};

import { CanvasWrapper } from "@/canvas/CanvasWrapper";
import { CommandPalette } from "@/components/CommandPalette";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { SkipLink } from "@/components/SkipLink";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${dmSans.variable} ${jetbrainsMono.variable}`}>
      {/*
       * X0: first-paint black layer — CSS-only, renders before JS.
       * An inline script in X1 will set data-intro="pending" on <html>
       * to keep this black overlay visible while the intro plays.
       * For now it is simply absent so the Reader is always visible.
       */}
      <body>
        <SkipLink />

        {/* X1: Stage (canvas) will replace this null placeholder */}
        <CanvasWrapper />

        {/* Reader — always visible in X0 */}
        <Header />
        <main id="main-content">{children}</main>
        <Footer />

        {/* Global UI overlays that survive every state */}
        <CommandPalette />
      </body>
    </html>
  );
}
