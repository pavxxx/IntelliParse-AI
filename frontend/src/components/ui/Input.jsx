// TODO: Reusable Input component for form text fields and controls.
const Input = ({
  label,
  error,
  value,
  onChange,
  placeholder,
  type = 'text',
  className = '',
  id,
  name,
  required = false,
  ...props
}) => {
  return (
    <div className="w-full flex flex-col gap-2">
      {label && (
        <label
          htmlFor={id || name}
          className="text-xs font-extrabold uppercase tracking-widest text-[#E0E0E0]"
        >
          {label} {required && <span className="text-[#E0E0E0]">*</span>}
        </label>
      )}
      <input
        id={id || name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className={`w-full border-3 border-[#888888] bg-[#121212] text-[#E0E0E0] font-bold text-base px-5 py-4 focus:outline-none focus:border-[#E0E0E0] placeholder:text-[#888888] uppercase tracking-wide transition-colors ${className}`}
        {...props}
      />
      {error && (
        <span className="text-xs font-bold text-[#E0E0E0] uppercase tracking-wider">
          {error}
        </span>
      )}
    </div>
  );
};

export default Input;
