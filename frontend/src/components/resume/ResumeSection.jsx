// TODO: Collapsible or grouped resume section component for displaying resume details.
const ResumeSection = ({ title, children, className = '' }) => {
  return (
    <div className={`border-3 border-[#888888] bg-[#121212] p-6 md:p-8 space-y-4 ${className}`}>
      {title && (
        <div className="border-b-3 border-[#888888] pb-3 mb-4 flex items-center justify-between">
          <h2 className="text-lg md:text-xl font-extrabold uppercase tracking-wider text-[#E0E0E0]">
            {title}
          </h2>
          <span className="text-xs font-extrabold uppercase bg-[#444444] text-[#E0E0E0] border border-[#888888] px-2 py-1">
            SECTION
          </span>
        </div>
      )}
      <div className="text-base font-semibold text-[#E0E0E0] leading-relaxed">
        {children}
      </div>
    </div>
  );
};

export default ResumeSection;
