import careerData from "@/data/career.json";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Resume Forge | Vishal Gastu",
  description: "Select a specialized resume profile tailored for different roles.",
};

export default function ResumeForgePage() {
  const profiles = careerData.resumeProfiles || [];

  return (
    <div className="min-h-screen pt-24 pb-16 space-y-16 max-w-4xl mx-auto px-8">
      <header className="space-y-4">
        <h1 className="text-4xl md:text-5xl font-heading font-bold text-foreground tracking-tight">
          Resume Forge
        </h1>
        <p className="text-lg text-muted font-mono max-w-2xl leading-relaxed">
          My experience dynamically reshaped for different engineering roles. Select a profile to
          view or download the tailored resume.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {profiles.map((profile: (typeof careerData.resumeProfiles)[number]) => (
          <div
            key={profile.id}
            className="p-8 border border-border rounded-lg bg-background shadow-sm space-y-6 flex flex-col"
          >
            <div className="flex-grow">
              <h2 className="text-2xl font-bold font-heading text-foreground mb-1">
                {profile.label}
              </h2>
              <p className="text-sm font-mono text-accent">
                Emphasizes:{" "}
                {Object.keys(profile.tagWeights || {})
                  .slice(0, 4)
                  .join(", ")}
              </p>
            </div>

            <div className="flex gap-4 pt-4 border-t border-border">
              <a
                href={`/resume/${profile.id}.pdf`}
                className="flex-1 py-3 text-center bg-foreground text-background font-bold font-mono rounded-sm hover:bg-accent transition-colors focus-visible:ring-2 focus-visible:ring-accent outline-none text-sm"
                download
              >
                Download ATS
              </a>
              <a
                href={`/resume/${profile.id}-sig.pdf`}
                className="flex-1 py-3 text-center bg-transparent border border-foreground text-foreground font-bold font-mono rounded-sm hover:border-accent hover:text-accent transition-colors focus-visible:ring-2 focus-visible:ring-accent outline-none text-sm"
                download
              >
                Signature PDF
              </a>
            </div>
            <div className="flex gap-4 text-xs font-mono justify-center">
              <Link href={`/resume/${profile.id}/ats`} className="text-muted hover:text-foreground">
                Preview ATS
              </Link>
              <Link
                href={`/resume/${profile.id}/signature`}
                className="text-muted hover:text-foreground"
              >
                Preview Signature
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
