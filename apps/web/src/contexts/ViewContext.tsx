"use client";

import { createContext, useContext, useEffect, useState } from "react";

type ViewMode = "professional" | "cinematic";

interface ViewContextType {
  view: ViewMode;
  setView: (view: ViewMode) => void;
}

const ViewContext = createContext<ViewContextType | undefined>(undefined);

export function ViewProvider({ children }: { children: React.ReactNode }) {
  const [view, setView] = useState<ViewMode>("professional");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("dream-view") as ViewMode;
    if (saved === "cinematic" || saved === "professional") {
      setView(saved);
    }
    setMounted(true);
  }, []);

  const handleSetView = (newView: ViewMode) => {
    setView(newView);
    localStorage.setItem("dream-view", newView);
  };

  // Prevent hydration mismatch by returning null until mounted,
  // or default to professional
  if (!mounted) {
    return <div className="contents">{children}</div>; // Render children statically without context values yet, or just render it
  }

  return (
    <ViewContext.Provider value={{ view, setView: handleSetView }}>{children}</ViewContext.Provider>
  );
}

export function useView() {
  const context = useContext(ViewContext);
  if (context === undefined) {
    // If not wrapped or not mounted, fallback to professional
    return { view: "professional" as ViewMode, setView: () => {} };
  }
  return context;
}
