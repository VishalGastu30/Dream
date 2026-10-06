import careerData from "@/data/career.json";
import type { Experience } from "@dream/schema";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Experience | Vishal Gastu",
  description: "Professional experience and internships.",
};

export default function ExperiencePage() {
  const { experience } = careerData;

  return (
    <div className="min-h-screen pt-24 pb-16 space-y-16 max-w-4xl mx-auto px-8">
      <header className="space-y-4">
        <h1 className="text-4xl md:text-5xl font-heading font-bold text-foreground tracking-tight">
          Experience
        </h1>
        <p className="text-lg text-muted font-mono max-w-2xl leading-relaxed">
          Where I've worked and what I've delivered.
        </p>
      </header>

      <div className="space-y-12 relative before:absolute before:inset-0 before:ml-5 md:before:ml-8 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
        {(experience as unknown as Experience[]).map((exp, _index: number) => (
          <div key={exp.id} className="relative flex flex-col md:flex-row gap-8 items-start group">
            {/* Timeline dot */}
            <div className="absolute left-5 md:left-8 -translate-x-1/2 flex items-center justify-center w-10 h-10 rounded-full border-4 border-background bg-accent-dim text-accent shadow shrink-0 z-10 top-0">
              <div className="w-2 h-2 rounded-full bg-accent group-hover:scale-150 transition-transform duration-300" />
            </div>

            {/* Content card */}
            <div className="ml-16 md:ml-24 w-full p-8 rounded-lg border border-border bg-background shadow-sm hover:border-accent/50 hover:shadow-md transition-all duration-300 focus-visible:ring-2 focus-visible:ring-accent outline-none">
              <div className="flex flex-col md:flex-row md:justify-between md:items-baseline gap-2 mb-6">
                <div>
                  <h2 className="text-2xl font-bold font-heading">{exp.title}</h2>
                  <p className="text-lg text-accent mt-1">{exp.organization}</p>
                </div>
                <span className="text-sm font-mono text-muted uppercase tracking-widest bg-accent-dim/10 px-3 py-1 rounded-sm w-fit">
                  {exp.period.start} - {exp.period.end || "Present"}
                </span>
              </div>

              <ul className="space-y-3">
                {exp.bullets?.map((item: { text: string }, i: number) => (
                  // biome-ignore lint/suspicious/noArrayIndexKey: highlights is stable text with no stable id
                  <li key={i} className="flex gap-3 text-muted leading-relaxed">
                    <span className="text-accent shrink-0 mt-1">▹</span>
                    <span>{item.text}</span>
                  </li>
                ))}
              </ul>

              {exp.tags && exp.tags.length > 0 && (
                <div className="mt-8 pt-6 border-t border-border flex flex-wrap gap-2">
                  {exp.tags.map((tag: string) => (
                    <span
                      key={tag}
                      className="text-[10px] uppercase tracking-wider px-2 py-1 bg-accent-dim/10 text-accent rounded-sm font-mono"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
