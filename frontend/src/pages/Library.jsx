import { useState, useEffect } from "react";
import PageHeader from "../components/ui/PageHeader";
import SkillBadge from "../components/resume/SkillBadge";
import Input from "../components/ui/Input";
import { getResumes, getResume } from "../services/api";

const Library = ({ onSelectResume, setResumeData }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResumes = async () => {
      try {
        const data = await getResumes();
        setResumes(data);
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

      if (setResumeData) {
        setResumeData(resume);
      }

      if (onSelectResume) {
        onSelectResume();
      }
    } catch (error) {
      console.error("Failed to fetch resume:", error);
    }
  };

  const filteredResumes = resumes.filter((res) => {
    const search = searchTerm.toLowerCase();

    return (
      res.name?.toLowerCase().includes(search) ||
      res.email?.toLowerCase().includes(search) ||
      res.skills?.some((skill) =>
        skill.toLowerCase().includes(search)
      )
    );
  });

  if (loading) {
    return (
      <div className="text-center py-20 font-bold uppercase">
        Loading Resume Library...
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <PageHeader
        title="RESUME REPOSITORY LIBRARY"
        subtitle="INDEXED SYSTEM RECORDS // BRUTALIST ARCHIVE DATABASE"
        statusTag={`TOTAL RECORDS: ${resumes.length}`}
      />

      <Input
        placeholder="SEARCH ARCHIVE BY NAME, EMAIL OR SKILL..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {filteredResumes.length === 0 ? (
        <div className="border-3 border-[#111111] bg-white p-10 text-center font-bold uppercase">
          No resumes found.
        </div>
      ) : (
        <div className="border-3 border-[#111111] bg-white overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-3 border-[#111111] bg-[#111111] text-white">
                <th className="p-4 text-xs font-extrabold uppercase border-r-3">
                  NAME
                </th>
                <th className="p-4 text-xs font-extrabold uppercase border-r-3">
                  EMAIL
                </th>
                <th className="p-4 text-xs font-extrabold uppercase border-r-3">
                  PHONE
                </th>
                <th className="p-4 text-xs font-extrabold uppercase">
                  TOP SKILLS
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredResumes.map((resume) => (
                <tr
                  key={resume.id}
                  onClick={() => handleResumeClick(resume.id)}
                  className="border-b-3 border-[#111111] cursor-pointer hover:bg-[#E5E5E5] transition-colors"
                >
                  <td className="p-4 text-sm font-extrabold uppercase border-r-3">
                    {resume.name}
                  </td>

                  <td className="p-4 text-sm font-bold border-r-3">
                    {resume.email}
                  </td>

                  <td className="p-4 text-sm font-bold border-r-3">
                    {resume.phone}
                  </td>

                  <td className="p-4">
                    <div className="flex flex-wrap gap-2">
                      {resume.skills?.slice(0, 4).map((skill, index) => (
                        <SkillBadge
                          key={index}
                          skill={skill}
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