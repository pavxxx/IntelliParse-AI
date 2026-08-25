// TODO: Page header component displaying title, subtitle, and action buttons.
const PageHeader = ({
  title,
  subtitle,
  statusTag,
  action,
  className = '',
}) => {
  return (
    <header className={`border-b-3 border-[#121212] pb-6 mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4 ${className}`}>
      <div>
        {statusTag && (
          <div className="inline-block border-3 border-[#888888] bg-[#121212] text-[#E0E0E0] px-3 py-1 text-xs font-extrabold uppercase tracking-widest mb-3">
            {statusTag}
          </div>
        )}
        <h1 className="text-3xl md:text-5xl font-extrabold uppercase tracking-tight text-[#E0E0E0]">
          {title}
        </h1>
        {subtitle && (
          <p className="text-base md:text-lg font-bold text-[#B0B0B0] uppercase tracking-wide mt-2">
            {subtitle}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </header>
  );
};

export default PageHeader;
