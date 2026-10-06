"use client";

import { useSceneStore } from "@/canvas/store/scene.store";
import { useView } from "@/contexts/ViewContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const { setQuality } = useSceneStore();
  const { view, setView } = useView();
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleAction = (action: () => void) => {
    action();
    setIsOpen(false);
  };

  const commands = [
    {
      label: "Switch to Professional View",
      action: () => setView(view === "professional" ? "cinematic" : "professional"),
      show: view !== "professional",
    },
    {
      label: "Switch to Cinematic View",
      action: () => setView("cinematic"),
      show: view === "professional",
    },
    { label: "Go to Home", action: () => router.push("/") },
    { label: "Go to Projects", action: () => router.push("/projects") },
    { label: "Go to Experience", action: () => router.push("/experience") },
    { label: "Set Quality: High", action: () => setQuality("high") },
    { label: "Set Quality: Auto", action: () => setQuality("auto") },
    { label: "Set Quality: Low", action: () => setQuality("low") },
  ].filter((c) => c.show !== false);

  const filtered = commands.filter((c) => c.label.toLowerCase().includes(query.toLowerCase()));

  return (
    <dialog
      open
      className="fixed inset-0 z-[200] w-full h-full flex items-start justify-center pt-32 bg-bg-0/50 backdrop-blur-md p-4 border-none"
      aria-modal="true"
      aria-label="Command palette"
      onClick={(e) => {
        if (e.target === e.currentTarget) setIsOpen(false);
      }}
      onKeyDown={(e) => {
        if (e.key === "Escape") setIsOpen(false);
      }}
    >
      <div className="w-full max-w-lg bg-bg-1 border border-border rounded-xl shadow-2xl overflow-hidden flex flex-col">
        <input
          // biome-ignore lint/a11y/noAutofocus: Command palette needs immediate focus for usability
          autoFocus
          className="w-full bg-transparent px-4 py-4 text-text-0 placeholder:text-text-2 border-b border-border focus:outline-none focus:ring-0 text-lg"
          placeholder="Type a command or search..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <div className="max-h-96 overflow-y-auto p-2 flex flex-col gap-1">
          {filtered.length > 0 ? (
            filtered.map((cmd, _i) => (
              <button
                key={cmd.label}
                className="w-full text-left px-3 py-3 rounded-lg hover:bg-bg-2 text-text-1 hover:text-text-0 focus:bg-bg-2 focus:outline-none transition-colors"
                onClick={() => handleAction(cmd.action)}
                type="button"
              >
                {cmd.label}
              </button>
            ))
          ) : (
            <div className="px-4 py-8 text-center text-text-2 text-sm">
              No results found for "{query}"
            </div>
          )}
        </div>
        <div className="bg-bg-2/50 px-4 py-2 border-t border-border flex justify-between items-center text-xs text-text-2">
          <span>Navigate with ⬆️ ⬇️ (Coming soon)</span>
          <span>esc to close</span>
        </div>
      </div>
    </dialog>
  );
}
