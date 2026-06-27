import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', type = 'text', ...props }, ref) => {
    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 font-outfit">
            {label}
          </label>
        )}
        <input
          ref={ref}
          type={type}
          className={`w-full px-4 py-3 bg-white/80 dark:bg-gray-950/60 border ${
            error ? 'border-red-500/80 focus:ring-red-500/50' : 'border-gray-200 dark:border-white/10 focus:border-violet-500/80 focus:ring-violet-500/10 dark:focus:ring-violet-500/20'
          } rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-4 transition-all duration-200 ${className}`}
          {...props}
        />
        {error && (
          <span className="text-xs font-medium text-red-400 mt-0.5">{error}</span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
