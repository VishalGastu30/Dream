import careerData from "@/data/career.json";
import { resolveAllBullets, selectItems } from "@dream/resume-engine";
import type { ResumeProfile } from "@dream/schema";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return (careerData.resumeProfiles || []).map((profile: any) => ({
    profileId: profile.id,
  }));
}

export async function generateMetadata({
  params,
}: { params: Promise<{ profileId: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const profile = careerData.resumeProfiles.find((p: any) => p.id === resolvedParams.profileId);
  if (!profile) return {};

  return {
    title: `${careerData.profile.name} - ${profile.label} Resume (Signature)`,
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default async function SignatureResumePage({
  params,
}: { params: Promise<{ profileId: string }> }) {
  const resolvedParams = await params;
  const profileData = careerData.resumeProfiles.find((p: any) => p.id === resolvedParams.profileId);

  if (!profileData) {
    notFound();
  }

  const profile = profileData as ResumeProfile;
  const { profile: user, experience, projects, education, certifications } = careerData;

  const selectedExperience = selectItems(
    experience || [],
    profile,
    profile.sectionLimits?.experience,
  );
  const selectedProjects = selectItems(projects || [], profile, profile.sectionLimits?.projects);
  const selectedEducation = education;
  const selectedCertifications = selectItems(
    certifications || [],
    profile,
    profile.sectionLimits?.certifications,
  );

  return (
    <div className="max-w-[210mm] mx-auto bg-background min-h-[297mm] text-foreground p-[15mm] font-mono text-[10pt] leading-[1.4] shadow-xl border border-border print:shadow-none print:m-0 print:border-none print:max-w-none">
      <header className="mb-8 border-b border-border pb-4 flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-heading font-bold text-foreground mb-2">{user.name}</h1>
          <p className="text-accent text-sm uppercase tracking-widest">{profile.label}</p>
        </div>
        <div className="text-right text-xs text-muted space-y-1">
          <p>{user.email}</p>
          <p>{user.location}</p>
          <p>github.com/{user.github}</p>
          <p>linkedin.com/in/{user.linkedin}</p>
        </div>
      </header>

      {/* Summary */}
      <section className="mb-6">
        <h2 className="text-sm font-bold uppercase tracking-widest text-accent-dim mb-2 border-b border-border/50 pb-1">
          Profile
        </h2>
        <p className="text-xs text-muted leading-relaxed">
          {((user.summaries as Record<string, string>) &&
            (user.summaries as Record<string, string>)[profile.id]) ||
            user.tagline}
        </p>
      </section>

      {/* Experience */}
      {selectedExperience.length > 0 && (
        <section className="mb-6">
          <h2 className="text-sm font-bold uppercase tracking-widest text-accent-dim mb-3 border-b border-border/50 pb-1">
            Experience
          </h2>
          <div className="space-y-4">
            {selectedExperience.map((exp: any) => {
              const bullets = resolveAllBullets(exp.bullets, profile);
              return (
                <div key={exp.id}>
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="font-bold text-foreground">
                      {exp.role}{" "}
                      <span className="text-muted font-normal">
                        at {exp.company || exp.organization}
                      </span>
                    </h3>
                    <span className="text-[9pt] text-accent-dim">
                      {exp.period.start} - {exp.period.end || "Present"}
                    </span>
                  </div>
                  {bullets.length > 0 && (
                    <ul className="text-xs text-muted space-y-1.5 mt-2">
                      {bullets.map((b: string, i: number) => (
                        <li key={i} className="flex gap-2">
                          <span className="text-accent select-none">▹</span>
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Projects */}
      {selectedProjects.length > 0 && (
        <section className="mb-6">
          <h2 className="text-sm font-bold uppercase tracking-widest text-accent-dim mb-3 border-b border-border/50 pb-1">
            Featured Projects
          </h2>
          <div className="space-y-4">
            {selectedProjects.map((proj: any) => {
              const bullets = resolveAllBullets(proj.bullets, profile);
              return (
                <div key={proj.id}>
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="font-bold text-foreground">{proj.title}</h3>
                    <span className="text-[9pt] text-accent-dim">
                      {proj.period.start} - {proj.period.end || "Present"}
                    </span>
                  </div>
                  <div className="text-[9pt] text-accent mb-2">
                    {proj.stack?.slice(0, 5).join(" · ")}
                  </div>
                  {bullets.length > 0 && (
                    <ul className="text-xs text-muted space-y-1.5">
                      {bullets.map((b: string, i: number) => (
                        <li key={i} className="flex gap-2">
                          <span className="text-accent select-none">▹</span>
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      <div className="grid grid-cols-2 gap-8">
        {/* Education */}
        {selectedEducation && selectedEducation.length > 0 && (
          <section>
            <h2 className="text-sm font-bold uppercase tracking-widest text-accent-dim mb-3 border-b border-border/50 pb-1">
              Education
            </h2>
            <div className="space-y-3">
              {selectedEducation.map((edu: any) => (
                <div key={edu.id}>
                  <h3 className="font-bold text-foreground text-xs">{edu.institution}</h3>
                  <div className="text-[9pt] text-muted">
                    {edu.degree} in {edu.major}
                  </div>
                  <div className="text-[9pt] text-accent-dim mt-0.5">
                    {edu.period.start} - {edu.period.end || "Present"}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Certifications */}
        {selectedCertifications && selectedCertifications.length > 0 && (
          <section>
            <h2 className="text-sm font-bold uppercase tracking-widest text-accent-dim mb-3 border-b border-border/50 pb-1">
              Certifications
            </h2>
            <div className="space-y-3">
              {selectedCertifications.map((cert: any) => (
                <div key={cert.id}>
                  <h3 className="font-bold text-foreground text-xs">{cert.title}</h3>
                  <div className="text-[9pt] text-muted">{cert.issuer}</div>
                  <div className="text-[9pt] text-accent-dim mt-0.5">{cert.date}</div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
