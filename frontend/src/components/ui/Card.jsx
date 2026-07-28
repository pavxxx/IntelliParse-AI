// TODO: Reusable Card container component for wrapping content sections.
const Card = ({
  children,
  title,
  subtitle,
  action,
  className = '',
  innerClassName = 'p-6',
  headerClassName = '',
  ...props
}) => {
  return (
    <div
      className={`border-3 border-[#111111] bg-white text-[#111111] ${className}`}
      {...props}
    >
      {(title || subtitle || action) && (
        <div className={`border-b-3 border-[#111111] p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#F5F5F5] ${headerClassName}`}>
          <div>
            {title && (
              <h3 className="text-xl font-extrabold uppercase tracking-wide text-[#111111]">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-sm font-semibold text-[#111111]/70 uppercase tracking-tight mt-1">
                {subtitle}
              </p>
            )}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      <div className={innerClassName}>{children}</div>
    </div>
  );
};

export default Card;
