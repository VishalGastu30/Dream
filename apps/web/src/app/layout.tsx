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
  description: "AI Engineer & Software Developer",
};

import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
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
          <Header />
          <main id="main-content">{children}</main>
          <Footer />
        </ViewProvider>
      </body>
    </html>
  );
}
