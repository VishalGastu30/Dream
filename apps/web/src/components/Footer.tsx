import Link from "next/link";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border mt-20 py-8">
      <div className="max-w-4xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm font-mono text-muted">
        <div>
          <p>© {currentYear} Vishal Gastu. All rights reserved.</p>
        </div>

        <div className="flex gap-6">
          <a
            href="https://github.com/vishalgastu"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground transition-colors focus-visible:ring-2 focus-visible:ring-accent outline-none px-1 rounded-sm"
          >
            GitHub
          </a>
          <a
            href="https://linkedin.com/in/vishalgastu"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground transition-colors focus-visible:ring-2 focus-visible:ring-accent outline-none px-1 rounded-sm"
          >
            LinkedIn
          </a>
          <Link
            href="/contact"
            className="hover:text-foreground transition-colors focus-visible:ring-2 focus-visible:ring-accent outline-none px-1 rounded-sm"
          >
            Contact
          </Link>
        </div>

        <div>
          <p>Built in public.</p>
        </div>
      </div>
    </footer>
  );
}
