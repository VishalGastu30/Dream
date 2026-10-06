import Link from "next/link";
import { ViewToggle } from "./ViewToggle";

export function Header() {
  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-background/80 border-b border-border">
      <div className="max-w-4xl mx-auto px-8 h-16 flex items-center justify-between">
        <Link
          href="/"
          className="group flex flex-col focus-visible:ring-2 focus-visible:ring-accent rounded-sm outline-none"
        >
          <span className="font-heading font-bold text-lg tracking-wide group-hover:text-accent transition-colors">
            Vishal Gastu
          </span>
          <span className="font-mono text-[10px] uppercase tracking-widest text-muted group-hover:text-accent-dim transition-colors">
            Digital Universe
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm font-mono text-muted">
          <Link
            href="/projects"
            className="hover:text-foreground transition-colors focus-visible:ring-2 focus-visible:ring-accent outline-none px-1 rounded-sm"
          >
            Projects
          </Link>
          <Link
            href="/experience"
            className="hover:text-foreground transition-colors focus-visible:ring-2 focus-visible:ring-accent outline-none px-1 rounded-sm"
          >
            Experience
          </Link>
          <Link
            href="/forge"
            className="hover:text-foreground transition-colors focus-visible:ring-2 focus-visible:ring-accent outline-none px-1 rounded-sm"
          >
            Resume Forge
          </Link>
        </nav>

        <div className="flex items-center">
          <ViewToggle />
        </div>
      </div>
    </header>
  );
}
