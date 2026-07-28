import PageHeader from '../components/ui/PageHeader';
import ResumeSection from '../components/resume/ResumeSection';
import SkillBadge from '../components/resume/SkillBadge';
import Button from '../components/ui/Button';

// TODO: Resume detail page displaying parsed resume sections, skills, and insights.
const Resume = ({ onBackToUpload, resumeData }) => {
  if (!resumeData) {
    return (
      <div className="text-center py-20">
        No resume data available.
      </div>
    );
  }
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
          {/*<div className="text-xs font-extrabold uppercase bg-[#22C55E] text-[#111111] px-2 py-1">
            SCORE: 96/100
          </div>*/}
        </div>

        {/* CANDIDATE IDENTITY */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 border-b-3 border-[#111111] pb-6">
          <div>
            <div className="text-xs font-extrabold uppercase tracking-wider text-[#111111]/60 mb-1">
              NAME
            </div>
            <div className="text-xl font-extrabold uppercase text-[#111111]">
              {resumeData.name}
            </div>
          </div>
          <div>
            <div className="text-xs font-extrabold uppercase tracking-wider text-[#111111]/60 mb-1">
              EMAIL
            </div>
            <div className="text-base font-bold text-[#111111]">
              {resumeData.email}
            </div>
          </div>
          <div>
            <div className="text-xs font-extrabold uppercase tracking-wider text-[#111111]/60 mb-1">
              PHONE
            </div>
            <div className="text-base font-bold text-[#111111]">
              {resumeData.phone}
            </div>
            <div>
              <div className="text-xs font-extrabold uppercase tracking-wider text-[#111111]/60 mb-1">
                GITHUB
              </div>

              <div className="text-base font-bold text-[#111111]">
                {resumeData.github || "N/A"}
              </div>
            </div>

            <div>
              <div className="text-xs font-extrabold uppercase tracking-wider text-[#111111]/60 mb-1">
                LINKEDIN
              </div>

              <div className="text-base font-bold text-[#111111]">
                {resumeData.linkedin || "N/A"}
              </div>
            </div>
          </div>
        </div>

        {/* SKILLS MATRIX */}
        <ResumeSection title="TECHNICAL SKILLS">
          <div className="flex flex-wrap gap-2 pt-2">
            <div className="flex flex-wrap gap-2 pt-2">
              {resumeData.skills?.length ? (
                resumeData.skills.map((skill, index) => (
                  <SkillBadge
                    key={index}
                    skill={skill}
                    variant={index % 2 === 0 ? "accent" : "default"}
                  />
                ))
              ) : (
                <p>No skills found.</p>
              )}
            </div>
          </div>
        </ResumeSection>

        {/* EXPERIENCE */}
        <ResumeSection title="PROFESSIONAL EXPERIENCE">
          <div className="space-y-4">
            {resumeData.experience.map((exp, index) => (
              <div
                key={index}
                className="border-b-2 border-[#111111]/20 pb-3"
              >
                <div className="flex justify-between items-start font-bold">
                  <span className="text-lg uppercase">
                    {exp.title || exp.role}
                  </span>

                  <span className="text-xs bg-[#111111] text-white px-2 py-0.5">
                    {exp.period || exp.duration}
                  </span>
                </div>

                <p className="text-xs font-bold text-[#111111]/70 uppercase mt-1">
                  {exp.company}
                </p>

                <div className="mt-2 space-y-1">
                  {(exp.responsibilities || exp.description || []).map((item, i) => (
                    <p key={i} className="text-sm">
                      • {item}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </ResumeSection>

        {/* EDUCATION */}
        <ResumeSection title="EDUCATION">
          <div className="space-y-4">
            {resumeData.education.map((edu, index) => (
              <div
                key={index}
                className="flex justify-between items-start font-bold border-b-2 border-[#111111]/20 pb-3"
              >
                <div>
                  <span className="text-lg uppercase">
                    {edu.degree}
                  </span>

                  <p className="text-xs font-bold text-[#111111]/70 uppercase mt-1">
                    {edu.institution}
                  </p>

                  {edu.gpa && (
                    <p className="text-sm mt-2">
                      GPA: {edu.gpa}
                    </p>
                  )}
                </div>

                <span className="text-xs border-2 border-[#111111] px-2 py-0.5">
                  {edu.year || edu.graduation_year}
                </span>
              </div>
            ))}
          </div>
        </ResumeSection>
      </div>
    </div>
  );
};

export default Resume;
