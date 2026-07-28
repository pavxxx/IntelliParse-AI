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
          className="text-xs font-extrabold uppercase tracking-widest text-[#111111]"
        >
          {label} {required && <span className="text-[#EF4444]">*</span>}
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
        className={`w-full border-3 border-[#111111] bg-white text-[#111111] font-bold text-base px-5 py-4 focus:outline-none focus:border-[#2563EB] placeholder:text-[#111111]/40 uppercase tracking-wide transition-colors ${className}`}
        {...props}
      />
      {error && (
        <span className="text-xs font-bold text-[#EF4444] uppercase tracking-wider">
          {error}
        </span>
      )}
    </div>
  );
};

export default Input;
