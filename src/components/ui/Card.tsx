import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const Card = ({ children, className = '', ...props }: CardProps) => {
  return (
    <div
      className={`glass-panel rounded-2xl shadow-2xl p-6 transition-all duration-300 hover:shadow-indigo-500/5 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ children, className = '', ...props }: CardProps) => {
  return (
    <div className={`mb-4 flex flex-col space-y-1.5 ${className}`} {...props}>
      {children}
    </div>
  );
};

export const CardTitle = ({ children, className = '', ...props }: CardProps) => {
  return (
    <h3
      className={`text-2xl font-bold tracking-tight text-gray-900 dark:text-white font-outfit ${className}`}
      {...props}
    >
      {children}
    </h3>
  );
};

export const CardContent = ({ children, className = '', ...props }: CardProps) => {
  return (
    <div className={`${className}`} {...props}>
      {children}
    </div>
  );
};

export const CardFooter = ({ children, className = '', ...props }: CardProps) => {
  return (
    <div className={`mt-6 flex items-center justify-end ${className}`} {...props}>
      {children}
    </div>
  );
};
