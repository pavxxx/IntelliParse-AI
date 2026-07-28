import { useState, useEffect } from 'react';

// TODO: Pipeline progress indicator displaying active analysis stages.
const LoadingPipeline = ({ isAnalyzing = false, onComplete }) => {
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
        if (prev < stages.length) {
          return prev + 1;
        } else {
          clearInterval(interval);
          if (onComplete) onComplete();
          return prev;
        }
      });
    }, 1200);

    return () => clearInterval(interval);
  }, [isAnalyzing]);

  if (!isAnalyzing) return null;

  return (
    <div className="border-3 border-[#111111] bg-white p-8 font-mono text-[#111111]">
      <div className="flex items-center justify-between border-b-3 border-[#111111] pb-4 mb-6">
        <div className="text-xl font-extrabold uppercase tracking-tight flex items-center gap-3">
          <span className="inline-block w-3 h-3 bg-[#2563EB]"></span>
          SYSTEM STATUS // PROCESSING PIPELINE
        </div>
        <div className="text-xs font-bold uppercase tracking-widest bg-[#111111] text-white px-3 py-1">
          {currentStage >= stages.length ? 'COMPLETE' : 'EXECUTING...'}
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
                  <span className={`w-6 h-6 border-2 border-[#111111] flex items-center justify-center font-bold ${
                    isDone ? 'bg-[#22C55E] text-white' : isActive ? 'bg-[#2563EB] text-white' : 'bg-[#F5F5F5] text-[#111111]'
                  }`}>
                    {isDone ? '✓' : idx + 1}
                  </span>
                  {stage.title}
                </span>
                <span className="text-xs font-bold opacity-70">
                  {isDone ? 'COMPLETED' : isActive ? 'IN PROGRESS' : 'WAITING'}
                </span>
              </div>

              {/* Brutalist Progress Bar Box */}
              <div className="border-2 border-[#111111] bg-[#F5F5F5] p-2 tracking-widest text-xs font-bold overflow-hidden select-none">
                {isDone ? (
                  <span className="text-[#22C55E]">■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■</span>
                ) : isActive ? (
                  <span className="text-[#2563EB] animate-pulse">■■■■■■■■■■■■■□□□□□□□□□□□□□□□□□</span>
                ) : (
                  <span className="text-[#111111]/30">□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□</span>
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
