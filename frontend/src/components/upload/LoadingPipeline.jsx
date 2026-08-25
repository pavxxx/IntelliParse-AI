import { useState, useEffect } from 'react';

const LoadingPipeline = ({ isAnalyzing = false }) => {
  const [currentStage, setCurrentStage] = useState(0);

  const stages = [
    { title: 'FILE RECEIVED', desc: 'Ingesting binary stream' },
    { title: 'EXTRACTING TEXT', desc: 'Parsing raw document text' },
    { title: 'AI ANALYSIS', desc: 'Processing entity and skill matrix' },
    { title: 'DATABASE UPDATED', desc: 'Persisting structured JSON output' },
  ];

  useEffect(() => {
    if (!isAnalyzing) {
      setCurrentStage(0);
      return;
    }

    const interval = setInterval(() => {
      setCurrentStage((prev) => {
        // Step up to stage 2 (AI ANALYSIS) and hold there while waiting for LLM/DB
        if (prev < 2) {
          return prev + 1;
        } else {
          return prev;
        }
      });
    }, 1500);

    return () => clearInterval(interval);
  }, [isAnalyzing]);

  if (!isAnalyzing) return null;

  return (
    <div className="border-3 border-[#888888] bg-[#121212] p-8 font-mono text-[#E0E0E0]">
      <div className="flex items-center justify-between border-b-3 border-[#888888] pb-4 mb-6">
        <div className="text-xl font-extrabold uppercase tracking-tight flex items-center gap-3">
          <span className="inline-block w-3 h-3 bg-[#E0E0E0] animate-ping"></span>
          SYSTEM STATUS // PROCESSING PIPELINE
        </div>
        <div className="text-xs font-bold uppercase tracking-widest bg-[#888888] text-[#121212] px-3 py-1">
          EXECUTING...
        </div>
      </div>

      <div className="space-y-6">
        {stages.map((stage, idx) => {
          const isDone = currentStage > idx;
          const isActive = currentStage === idx;

          return (
            <div key={stage.title} className="space-y-2">
              <div className="flex items-center justify-between text-sm font-extrabold tracking-wider uppercase">
                <span className="flex items-center gap-3">
                  <span className={`w-6 h-6 border-2 flex items-center justify-center font-bold ${
                    isDone ? 'bg-[#E0E0E0] text-[#121212] border-[#E0E0E0]' : isActive ? 'bg-[#888888] text-[#121212] border-[#888888]' : 'bg-[#444444] text-[#B0B0B0] border-[#888888]'
                  }`}>
                    {isDone ? '✓' : idx + 1}
                  </span>
                  {stage.title}
                </span>
                <span className="text-xs font-bold text-[#B0B0B0]">
                  {isDone ? 'COMPLETED' : isActive ? 'IN PROGRESS' : 'WAITING'}
                </span>
              </div>

              {/* Brutalist Progress Bar Box */}
              <div className="border-2 border-[#888888] bg-[#444444] p-2 tracking-widest text-xs font-bold overflow-hidden select-none">
                {isDone ? (
                  <span className="text-[#E0E0E0]">■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■</span>
                ) : isActive ? (
                  <span className="text-[#E0E0E0] animate-pulse">■■■■■■■■■■■■■□□□□□□□□□□□□□□□□□</span>
                ) : (
                  <span className="text-[#888888]">□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LoadingPipeline;

