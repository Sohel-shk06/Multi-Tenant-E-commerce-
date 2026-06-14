import React from 'react';

export const Button = ({ 
  children, 
  type = 'button', 
  variant = 'primary',
  disabled = false,
  className = '',
  ...props 
}) => {
  const baseStyles = 'w-full px-6 py-3.5 rounded-xl font-sans font-semibold tracking-wide text-sm transition-all duration-300 ease-out focus:outline-none focus:ring-2 focus:ring-blue-400 active:scale-[0.98] transform backface-hidden will-change-transform relative overflow-hidden flex items-center justify-center gap-3 group';
  
  const variants = {
    // MATCHED LAYOUT GRADIENT: Uses the exact beautiful light blue attraction shades from the left background
    primary: 'bg-gradient-to-r from-indigo-500 via-blue-500 to-sky-400 text-white shadow-md shadow-blue-500/10 hover:shadow-lg hover:shadow-blue-500/20 hover:brightness-105 border border-white/10',
    secondary: 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 focus:ring-slate-400',
    outline: 'border border-slate-300 text-slate-700 bg-transparent hover:bg-slate-50',
    danger: 'bg-red-600 hover:bg-red-700 text-white shadow-sm',
    
    // Crisp light corporate SSO buttons
    google: 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-sm transition-all normal-case font-medium',
    microsoft: 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-sm transition-all normal-case font-medium'
  };

  const disabledStyles = disabled ? 'opacity-40 cursor-not-allowed pointer-events-none' : '';

  return (
    <button
      type={type}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${disabledStyles} ${className}`}
      {...props}
    >
      {/* Crisp Multi-Color Google SVG */}
      {variant === 'google' && (
        <svg className="w-4 h-4 flex-shrink-0 block" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 6.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
        </svg>
      )}

      {/* Crisp Multi-Color Microsoft SVG */}
      {variant === 'microsoft' && (
        <svg className="w-4 h-4 flex-shrink-0 block" viewBox="0 0 23 23">
          <path fill="#f35325" d="M0 0h11v11H0z"/>
          <path fill="#80bb0a" d="M12 0h11v11H12z"/>
          <path fill="#00a4ef" d="M0 12h11v11H0z"/>
          <path fill="#ffb900" d="M12 12h11v11H12z"/>
        </svg>
      )}

      {/* Soft overlay hover glow reflection */}
      <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite]"></span>
      
      <span className="relative z-10 flex items-center justify-center gap-2">{children}</span>
    </button>
  );
};