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
  title: "Vishal Gastu — Digital Universe",
  description:
    "AI Engineer & Software Developer. Creating what doesn't exist yet, and building it well enough to change what comes next.",
  keywords: ["AI Engineer", "Software Developer", "Portfolio", "Three.js", "Python", "TypeScript"],
  openGraph: {
    title: "Vishal Gastu — Digital Universe",
    description: "AI Engineer & Software Developer based in Chennai.",
    type: "website",
  },
};

import { CanvasWrapper } from "@/canvas/CanvasWrapper";
import { BootScreen } from "@/components/BootScreen";
import { CommandPalette } from "@/components/CommandPalette";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { QualityControl } from "@/components/QualityControl";
import { ViewAwareLayout } from "@/components/ViewAwareLayout";
import { ScrollProvider } from "@/contexts/ScrollContext";
import { ViewProvider } from "@/contexts/ViewContext";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${dmSans.variable} ${jetbrainsMono.variable}`}>
      <body>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-background focus:text-foreground"
        >
          Skip to content
        </a>
        <ViewProvider>
          <ScrollProvider>
            {/* Boot screen — z-999, fullscreen, shown once per session */}
            <BootScreen />

            {/* Always-on Three.js canvas — z-0, decorative or interactive */}
            <CanvasWrapper />

            {/* View-aware layout — hides/shows HTML based on cinematic vs professional */}
            <ViewAwareLayout>
              <Header />
              <main id="main-content">{children}</main>
              <Footer />
            </ViewAwareLayout>

            {/* Global UI overlays */}
            <QualityControl />
            <CommandPalette />
          </ScrollProvider>
        </ViewProvider>
      </body>
    </html>
  );
}
