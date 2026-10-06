"use client";

import { useProgress } from "@react-three/drei";
import { useEffect, useState } from "react";

export function CinematicLoader() {
  const { active, progress, errors, item, loaded, total } = useProgress();
  const [show, setShow] = useState(true);

  useEffect(() => {
    if (!active && progress === 100) {
      const timer = setTimeout(() => setShow(false), 500); // Wait a bit before hiding
      return () => clearTimeout(timer);
    }
    if (active) {
      setShow(true);
    }
  }, [active, progress]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-bg-0 pointer-events-none">
      <div className="w-64 space-y-4">
        <div className="flex justify-between text-xs font-mono text-signal">
          <span>INITIALIZING</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="h-1 w-full bg-border rounded overflow-hidden">
          <div 
            className="h-full bg-signal transition-all duration-200 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="text-[10px] font-mono text-text-2 text-center truncate">
          {item || "Loading assets..."}
        </div>
        {errors.length > 0 && (
          <div className="text-[10px] font-mono text-red-500 text-center">
            Errors encountered. See console.
          </div>
        )}
      </div>
    </div>
  );
}
