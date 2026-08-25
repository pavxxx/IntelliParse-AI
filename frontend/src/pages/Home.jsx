import { useState } from 'react';
import PageHeader from '../components/ui/PageHeader';
import UploadBox from '../components/upload/UploadBox';
import LoadingPipeline from '../components/upload/LoadingPipeline';
import { uploadResume } from "../services/api";

const Home = ({ onViewResume, setResumeData }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleStartAnalysis = async () => {
    if (!selectedFile) {
      alert("Please select a resume first.");
      return;
    }

    try {
      // Clear the previously displayed resume immediately
      setResumeData(null);

      // Show loading screen while the new resume is processed
      setIsAnalyzing(true);

      const response = await uploadResume(selectedFile);

      // Store the newly parsed resume
      setResumeData(response.data);

      console.log("New resume:", response.data);

      setIsAnalyzing(false);
      if (onViewResume) {
        onViewResume();
      }

    } catch (error) {
      console.error("Upload failed:", error);
      alert("Failed to upload resume. Ensure backend and Ollama/Gemini are active.");
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <PageHeader
        title="DOCUMENT INGESTION ENGINE"
        subtitle="PARSER READY // SUBMIT RESUME BINARY FOR EXTRACTING TECHNICAL METRICS"
        statusTag="ENGINE ACTIVE"
      />

      {!isAnalyzing ? (
        <UploadBox
          selectedFile={selectedFile}
          onFileSelect={setSelectedFile}
          onStartAnalysis={handleStartAnalysis}
        />
      ) : (
        <LoadingPipeline
          isAnalyzing={isAnalyzing}
        />
      )}
    </div>
  );
};

export default Home;