import { useState, useEffect } from "react";

export function FpsMonitor() {
  const [fps, setFps] = useState(0);

  useEffect(() => {
    let frameCount = 0;
    let lastTime = performance.now();
    let animationFrameId: number;

    const updateFps = () => {
      const now = performance.now();
      frameCount++;
      if (now - lastTime >= 1000) {
        setFps(Math.round((frameCount * 1000) / (now - lastTime)));
        frameCount = 0;
        lastTime = now;
      }
      animationFrameId = requestAnimationFrame(updateFps);
    };

    animationFrameId = requestAnimationFrame(updateFps);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return (
    <div
      style={{
        position: "absolute",
        top: 10,
        left: 10,
        background: "rgba(0,0,0,0.8)",
        color: "#0f0",
        padding: "8px 12px",
        fontFamily: "monospace",
        fontSize: "16px",
        zIndex: 1000,
        pointerEvents: "none",
        borderRadius: "4px",
      }}
    >
      FPS: {fps}
    </div>
  );
}
