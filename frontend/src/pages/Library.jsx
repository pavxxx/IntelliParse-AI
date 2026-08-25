import { useState, useEffect } from "react";
import PageHeader from "../components/ui/PageHeader";
import SkillBadge from "../components/resume/SkillBadge";
import Input from "../components/ui/Input";
import { getResumes, getResume } from "../services/api";

const Library = ({ onSelectResume, setResumeData }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Convert JSON string fields into arrays when necessary
  const parseField = (field) => {
    if (Array.isArray(field)) {
      return field;
    }

    if (typeof field === "string") {
      try {
        const parsed = JSON.parse(field);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    }

    return [];
  };

  useEffect(() => {
    const fetchResumes = async () => {
      try {
        const data = await getResumes();

        const formattedResumes = data.map((resume) => ({
          ...resume,
          skills: parseField(resume.skills),
        }));

        setResumes(formattedResumes);
      } catch (error) {
        console.error("Failed to fetch resumes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResumes();
  }, []);

  const handleResumeClick = async (id) => {
    try {
      const resume = await getResume(id);

      // Convert stored JSON strings back into arrays
      const formattedResume = {
        ...resume,
        skills: parseField(resume.skills),
        education: parseField(resume.education),
        experience: parseField(resume.experience),
        projects: parseField(resume.projects),
        certifications: parseField(resume.certifications),
      };

      if (setResumeData) {
        setResumeData(formattedResume);
      }

      if (onSelectResume) {
        onSelectResume(formattedResume);
      }
    } catch (error) {
      console.error("Failed to fetch resume:", error);
    }
  };

  const filteredResumes = resumes.filter((resume) => {
    const search = searchTerm.toLowerCase();

    return (
      resume.name?.toLowerCase().includes(search) ||
      resume.email?.toLowerCase().includes(search) ||
      resume.skills?.some((skill) =>
        String(skill).toLowerCase().includes(search)
      )
    );
  });

  if (loading) {
    return (
      <div className="text-center py-20 font-bold uppercase text-[#B0B0B0]">
        Loading Resume Library...
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <PageHeader
        title="RESUME REPOSITORY LIBRARY"
        subtitle="INDEXED SYSTEM RECORDS // BRUTALIST ARCHIVE DATABASE"
        statusTag={`TOTAL RECORDS: ${resumes.length
          .toString()
          .padStart(2, "0")}`}
      />

      <div className="w-full">
        <Input
          placeholder="SEARCH ARCHIVE BY NAME, EMAIL OR SKILL..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {filteredResumes.length === 0 ? (
        <div className="border-3 border-[#121212] bg-[#444444] p-10 text-center font-bold uppercase text-[#B0B0B0]">
          {searchTerm ? "No matching resumes found." : "No resumes in library."}
        </div>
      ) : (
        <div className="border-3 border-[#121212] bg-[#444444] overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-3 border-[#121212] bg-[#121212] text-[#E0E0E0]">
                <th className="p-4 text-xs font-extrabold uppercase tracking-wider border-r-3 border-[#121212]">
                  NAME
                </th>

                <th className="p-4 text-xs font-extrabold uppercase tracking-wider border-r-3 border-[#121212]">
                  EMAIL
                </th>

                <th className="p-4 text-xs font-extrabold uppercase tracking-wider border-r-3 border-[#121212]">
                  PHONE
                </th>

                <th className="p-4 text-xs font-extrabold uppercase tracking-wider">
                  TOP SKILLS
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredResumes.map((resume) => (
                <tr
                  key={resume.id}
                  onClick={() => handleResumeClick(resume.id)}
                  className="border-b-3 border-[#121212] cursor-pointer hover:bg-[#888888] hover:text-[#121212] transition-colors text-[#E0E0E0]"
                >
                  <td className="p-4 text-sm font-extrabold uppercase border-r-3 border-[#121212]">
                    {resume.name || "N/A"}
                  </td>

                  <td className="p-4 text-sm font-bold border-r-3 border-[#121212]">
                    {resume.email || "N/A"}
                  </td>

                  <td className="p-4 text-sm font-bold border-r-3 border-[#121212]">
                    {resume.phone || "N/A"}
                  </td>

                  <td className="p-4">
                    <div className="flex flex-wrap gap-1.5">
                      {resume.skills.slice(0, 4).map((skill, index) => (
                        <SkillBadge
                          key={`${resume.id}-${index}`}
                          skill={String(skill)}
                          variant="default"
                        />
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Library;