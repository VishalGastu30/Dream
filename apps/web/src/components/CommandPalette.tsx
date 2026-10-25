"use client";

/**
 * components/CommandPalette.tsx
 *
 * Keyboard-accessible command palette (Ctrl/Cmd + K).
 * X0: navigation-only commands; quality and view commands will
 * be wired to the experience Director in X1+.
 */
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const COMMANDS = [
  { label: "Go to Home", path: "/" },
  { label: "Go to Projects", path: "/projects" },
  { label: "Go to Experience", path: "/experience" },
  { label: "Go to Resume Forge", path: "/forge" },
  { label: "Go to Contact", path: "/contact" },
];

export function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
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

  const filtered = COMMANDS.filter((c) => c.label.toLowerCase().includes(query.toLowerCase()));

  const handleNav = (path: string) => {
    router.push(path);
    setIsOpen(false);
    setQuery("");
  };

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
            filtered.map((cmd) => (
              <button
                key={cmd.label}
                className="w-full text-left px-3 py-3 rounded-lg hover:bg-bg-2 text-text-1 hover:text-text-0 focus:bg-bg-2 focus:outline-none transition-colors"
                onClick={() => handleNav(cmd.path)}
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
          <span>Press Enter to navigate</span>
          <span>Esc to close</span>
        </div>
      </div>
    </dialog>
  );
}
