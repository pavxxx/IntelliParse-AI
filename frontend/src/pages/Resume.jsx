import PageHeader from '../components/ui/PageHeader';
import ResumeSection from '../components/resume/ResumeSection';
import SkillBadge from '../components/resume/SkillBadge';
import Button from '../components/ui/Button';

const Resume = ({ onBackToUpload, resumeData }) => {
  if (!resumeData) {
    return (
      <div className="text-center py-20 font-bold uppercase">
        No resume data available.
      </div>
    );
  }

  // Ensure arrays are safely normalized
  const skills = Array.isArray(resumeData.skills) ? resumeData.skills : [];
  const experience = Array.isArray(resumeData.experience) ? resumeData.experience : [];
  const education = Array.isArray(resumeData.education) ? resumeData.education : [];
  const projects = Array.isArray(resumeData.projects) ? resumeData.projects : [];
  const certifications = Array.isArray(resumeData.certifications) ? resumeData.certifications : [];

  return (
    <div className="space-y-8 max-w-4xl mx-auto font-mono">
      <PageHeader
        title="DOCUMENT ANALYSIS REPORT"
        subtitle="AI PARSED DOCUMENT"
        statusTag="AI GENERATED"
        action={
          <Button variant="outline" size="sm" onClick={onBackToUpload}>
            ← NEW ANALYSIS
          </Button>
        }
      />

      <div className="border-3 border-[#111111] bg-white p-8 space-y-6">
        <div className="border-b-3 border-[#111111] pb-4 flex justify-between items-center">
          <div className="text-xs font-extrabold uppercase tracking-widest text-[#111111]/70">
            TECHNICAL REPORT SPECIFICATION
          </div>
        </div>

        {/* CANDIDATE IDENTITY */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 border-b-3 border-[#111111] pb-6">
          <div>
            <div className="text-xs font-extrabold uppercase tracking-wider text-[#111111]/60 mb-1">
              NAME
            </div>
            <div className="text-xl font-extrabold uppercase text-[#111111]">
              {resumeData.name || 'N/A'}
            </div>
          </div>
          <div>
            <div className="text-xs font-extrabold uppercase tracking-wider text-[#111111]/60 mb-1">
              EMAIL
            </div>
            <div className="text-base font-bold text-[#111111]">
              {resumeData.email || 'N/A'}
            </div>
          </div>
          <div>
            <div className="text-xs font-extrabold uppercase tracking-wider text-[#111111]/60 mb-1">
              PHONE
            </div>
            <div className="text-base font-bold text-[#111111]">
              {resumeData.phone || 'N/A'}
            </div>
            <div className="mt-2">
              <div className="text-xs font-extrabold uppercase tracking-wider text-[#111111]/60 mb-1">
                GITHUB
              </div>
              <div className="text-base font-bold text-[#111111]">
                {resumeData.github || 'N/A'}
              </div>
            </div>
            <div className="mt-2">
              <div className="text-xs font-extrabold uppercase tracking-wider text-[#111111]/60 mb-1">
                LINKEDIN
              </div>
              <div className="text-base font-bold text-[#111111]">
                {resumeData.linkedin || 'N/A'}
              </div>
            </div>
          </div>
        </div>

        {/* SKILLS MATRIX */}
        <ResumeSection title="TECHNICAL SKILLS">
          <div className="flex flex-wrap gap-2 pt-2">
            {skills.length > 0 ? (
              skills.map((skill, index) => (
                <SkillBadge
                  key={index}
                  skill={typeof skill === 'string' ? skill : JSON.stringify(skill)}
                  variant={index % 2 === 0 ? 'accent' : 'default'}
                />
              ))
            ) : (
              <p className="text-sm text-[#111111]/60 font-bold">No skills found.</p>
            )}
          </div>
        </ResumeSection>

        {/* EXPERIENCE */}
        <ResumeSection title="PROFESSIONAL EXPERIENCE">
          <div className="space-y-4">
            {experience.length > 0 ? (
              experience.map((exp, index) => {
                const rawItems = exp.responsibilities || exp.description || exp.details || [];
                const items = Array.isArray(rawItems)
                  ? rawItems
                  : typeof rawItems === 'string'
                  ? [rawItems]
                  : [];

                return (
                  <div
                    key={index}
                    className="border-b-2 border-[#111111]/20 pb-3"
                  >
                    <div className="flex justify-between items-start font-bold">
                      <span className="text-lg uppercase">
                        {exp.title || exp.role || 'Position'}
                      </span>
                      <span className="text-xs bg-[#111111] text-white px-2 py-0.5">
                        {exp.period || exp.duration || exp.dates || ''}
                      </span>
                    </div>

                    <p className="text-xs font-bold text-[#111111]/70 uppercase mt-1">
                      {exp.company || exp.organization || ''}
                    </p>

                    {items.length > 0 && (
                      <div className="mt-2 space-y-1">
                        {items.map((item, i) => (
                          <p key={i} className="text-sm">
                            • {typeof item === 'string' ? item : JSON.stringify(item)}
                          </p>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <p className="text-sm text-[#111111]/60 font-bold">No experience listed.</p>
            )}
          </div>
        </ResumeSection>

        {/* EDUCATION */}
        <ResumeSection title="EDUCATION">
          <div className="space-y-4">
            {education.length > 0 ? (
              education.map((edu, index) => (
                <div
                  key={index}
                  className="flex justify-between items-start font-bold border-b-2 border-[#111111]/20 pb-3"
                >
                  <div>
                    <span className="text-lg uppercase">
                      {edu.degree || edu.field || 'Degree'}
                    </span>

                    <p className="text-xs font-bold text-[#111111]/70 uppercase mt-1">
                      {edu.institution || edu.school || edu.university || ''}
                    </p>

                    {edu.gpa && (
                      <p className="text-sm mt-2">
                        GPA: {edu.gpa}
                      </p>
                    )}
                  </div>

                  <span className="text-xs border-2 border-[#111111] px-2 py-0.5">
                    {edu.year || edu.graduation_year || edu.dates || ''}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-sm text-[#111111]/60 font-bold">No education listed.</p>
            )}
          </div>
        </ResumeSection>

        {/* PROJECTS */}
        {projects.length > 0 && (
          <ResumeSection title="PROJECTS">
            <div className="space-y-4">
              {projects.map((proj, index) => (
                <div key={index} className="border-b-2 border-[#111111]/20 pb-3">
                  <div className="flex justify-between items-start font-bold">
                    <span className="text-lg uppercase">
                      {proj.project_name || proj.name || 'Project'}
                    </span>
                  </div>
                  {proj.technologies && (
                    <p className="text-xs font-bold text-[#2563EB] uppercase mt-1">
                      Tech: {Array.isArray(proj.technologies) ? proj.technologies.join(', ') : proj.technologies}
                    </p>
                  )}
                  {proj.description && (
                    <p className="text-sm mt-2">{proj.description}</p>
                  )}
                </div>
              ))}
            </div>
          </ResumeSection>
        )}

        {/* CERTIFICATIONS */}
        {certifications.length > 0 && (
          <ResumeSection title="CERTIFICATIONS">
            <div className="space-y-2">
              {certifications.map((cert, index) => (
                <p key={index} className="text-sm font-bold">
                  • {typeof cert === 'string' ? cert : cert.name || JSON.stringify(cert)}
                </p>
              ))}
            </div>
          </ResumeSection>
        )}
      </div>
    </div>
  );
};

export default Resume;

