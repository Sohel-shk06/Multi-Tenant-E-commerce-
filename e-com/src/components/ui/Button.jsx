import React from 'react';

export const Button = ({ 
  children, 
  type = 'button', 
  variant = 'primary',
  disabled = false,
  className = '',
  ...props 
}) => {
  // Added standard explicit layout centering metrics (items-center, justify-center)
  const baseStyles = 'w-full px-6 py-4 rounded-2xl font-sans font-bold tracking-wide text-sm transition-all duration-300 ease-out focus:outline-none focus:ring-2 focus:ring-purple-500 active:scale-[0.97] transform backface-hidden will-change-transform relative overflow-hidden flex items-center justify-center gap-3 group';
  
  const variants = {
    primary: 'bg-gradient-to-r from-violet-600 via-indigo-600 to-fuchsia-500 text-white shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:shadow-[0_0_35px_rgba(236,72,153,0.4)] hover:brightness-110 border border-white/10',
    secondary: 'bg-slate-900/40 backdrop-blur-md text-slate-200 hover:bg-white/5 border border-purple-500/10 focus:ring-purple-500',
    outline: 'border-2 border-fuchsia-500 text-fuchsia-300 bg-fuchsia-500/5 hover:bg-fuchsia-500/10 focus:ring-fuchsia-500',
    danger: 'bg-gradient-to-r from-rose-500 to-red-600 text-white shadow-lg focus:ring-red-500',
    
    // Completely isolated white glass asset base container for single sign-on buttons
    google: 'bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 shadow-sm transition-all backdrop-blur-3xl normal-case',
    microsoft: 'bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 shadow-sm transition-all backdrop-blur-3xl normal-case'
  };

  const disabledStyles = disabled ? 'opacity-30 cursor-not-allowed pointer-events-none' : '';

  return (
    <button
      type={type}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${disabledStyles} ${className}`}
      {...props}
    >
      {/* PERFECTLY BOXED MULTI-COLOR GOOGLE VECTOR */}
      {variant === 'google' && (
        <svg className="w-5 h-5 min-w-[20px] min-h-[20px] flex-shrink-0 block" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.47 2.47 2.18 6.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
        </svg>
      )}

      {/* PERFECTLY BOXED MULTI-COLOR MICROSOFT VECTOR */}
      {variant === 'microsoft' && (
        <svg className="w-4 h-4 min-w-[16px] min-h-[16px] flex-shrink-0 block" viewBox="0 0 23 23">
          <path fill="#f35325" d="M0 0h11v11H0z"/>
          <path fill="#80bb0a" d="M12 0h11v11H12z"/>
          <path fill="#00a4ef" d="M0 12h11v11H0z"/>
          <path fill="#ffb900" d="M12 12h11v11H12z"/>
        </svg>
      )}

      {/* Cosmic background animation glare layer */}
      <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite]"></span>
      
      <span className="relative z-10">{children}</span>
    </button>
  );
};