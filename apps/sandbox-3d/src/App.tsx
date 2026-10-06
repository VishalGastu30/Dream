import { useState } from "react";
import TestA from "./tests/TestA_SplineBloom";
import TestB from "./tests/TestB_InstancedStars";
import TestC from "./tests/TestC_UnifiedMaterial";
import { FpsMonitor } from "./utils/FpsMonitor";

function App() {
  const [currentTest, setCurrentTest] = useState<"A" | "B" | "C">("A");

  return (
    <div style={{ width: "100vw", height: "100vh", overflow: "hidden", position: "relative" }}>
      <FpsMonitor />

      <div
        style={{
          position: "absolute",
          bottom: 20,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 1000,
          display: "flex",
          gap: "10px",
        }}
      >
        <button onClick={() => setCurrentTest("A")} style={btnStyle(currentTest === "A")}>
          Test A (Spline + Bloom)
        </button>
        <button onClick={() => setCurrentTest("B")} style={btnStyle(currentTest === "B")}>
          Test B (20k Stars)
        </button>
        <button onClick={() => setCurrentTest("C")} style={btnStyle(currentTest === "C")}>
          Test C (Unified Material)
        </button>
      </div>

      {currentTest === "A" && <TestA />}
      {currentTest === "B" && <TestB />}
      {currentTest === "C" && <TestC />}
    </div>
  );
}

const btnStyle = (active: boolean) => ({
  padding: "10px 16px",
  background: active ? "#4A90E2" : "#333",
  color: "#fff",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
  fontWeight: "bold",
  fontFamily: "sans-serif",
});

export default App;
