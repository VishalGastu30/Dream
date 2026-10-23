import careerData from "@/data/career.json";
import type { Experience } from "@dream/schema";
import Link from "next/link";

export const revalidate = 86400; // Revalidate GitHub stats once per day

// Fetch GitHub profile stats at build time (server component)
async function getGitHubStats() {
  try {
    const res = await fetch(`https://api.github.com/users/${careerData.profile.github}`, {
      headers: {
        Accept: "application/vnd.github.v3+json",
        // Token not required for public data, but add if rate limits hit:
        // Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      },
      next: { revalidate: 86400 },
    });
    if (!res.ok) return null;
    const data = (await res.json()) as {
      public_repos: number;
      followers: number;
    };
    return { repos: data.public_repos, followers: data.followers };
  } catch {
    return null;
  }
}

export default async function Home() {
  const { profile, projects, experience, assets } = careerData;
  const githubStats = await getGitHubStats();

  const featuredProjects = projects.slice(0, 3);

  type Asset = (typeof careerData.assets)[number];
  const getProjectImage = (projectId: string) => {
    const asset = assets.find((a: Asset) => a.id === `proj-img-${projectId}`);
    return asset ? `/${asset.file}` : "/assets/images/projects/general.webp";
  };

  return (
    <div className="pt-24 pb-16 space-y-32">
      {/* ── Hero ───────────────────────────────────────────────────────────── */}
      <section className="space-y-6 max-w-4xl mx-auto px-8">
        {/* GitHub stats badge */}
        {githubStats && (
          <a
            href={`https://github.com/${profile.github}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-3 py-1.5 rounded-full border border-border text-xs font-mono text-muted hover:border-accent/50 hover:text-foreground transition-all duration-200 group"
            aria-label={`GitHub: ${githubStats.repos} public repos, ${githubStats.followers} followers`}
          >
            <span className="flex items-center gap-1.5">
              {/* GitHub icon */}
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
                className="text-muted group-hover:text-foreground transition-colors"
              >
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              {profile.github}
            </span>
            <span className="w-px h-3 bg-border" aria-hidden="true" />
            <span>{githubStats.repos} repos</span>
            {githubStats.followers > 0 && (
              <>
                <span className="w-px h-3 bg-border" aria-hidden="true" />
                <span>{githubStats.followers} followers</span>
              </>
            )}
          </a>
        )}

        <div className="space-y-2">
          <h1 className="text-5xl md:text-7xl font-heading font-bold text-foreground tracking-tight">
            {profile.displayName}
          </h1>
          <p className="text-xl md:text-2xl text-accent font-mono tracking-tight">
            {profile.title}
          </p>
        </div>

        <p className="text-lg md:text-xl text-muted max-w-2xl leading-relaxed">{profile.tagline}</p>

        <div className="flex flex-wrap gap-4 pt-2">
          <Link
            href="/projects"
            className="px-6 py-3 bg-foreground text-background font-bold font-mono rounded-sm hover:bg-accent transition-colors focus-visible:ring-2 focus-visible:ring-accent outline-none"
          >
            View Projects
          </Link>
          <Link
            href="/forge"
            className="px-6 py-3 border border-border text-foreground font-mono rounded-sm hover:bg-accent-dim/20 transition-colors focus-visible:ring-2 focus-visible:ring-accent outline-none"
          >
            Resume Forge
          </Link>
        </div>

        {/* Open to work signal */}
        {profile.openToOpportunities && (
          <div className="flex items-center gap-2 pt-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" aria-hidden="true" />
            <span className="text-xs font-mono text-muted">Open to opportunities</span>
          </div>
        )}
      </section>

      {/* ── Featured Projects ──────────────────────────────────────────────── */}
      <section className="space-y-8">
        <div className="max-w-4xl mx-auto px-8 flex justify-between items-end">
          <h2 className="text-3xl font-heading font-bold tracking-tight">Featured Work</h2>
          <Link
            href="/projects"
            className="text-accent hover:text-foreground font-mono text-sm transition-colors"
          >
            View all →
          </Link>
        </div>

        <div className="w-full overflow-x-auto pb-8 snap-x snap-mandatory hide-scrollbar">
          <div className="flex gap-6 px-8 max-w-4xl mx-auto w-max md:w-auto md:grid md:grid-cols-3 md:snap-none md:overflow-visible">
            {featuredProjects.map((project: (typeof careerData.projects)[number]) => (
              <Link
                href={`/projects/${project.id}`}
                key={project.id}
                className="group flex-shrink-0 w-80 md:w-auto snap-center bg-background border border-border rounded-lg overflow-hidden hover:border-accent/50 hover:shadow-lg hover:shadow-accent/5 transition-all duration-300 focus-visible:ring-2 focus-visible:ring-accent outline-none flex flex-col"
              >
                <div className="aspect-[4/3] w-full bg-border relative overflow-hidden">
                  <img
                    src={getProjectImage(project.id)}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                </div>

                <div className="p-6 flex flex-col flex-grow space-y-4">
                  <div className="space-y-1">
                    <h3 className="text-xl font-bold font-heading group-hover:text-accent transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-sm text-muted line-clamp-2">{project.tagline}</p>
                  </div>

                  <div className="mt-auto flex flex-wrap gap-2 pt-2">
                    {project.tags?.slice(0, 3).map((tag: string) => (
                      <span
                        key={tag}
                        className="text-[10px] uppercase tracking-wider px-2 py-1 bg-accent-dim/10 text-accent rounded-sm font-mono"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Experience Timeline ────────────────────────────────────────────── */}
      <section className="space-y-8 max-w-4xl mx-auto px-8">
        <h2 className="text-3xl font-heading font-bold tracking-tight">Experience</h2>
        <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
          {(experience as unknown as Experience[]).map((exp, _index: number) => (
            <div
              key={exp.id}
              className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active"
            >
              <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-background bg-accent-dim text-accent shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                <div className="w-2 h-2 rounded-full bg-accent" />
              </div>

              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 rounded-lg border border-border bg-background shadow-sm hover:shadow-md transition-shadow">
                <div className="flex flex-col space-y-1 mb-3">
                  <span className="text-xs font-mono text-accent">
                    {exp.period.start} — {exp.period.end || "Present"}
                  </span>
                  <h3 className="text-lg font-bold font-heading">{exp.title}</h3>
                  <span className="text-sm text-muted">{exp.organization}</span>
                </div>
                <ul className="list-none space-y-2 text-sm text-muted">
                  {exp.bullets?.slice(0, 2).map((item: { text: string }, i: number) => (
                    // biome-ignore lint/suspicious/noArrayIndexKey: highlights is a fixed text list with no stable id
                    <li key={i} className="flex gap-2">
                      <span className="text-accent">▹</span>
                      <span>{item.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
