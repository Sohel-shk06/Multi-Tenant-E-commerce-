export const Input = ({ 
  label, 
  type = 'text', 
  error,
  className = '',
  ...props 
}) => {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-sm font-semibold text-[#1E1E2F]">
          {label}
        </label>
      )}
      <input
        type={type}
        className={`w-full min-h-11 px-3.5 py-2.5 border rounded-xl bg-white text-sm text-[#1E1E2F] placeholder-[#6B7280]/60 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#6C4EFF]/25 focus:border-[#6C4EFF] ${
          error ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500' : 'border-[#E9E7F5]'
        } ${className}`}
        {...props}
      />
      {error && (
        <p className="text-sm font-medium text-red-600">{error}</p>
      )}
    </div>
  );
};
