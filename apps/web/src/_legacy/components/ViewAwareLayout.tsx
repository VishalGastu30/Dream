"use client";

/**
 * components/ViewAwareLayout.tsx
 *
 * Wraps the professional HTML layout (Header + main + Footer).
 * In cinematic mode: the entire block is visually hidden and inert.
 * In professional mode: normal display.
 *
 * Also adds the cinematic scroll spacer (500vh) that gives the page
 * its scrollable height in cinematic mode.
 */

import { useView } from "@/contexts/ViewContext";
import { ChapterNav } from "./ChapterNav";

export function ViewAwareLayout({ children }: { children: React.ReactNode }) {
  const { view } = useView();
  const isCinematic = view === "cinematic";

  return (
    <>
      {/* Professional HTML layout — hidden when cinematic */}
      <div
        style={{
          display: isCinematic ? "none" : "contents",
        }}
        aria-hidden={isCinematic}
      >
        {children}
      </div>

      {/* Cinematic scroll spacer — 500vh gives the canvas its scroll timeline */}
      {isCinematic && (
        <div aria-hidden="true" style={{ height: "500vh", position: "relative", zIndex: 1 }} />
      )}

      {/* Chapter navigation dots — only in cinematic mode */}
      <ChapterNav />
    </>
  );
}
