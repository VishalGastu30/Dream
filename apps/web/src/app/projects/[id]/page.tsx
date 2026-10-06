import careerData from "@/data/career.json";
import type { Project } from "@dream/schema";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export function generateStaticParams() {
  const projects = careerData.projects as unknown as Project[];
  return projects.map((project) => ({
    id: project.id,
  }));
}

export async function generateMetadata({
  params,
}: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const projects = careerData.projects as unknown as Project[];
  const project = projects.find((p) => p.id === resolvedParams.id);
  if (!project) return {};

  return {
    title: `${project.title} | Vishal Gastu`,
    description: project.tagline,
  };
}

export default async function ProjectDetail({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const projects = careerData.projects as unknown as Project[];
  const project = projects.find((p) => p.id === resolvedParams.id);

  if (!project) {
    notFound();
  }

  type Asset = (typeof careerData.assets)[number];
  const getProjectImage = (projectId: string) => {
    const asset = careerData.assets.find((a: Asset) => a.id === `proj-img-${projectId}`);
    return asset ? `/${asset.file}` : "/assets/images/projects/general.webp";
  };

  return (
    <div className="min-h-screen pt-24 pb-24 space-y-16 max-w-3xl mx-auto px-8">
      <Link
        href="/projects"
        className="text-accent hover:text-foreground font-mono text-sm transition-colors inline-block focus-visible:ring-2 focus-visible:ring-accent outline-none px-2 py-1 rounded-sm -ml-2"
      >
        ← Back to Projects
      </Link>

      <header className="space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl md:text-6xl font-heading font-bold text-foreground tracking-tight">
            {project.title}
          </h1>
          <p className="text-xl md:text-2xl text-muted font-mono leading-relaxed">
            {project.tagline}
          </p>
        </div>

        <div className="flex flex-wrap items-start gap-x-12 gap-y-6 text-sm font-mono text-muted border-y border-border py-6">
          <div className="space-y-2">
            <span className="block uppercase text-[10px] tracking-widest text-accent-dim">
              Timeline
            </span>
            <span className="text-foreground">
              {project.period.start} - {project.period.end || "Present"}
            </span>
          </div>

          <div className="space-y-2">
            <span className="block uppercase text-[10px] tracking-widest text-accent-dim">
              Stack
            </span>
            <div className="flex flex-col gap-1">
              {project.stack?.slice(0, 4).map((s: string) => (
                <span key={s} className="text-foreground">
                  {s}
                </span>
              ))}
            </div>
          </div>

          {(project.links || []).length > 0 && (
            <div className="space-y-2">
              <span className="block uppercase text-[10px] tracking-widest text-accent-dim">
                Links
              </span>
              <div className="flex flex-col gap-1">
                {project.links.map((link: (typeof project.links)[number]) => (
                  <a
                    key={link.url}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent hover:text-foreground underline decoration-accent/30 underline-offset-4 focus-visible:ring-2 focus-visible:ring-accent outline-none rounded-sm"
                  >
                    {link.label} ↗
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </header>

      <div className="aspect-[21/9] w-full bg-border rounded-lg overflow-hidden border border-border">
        <img
          src={getProjectImage(project.id)}
          alt={project.title}
          className="w-full h-full object-cover"
        />
      </div>

      <article className="prose prose-invert prose-p:text-muted prose-p:leading-relaxed prose-headings:text-foreground prose-headings:font-heading prose-a:text-accent prose-a:decoration-accent/30 hover:prose-a:decoration-accent prose-a:underline-offset-4 prose-li:text-muted prose-strong:text-foreground max-w-none">
        {/* biome-ignore lint/suspicious/noExplicitAny: Required to access body which is missing from schema */}
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{(project as any).body}</ReactMarkdown>
      </article>

      {/* Footer tags */}
      <div className="pt-12 border-t border-border">
        <div className="flex flex-wrap gap-2">
          {project.tags?.map((tag: string) => (
            <span
              key={tag}
              className="text-[10px] uppercase tracking-wider px-3 py-1.5 bg-accent-dim/10 text-accent rounded-sm font-mono"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
