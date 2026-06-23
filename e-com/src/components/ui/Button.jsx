export const Button = ({ 
  children, 
  type = 'button', 
  variant = 'primary',
  disabled = false,
  className = '',
  ...props 
}) => {
  const baseStyles = 'inline-flex items-center justify-center gap-2 min-h-11 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#6C4EFF]/30 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-[#6C4EFF] text-white shadow-sm hover:bg-[#5B3EE0] hover:shadow-md',
    secondary: 'bg-[#EEE9FF] text-[#6C4EFF] hover:bg-[#E5DEFF] hover:shadow-sm',
    outline: 'border border-[#E9E7F5] bg-white text-[#1E1E2F] hover:border-[#6C4EFF] hover:text-[#6C4EFF] hover:bg-[#F8F7FC]',
    danger: 'bg-red-600 text-white shadow-sm hover:bg-red-700 hover:shadow-md focus:ring-red-500/30',
  };

  return (
    <button
      type={type}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
