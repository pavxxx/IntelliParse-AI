import { useState } from 'react';
import PageHeader from '../components/ui/PageHeader';
import UploadBox from '../components/upload/UploadBox';
import LoadingPipeline from '../components/upload/LoadingPipeline';
import { uploadResume } from "../services/api";

// TODO: Home page featuring file upload and initial dashboard view.
const Home = ({ onViewResume, setResumeData }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleStartAnalysis = async () => {
    if (!selectedFile) {
      alert("Please select a resume first.");
      return;
    }

    try {
      setIsAnalyzing(true);

      const response = await uploadResume(selectedFile);

      setResumeData(response.data);

      console.log(response.data);

      setTimeout(() => {
        onViewResume();
      }, 800);

      // We'll use this response in the next step
    } catch (error) {
      console.error(error);
      alert("Failed to upload resume.");
      setIsAnalyzing(false);
    }
  };

  const handlePipelineComplete = () => {
    if (onViewResume) {
      setTimeout(() => {
        onViewResume();
      }, 800);
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
          onComplete={handlePipelineComplete}
        />
      )}
    </div>
  );
};

export default Home;
