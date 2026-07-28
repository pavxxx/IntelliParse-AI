import PageHeader from '../components/ui/PageHeader';
import SkillBadge from '../components/resume/SkillBadge';
import Input from '../components/ui/Input';
import { useState } from 'react';

// TODO: Library page for managing and searching uploaded resumes.
const Library = ({ onSelectResume }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const sampleResumes = [
    {
      id: 1,
      name: 'PAVITHRA V G',
      email: 'abc@gmail.com',
      phone: '9876543210',
      skills: ['PYTHON', 'FASTAPI', 'REACT', 'SQL'],
    },
    {
      id: 2,
      name: 'ALEXANDER R',
      email: 'alex.r@dev.io',
      phone: '9812345678',
      skills: ['TYPESCRIPT', 'NODE.JS', 'NEXT.JS', 'AWS'],
    },
    {
      id: 3,
      name: 'SARAH CONNOR',
      email: 'sarah@cyberdyne.org',
      phone: '9765432109',
      skills: ['C++', 'PYTHON', 'DOCKER', 'SYSTEMS'],
    },
  ];

  const filteredResumes = sampleResumes.filter(
    (res) =>
      res.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      res.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      res.skills.some((s) => s.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <PageHeader
        title="RESUME REPOSITORY LIBRARY"
        subtitle="INDEXED SYSTEM RECORDS // BRUTALIST ARCHIVE DATABASE"
        statusTag="TOTAL RECORDS: 03"
      />

      <div className="w-full">
        <Input
          placeholder="SEARCH ARCHIVE BY NAME, EMAIL OR SKILL..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Brutalist Table */}
      <div className="border-3 border-[#111111] bg-white overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b-3 border-[#111111] bg-[#111111] text-white">
              <th className="p-4 text-xs font-extrabold uppercase tracking-wider border-r-3 border-[#111111]">
                NAME
              </th>
              <th className="p-4 text-xs font-extrabold uppercase tracking-wider border-r-3 border-[#111111]">
                EMAIL
              </th>
              <th className="p-4 text-xs font-extrabold uppercase tracking-wider border-r-3 border-[#111111]">
                PHONE
              </th>
              <th className="p-4 text-xs font-extrabold uppercase tracking-wider">
                TOP SKILLS
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredResumes.map((row) => (
              <tr
                key={row.id}
                onClick={() => onSelectResume && onSelectResume(row)}
                className="border-b-3 border-[#111111] cursor-pointer hover:bg-[#E5E5E5] transition-colors"
              >
                <td className="p-4 text-sm font-extrabold uppercase border-r-3 border-[#111111] text-[#111111]">
                  {row.name}
                </td>
                <td className="p-4 text-sm font-bold border-r-3 border-[#111111] text-[#111111]">
                  {row.email}
                </td>
                <td className="p-4 text-sm font-bold border-r-3 border-[#111111] text-[#111111]">
                  {row.phone}
                </td>
                <td className="p-4">
                  <div className="flex flex-wrap gap-1.5">
                    {row.skills.map((skill) => (
                      <SkillBadge key={skill} skill={skill} variant="default" />
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Library;
