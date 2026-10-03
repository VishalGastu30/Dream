import type { Metadata, Viewport } from "next";
import { SkipLink } from "@/components/SkipLink";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Vishal Gastu // Digital Universe",
    template: "%s — Vishal Gastu",
  },
  description:
    "Creating what doesn't exist yet, and building it well enough to change what comes next.",
  metadataBase: new URL(
    process.env["SITE_URL"] ?? "https://your-project.pages.dev",
  ),
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Vishal Gastu // Digital Universe",
  },
};

export const viewport: Viewport = {
  // Near-white signal colour per brand-brief.md
  themeColor: "#F2F4F8",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {/* SkipLink is a Client Component — event handlers require "use client" */}
        <SkipLink />
        {children}
      </body>
    </html>
  );
}
