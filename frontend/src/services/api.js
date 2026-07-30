import axios from "axios";

// Axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8000",
});

// Upload Resume
export const uploadResume = async (file) => {
  const formData = new FormData();

  formData.append("file", file);

  const response = await api.post("/upload-resume", formData);

  return response.data;
};

// Get a single resume
export const getResume = async (id) => {
  const response = await api.get(`/resume/${id}`);

  return response.data;
};

// Get all resumes
export const getResumes = async () => {
  const response = await api.get("/resumes");

  return response.data;
};

// Chat with a resume using the stored JSON as knowledge source
export const chatWithResume = async ({ resumeId, question, conversationHistory = [], jobDescription = null }) => {
  const payload = {
    resume_id: resumeId,
    question,
    conversation_history: conversationHistory,
  };

  if (jobDescription && jobDescription.trim()) {
    payload.job_description = jobDescription.trim();
  }

  const response = await api.post("/chat", payload);
  return response.data.reply;
};

export default api;