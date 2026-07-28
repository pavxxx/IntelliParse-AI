// TODO: Page header component displaying title, subtitle, and action buttons.
const PageHeader = ({
  title,
  subtitle,
  statusTag,
  action,
  className = '',
}) => {
  return (
    <header className={`border-b-3 border-[#111111] pb-6 mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4 ${className}`}>
      <div>
        {statusTag && (
          <div className="inline-block border-3 border-[#111111] bg-[#111111] text-white px-3 py-1 text-xs font-extrabold uppercase tracking-widest mb-3">
            {statusTag}
          </div>
        )}
        <h1 className="text-3xl md:text-5xl font-extrabold uppercase tracking-tight text-[#111111]">
          {title}
        </h1>
        {subtitle && (
          <p className="text-base md:text-lg font-bold text-[#111111]/70 uppercase tracking-wide mt-2">
            {subtitle}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </header>
  );
};

export default PageHeader;
