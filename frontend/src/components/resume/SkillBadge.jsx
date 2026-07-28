// TODO: Badge component for rendering individual skill items.
const SkillBadge = ({ skill, variant = 'default', className = '' }) => {
  const variantStyles = {
    default: 'bg-white text-[#111111] border-[#111111]',
    accent: 'bg-[#2563EB] text-white border-[#111111]',
    dark: 'bg-[#111111] text-white border-[#111111]',
    success: 'bg-[#22C55E] text-[#111111] border-[#111111]',
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
