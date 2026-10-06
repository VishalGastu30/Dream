import careerData from "@/data/career.json";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Projects | Vishal Gastu",
  description: "Featured projects and technical case studies.",
};

export default function ProjectsIndex() {
  const { projects, assets } = careerData;

  type Asset = (typeof careerData.assets)[number];
  const getProjectImage = (projectId: string) => {
    const asset = assets.find((a: Asset) => a.id === `proj-img-${projectId}`);
    return asset ? `/${asset.file}` : "/assets/images/projects/general.webp";
  };

  return (
    <div className="min-h-screen pt-24 pb-16 space-y-16 max-w-4xl mx-auto px-8">
      <header className="space-y-4">
        <h1 className="text-4xl md:text-5xl font-heading font-bold text-foreground tracking-tight">
          Projects
        </h1>
        <p className="text-lg text-muted font-mono max-w-2xl leading-relaxed">
          A selection of things I've built, ranging from AI infrastructure to front-end
          architecture.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {projects.map((project: (typeof careerData.projects)[number]) => (
          <Link
            href={`/projects/${project.id}`}
            key={project.id}
            className="group bg-background border border-border rounded-lg overflow-hidden hover:border-accent/50 hover:shadow-lg hover:shadow-accent/5 transition-all duration-300 focus-visible:ring-2 focus-visible:ring-accent outline-none flex flex-col"
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
              <div className="space-y-2">
                <h2 className="text-2xl font-bold font-heading group-hover:text-accent transition-colors">
                  {project.title}
                </h2>
                <p className="text-xs font-mono text-accent-dim uppercase tracking-widest">
                  {project.period.start} - {project.period.end || "Present"}
                </p>
                <p className="text-sm text-muted line-clamp-3 leading-relaxed">{project.tagline}</p>
              </div>

              <div className="mt-auto flex flex-wrap gap-2 pt-4">
                {project.tags?.slice(0, 4).map((tag: string) => (
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
  );
}
