import careerData from '@/data/career.json';

export default function Home() {
  const { profile, projects, experience } = careerData;

  return (
    <div className="min-h-screen p-8 max-w-4xl mx-auto space-y-16">
      <header className="space-y-4">
        <h1 className="text-5xl font-heading font-bold text-accent">
          {profile.displayName}
        </h1>
        <p className="text-xl text-muted font-mono">{profile.title}</p>
        <p className="text-lg max-w-2xl leading-relaxed">
          {profile.summary}
        </p>
      </header>

      <section className="space-y-8">
        <h2 className="text-3xl font-heading font-semibold border-b border-border pb-2">
          Experience
        </h2>
        <div className="space-y-8">
          {experience.map((exp: any) => (
            <div key={exp.id} className="space-y-2">
              <div className="flex justify-between items-baseline">
                <h3 className="text-xl font-bold">{exp.role}</h3>
                <span className="text-sm text-muted font-mono">
                  {exp.period.start} - {exp.period.end || 'Present'}
                </span>
              </div>
              <p className="text-accent-dim">{exp.company}</p>
              <ul className="list-disc list-inside space-y-1 text-muted">
                {exp.highlights?.slice(0, 3).map((item: string, i: number) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-8">
        <h2 className="text-3xl font-heading font-semibold border-b border-border pb-2">
          Featured Projects
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((project: any) => (
            <div key={project.id} className="border border-border p-6 rounded-lg space-y-4 bg-accent-dim/10">
              <h3 className="text-2xl font-bold text-accent">{project.title}</h3>
              <p className="text-muted">{project.tagline}</p>
              <div className="flex flex-wrap gap-2 mt-4">
                {project.tags?.slice(0, 4).map((tag: string) => (
                  <span key={tag} className="text-xs px-2 py-1 bg-border rounded-full font-mono">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
