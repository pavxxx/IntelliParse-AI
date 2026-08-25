import Button from '../ui/Button';

// TODO: Upload area component supporting drag-and-drop resume file uploads.
const UploadBox = ({ onStartAnalysis, selectedFile, onFileSelect }) => {
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      if (onFileSelect) onFileSelect(e.target.files[0]);
    }
  };

  return (
    <div className="border-3 border-[#888888] bg-[#121212] p-8 md:p-12 text-center flex flex-col items-center justify-center gap-6">
      <div className="border-3 border-[#888888] bg-[#444444] px-4 py-2 text-xs font-extrabold uppercase tracking-widest text-[#E0E0E0]">
        INTAKE HATCH // FILE PARSER
      </div>

      <div className="w-full max-w-xl border-3 border-dashed border-[#888888] bg-[#444444] p-8 md:p-12 flex flex-col items-center gap-4">
        <div className="text-xl md:text-2xl font-extrabold uppercase text-[#E0E0E0]">
          {selectedFile ? selectedFile.name : '[ DROP RESUME DOCUMENT HERE ]'}
        </div>
        <p className="text-sm font-bold uppercase tracking-wider text-[#B0B0B0]">
          ACCEPTED FORMATS: PDF, DOCX, TXT (MAX 10MB)
        </p>

        <label className="mt-2 cursor-pointer border-3 border-[#888888] bg-[#121212] hover:bg-[#888888] hover:text-[#121212] text-[#E0E0E0] px-6 py-3 text-sm font-extrabold uppercase tracking-wider transition-colors">
          BROWSE FILES
          <input
            type="file"
            accept=".pdf,.docx,.txt"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>
      </div>

      <Button
        variant="primary"
        size="lg"
        onClick={onStartAnalysis}
        className="w-full max-w-xl"
      >
        + ANALYZE DOCUMENT
      </Button>
    </div>
  );
};

export default UploadBox;
