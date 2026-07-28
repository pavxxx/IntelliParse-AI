// TODO: Collapsible or grouped resume section component for displaying resume details.
const ResumeSection = ({ title, children, className = '' }) => {
  return (
    <div className={`border-3 border-[#111111] bg-white p-6 md:p-8 space-y-4 ${className}`}>
      {title && (
        <div className="border-b-3 border-[#111111] pb-3 mb-4 flex items-center justify-between">
          <h2 className="text-lg md:text-xl font-extrabold uppercase tracking-wider text-[#111111]">
            {title}
          </h2>
          <span className="text-xs font-extrabold uppercase bg-[#111111] text-white px-2 py-1">
            SECTION
          </span>
        </div>
      )}
      <div className="text-base font-semibold text-[#111111] leading-relaxed">
        {children}
      </div>
    </div>
  );
};

export default ResumeSection;
