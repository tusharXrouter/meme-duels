import React from 'react';

interface LoadingSpinnerProps {
  text?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function LoadingSpinner({ text, size = 'md', className = '' }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-12 w-12',
    lg: 'h-16 w-16'
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className={`animate-spin rounded-full border-b-2 border-green-400 ${sizeClasses[size]}`} />
      {text && (
        <span className={`text-gray-300 font-medium ${textSizeClasses[size]}`}>
          {text}
        </span>
      )}
    </div>
  );
}
