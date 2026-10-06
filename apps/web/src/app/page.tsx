import careerData from "@/data/career.json";
import Link from "next/link";

export default function Home() {
  const { profile, projects, experience, assets } = careerData;

  // We should pick the top 3 projects for the home page.
  const featuredProjects = projects.slice(0, 3);

  const getProjectImage = (projectId: string) => {
    const asset = assets.find((a: any) => a.id === `proj-img-${projectId}`);
    return asset ? `/${asset.file}` : "/assets/images/projects/general.webp";
  };

  return (
    <div className="min-h-screen pt-24 pb-16 space-y-32">
      {/* Hero Section */}
      <section className="space-y-8 max-w-4xl mx-auto px-8">
        <div className="space-y-2">
          <h1 className="text-5xl md:text-7xl font-heading font-bold text-foreground tracking-tight">
            {profile.displayName}
          </h1>
          <p className="text-xl md:text-2xl text-accent font-mono tracking-tight">
            {profile.title}
          </p>
        </div>

        <p className="text-lg md:text-xl text-muted max-w-2xl leading-relaxed">{profile.tagline}</p>

        <div className="flex flex-wrap gap-4 pt-4">
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
      </section>

      {/* Featured Projects Strip */}
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
            {featuredProjects.map((project: any) => (
              <Link
                href={`/projects/${project.id}`}
                key={project.id}
                className="group flex-shrink-0 w-80 md:w-auto snap-center bg-background border border-border rounded-lg overflow-hidden hover:border-accent/50 hover:shadow-lg hover:shadow-accent/5 transition-all duration-300 focus-visible:ring-2 focus-visible:ring-accent outline-none flex flex-col"
              >
                <div className="aspect-[4/3] w-full bg-border relative overflow-hidden">
                  {/* We use a standard img tag because next/image requires server optimization which is disabled in static export */}
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

      {/* Experience Timeline */}
      <section className="space-y-8 max-w-4xl mx-auto px-8">
        <h2 className="text-3xl font-heading font-bold tracking-tight">Experience</h2>
        <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
          {experience.map((exp: any, _index: number) => (
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
                    {exp.period.start} - {exp.period.end || "Present"}
                  </span>
                  <h3 className="text-lg font-bold font-heading">{exp.role}</h3>
                  <span className="text-sm text-muted">{exp.company}</span>
                </div>
                <ul className="list-none space-y-2 text-sm text-muted">
                  {exp.highlights?.slice(0, 2).map((item: string, i: number) => (
                    <li key={i} className="flex gap-2">
                      <span className="text-accent">▹</span>
                      <span>{item}</span>
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
