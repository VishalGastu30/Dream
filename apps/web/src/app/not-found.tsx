import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
      <h1 className="text-6xl font-heading font-bold text-accent">404</h1>
      <p className="text-xl text-muted font-mono">Signal lost. Sector empty.</p>
      <Link
        href="/"
        className="px-6 py-2 border border-border text-foreground hover:bg-accent hover:text-background transition-cinematic duration-300"
      >
        Return to origin
      </Link>
    </div>
  );
}
