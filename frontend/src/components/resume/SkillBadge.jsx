// TODO: Badge component for rendering individual skill items.
const SkillBadge = ({ skill, variant = 'default', className = '' }) => {
  const variantStyles = {
    default: 'bg-[#444444] text-[#E0E0E0] border-[#888888]',
    accent: 'bg-[#121212] text-[#E0E0E0] border-[#888888]',
    dark: 'bg-[#121212] text-[#B0B0B0] border-[#888888]',
    success: 'bg-[#888888] text-[#121212] border-[#121212]',
  };

  return (
    <span
      className={`inline-block border-3 px-3 py-1.5 text-xs md:text-sm font-extrabold uppercase tracking-wider ${
        variantStyles[variant] || variantStyles.default
      } ${className}`}
    >
      {skill}
    </span>
  );
};

export default SkillBadge;
