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
    primary: 'bg-[#121212] text-[#E0E0E0] border-[#E0E0E0] hover:bg-[#E0E0E0] hover:text-[#121212]',
    accent: 'bg-[#E0E0E0] text-[#121212] border-[#121212] hover:bg-[#888888] hover:text-[#121212]',
    outline: 'bg-[#444444] text-[#E0E0E0] border-[#888888] hover:bg-[#888888] hover:text-[#121212]',
    danger: 'bg-[#121212] text-[#E0E0E0] border-[#888888] hover:bg-[#888888] hover:text-[#121212]',
    success: 'bg-[#121212] text-[#E0E0E0] border-[#E0E0E0] hover:bg-[#E0E0E0] hover:text-[#121212]',
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
      className={`border-3 uppercase font-bold tracking-wider transition-colors duration-150 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed ${variantStyles[variant] || variantStyles.primary} ${sizeStyles[size] || sizeStyles.md} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
