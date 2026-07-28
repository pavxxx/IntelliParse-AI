// TODO: Layout container component for centered max-width content wrapper.
const Container = ({
  children,
  className = '',
  maxWidth = 'max-w-6xl',
  ...props
}) => {
  return (
    <div
      className={`w-full ${maxWidth} mx-auto px-4 sm:px-6 lg:px-8 py-8 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Container;
