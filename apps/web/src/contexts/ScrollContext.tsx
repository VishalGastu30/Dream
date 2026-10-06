"use client";

import Lenis from "lenis";
import type React from "react";
import { createContext, useContext, useEffect, useState } from "react";

interface ScrollContextType {
  lenis: Lenis | null;
}

const ScrollContext = createContext<ScrollContextType>({ lenis: null });

export function ScrollProvider({ children }: { children: React.ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null);
  // Not using view currently, but kept for future if we want to disable on professional view

  useEffect(() => {
    // Disable smooth scroll if reduced motion is preferred
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Also might want to disable Lenis in professional view if we prefer native scrolling there,
    // but Lenis is usually fine. We'll disable it only if reduced motion.
    if (prefersReducedMotion) return;

    const lenisInstance = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - 2 ** (-10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    setLenis(lenisInstance);

    const raf = (time: number) => {
      lenisInstance.raf(time);
      requestAnimationFrame(raf);
    };

    requestAnimationFrame(raf);

    return () => {
      lenisInstance.destroy();
    };
  }, []);

  return <ScrollContext.Provider value={{ lenis }}>{children}</ScrollContext.Provider>;
}

export function useScroll() {
  return useContext(ScrollContext);
}
