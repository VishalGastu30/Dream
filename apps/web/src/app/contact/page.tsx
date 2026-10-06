import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact | Vishal Gastu",
  description: "Get in touch.",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen pt-24 pb-16 space-y-16 max-w-2xl mx-auto px-8 flex flex-col justify-center">
      <header className="space-y-4">
        <h1 className="text-4xl md:text-5xl font-heading font-bold text-foreground tracking-tight">
          Signal Transmission
        </h1>
        <p className="text-lg text-muted font-mono leading-relaxed">
          My inbox is always open. Whether you have a question, a project idea, or just want to say
          hi, I'll try my best to get back to you!
        </p>
      </header>

      <div className="p-8 md:p-12 border border-border rounded-lg bg-accent-dim/5 text-center space-y-8">
        <div className="space-y-6">
          <p className="text-foreground font-mono font-bold text-xl md:text-2xl">
            vishalgastu30@gmail.com
          </p>
          <a
            href="mailto:vishalgastu30@gmail.com"
            className="inline-block px-8 py-4 bg-foreground text-background font-bold font-mono rounded-sm hover:bg-accent transition-colors focus-visible:ring-2 focus-visible:ring-accent outline-none"
          >
            Initiate Contact
          </a>
        </div>

        <div className="pt-8 border-t border-border flex justify-center gap-8 text-sm font-mono text-muted">
          <a
            href="https://github.com/vishalgastu"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground transition-colors focus-visible:ring-2 focus-visible:ring-accent outline-none px-2 py-1 rounded-sm"
          >
            GitHub ↗
          </a>
          <a
            href="https://linkedin.com/in/vishalgastu"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground transition-colors focus-visible:ring-2 focus-visible:ring-accent outline-none px-2 py-1 rounded-sm"
          >
            LinkedIn ↗
          </a>
        </div>
      </div>
    </div>
  );
}
