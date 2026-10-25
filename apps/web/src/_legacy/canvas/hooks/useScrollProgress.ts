"use client";

import { useScroll } from "@/contexts/ScrollContext";
import { useEffect } from "react";
import { useSceneStore } from "../store/scene.store";

export function useScrollProgress() {
  const { setDotProgress } = useSceneStore();
  const { lenis } = useScroll();

  useEffect(() => {
    let ticking = false;

    if (lenis) {
      // Lenis smooth scroll progress
      const onScroll = (e: { progress: number }) => {
        setDotProgress(e.progress);
      };
      lenis.on("scroll", onScroll);
      return () => lenis.off("scroll", onScroll);
    }
    // Native scroll fallback (reduced motion)
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const h = document.documentElement;
          const b = document.body;
          const st = "scrollTop";
          const sh = "scrollHeight";
          // @ts-ignore
          const progress = (h[st] || b[st]) / ((h[sh] || b[sh]) - h.clientHeight);
          setDotProgress(Number.isNaN(progress) ? 0 : progress);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [lenis, setDotProgress]);
}
