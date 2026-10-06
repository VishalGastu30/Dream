import careerData from "@/data/career.json";
import { resolveAllBullets, selectItems } from "@dream/resume-engine";
import type { Certification, Education, Experience, Project, ResumeProfile } from "@dream/schema";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return (careerData.resumeProfiles || []).map(
    (profile: (typeof careerData.resumeProfiles)[number]) => ({
      profileId: profile.id,
    }),
  );
}

export async function generateMetadata({
  params,
}: { params: Promise<{ profileId: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const profile = careerData.resumeProfiles.find(
    (p: (typeof careerData.resumeProfiles)[number]) => p.id === resolvedParams.profileId,
  );
  if (!profile) return {};

  return {
    title: `${careerData.profile.name} - ${profile.label} Resume`,
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default async function AtsResumePage({
  params,
}: { params: Promise<{ profileId: string }> }) {
  const resolvedParams = await params;
  const profileData = careerData.resumeProfiles.find(
    (p: (typeof careerData.resumeProfiles)[number]) => p.id === resolvedParams.profileId,
  );

  if (!profileData) {
    notFound();
  }

  const profile = profileData as ResumeProfile;
  const { profile: user, experience, projects, education, certifications } = careerData;

  // Run selection algorithm
  const selectedExperience = selectItems(
    (experience || []) as unknown as Experience[],
    profile,
    profile.sectionLimits?.experience,
  );
  const selectedProjects = selectItems(
    (projects || []) as unknown as Project[],
    profile,
    profile.sectionLimits?.projects,
  );
  const selectedEducation = (education || []) as unknown as Education[];
  const selectedCertifications = selectItems(
    (certifications || []) as unknown as Certification[],
    profile,
    profile.sectionLimits?.certifications,
  );

  // If summaryVariant does not exist as a string on user, maybe user.summary is an object or string?
  // We'll just use a fallback string or profile.label.
  const _defaultSummary = user.tagline || "";

  return (
    <div className="max-w-[210mm] mx-auto bg-white min-h-[297mm] text-black p-[15mm] font-sans text-[11pt] leading-[1.3] shadow-lg print:shadow-none print:m-0 print:max-w-none">
      <header className="border-b-2 border-black pb-2 mb-4">
        <h1 className="text-3xl font-bold uppercase tracking-wide mb-1">{user.name}</h1>
        <div className="text-sm flex flex-wrap gap-x-4 gap-y-1">
          <a href={`mailto:${user.email}`} className="text-blue-700 hover:underline">
            {user.email}
          </a>
          <span>{user.location}</span>
          <a href={`https://github.com/${user.github}`} className="text-blue-700 hover:underline">
            github.com/{user.github}
          </a>
          <a
            href={`https://linkedin.com/in/${user.linkedin}`}
            className="text-blue-700 hover:underline"
          >
            linkedin.com/in/{user.linkedin}
          </a>
        </div>
      </header>

      {/* Summary */}
      <section className="mb-4">
        <h2 className="text-lg font-bold uppercase border-b border-gray-400 mb-2">
          Professional Summary
        </h2>
        <p className="text-sm text-justify">
          {((user.summaries as Record<string, string>) &&
            (user.summaries as Record<string, string>)[profile.id]) ||
            user.tagline}
        </p>
      </section>

      {/* Experience */}
      {selectedExperience.length > 0 && (
        <section className="mb-4">
          <h2 className="text-lg font-bold uppercase border-b border-gray-400 mb-2">Experience</h2>
          <div className="space-y-3">
            {selectedExperience.map((exp: Experience) => {
              const bullets = resolveAllBullets(exp.bullets, profile);
              return (
                <div key={exp.id}>
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="font-bold">{exp.title}</h3>
                    <span className="text-sm font-semibold">
                      {exp.period.start} - {exp.period.end || "Present"}
                    </span>
                  </div>
                  <div className="flex justify-between items-baseline mb-1 text-sm italic">
                    <span>{exp.organization}</span>
                    <span>{exp.location}</span>
                  </div>
                  {bullets.length > 0 && (
                    <ul className="list-disc list-outside ml-4 text-sm space-y-1">
                      {bullets.map((b: string, i: number) => (
                        // biome-ignore lint/suspicious/noArrayIndexKey: bullet text has no stable id
                        <li key={i}>{b}</li>
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
        <section className="mb-4">
          <h2 className="text-lg font-bold uppercase border-b border-gray-400 mb-2">Projects</h2>
          <div className="space-y-3">
            {selectedProjects.map((proj: Project) => {
              const bullets = resolveAllBullets(proj.bullets, profile);
              return (
                <div key={proj.id}>
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="font-bold">
                      {proj.title}{" "}
                      <span className="font-normal italic">
                        | {proj.stack?.slice(0, 4).join(", ")}
                      </span>
                    </h3>
                    <span className="text-sm font-semibold">
                      {proj.period.start} - {proj.period.end || "Present"}
                    </span>
                  </div>
                  {bullets.length > 0 && (
                    <ul className="list-disc list-outside ml-4 text-sm space-y-1">
                      {bullets.map((b: string, i: number) => (
                        // biome-ignore lint/suspicious/noArrayIndexKey: bullet text has no stable id
                        <li key={i}>{b}</li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Education */}
      {selectedEducation && selectedEducation.length > 0 && (
        <section className="mb-4">
          <h2 className="text-lg font-bold uppercase border-b border-gray-400 mb-2">Education</h2>
          <div className="space-y-3">
            {selectedEducation.map((edu: Education) => (
              <div key={edu.id}>
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="font-bold">{edu.institution}</h3>
                  <span className="text-sm font-semibold">
                    {edu.period.start} - {edu.period.end || "Present"}
                  </span>
                </div>
                <div className="flex justify-between items-baseline mb-1 text-sm">
                  <span className="italic">{edu.degree}</span>
                  {edu.gpa && <span>GPA: {edu.gpa}</span>}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Certifications (if any fit) */}
      {selectedCertifications && selectedCertifications.length > 0 && (
        <section className="mb-4">
          <h2 className="text-lg font-bold uppercase border-b border-gray-400 mb-2">
            Certifications
          </h2>
          <div className="space-y-1 text-sm">
            {selectedCertifications.map((cert: Certification) => (
              <div key={cert.id} className="flex justify-between">
                <span className="font-bold">
                  {cert.title} <span className="font-normal italic">({cert.issuer})</span>
                </span>
                <span>{cert.period.start}</span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
