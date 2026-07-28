// TODO: Reusable UI Button component with variant styles and action handlers.
const Button = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  className = '',
  type = 'button',
  ...props
}) => {
  // Brutalist variant mappings
  const variantStyles = {
    primary: 'bg-[#111111] text-white hover:bg-[#2563EB] hover:text-white border-[#111111]',
    accent: 'bg-[#2563EB] text-white hover:bg-[#111111] hover:text-white border-[#111111]',
    outline: 'bg-white text-[#111111] hover:bg-[#111111] hover:text-white border-[#111111]',
    danger: 'bg-[#EF4444] text-white hover:bg-[#111111] hover:text-white border-[#111111]',
    success: 'bg-[#22C55E] text-[#111111] hover:bg-[#111111] hover:text-white border-[#111111]',
  };

  const sizeStyles = {
    sm: 'px-4 py-2 text-sm font-bold',
    md: 'px-6 py-3 text-base font-bold',
    lg: 'px-8 py-4 text-lg font-extrabold tracking-wider',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`border-3 border-[#111111] uppercase font-bold tracking-wider transition-colors duration-150 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed ${variantStyles[variant] || variantStyles.primary} ${sizeStyles[size] || sizeStyles.md} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
