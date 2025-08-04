import { type ReactNode } from "react";

interface ProgressIndicatorProps {
  percentage: number;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  color?: 'blue' | 'green' | 'yellow' | 'red';
  className?: string;
}

export function ProgressIndicator({
  percentage,
  size = 'md',
  showText = true,
  color = 'blue',
  className = '',
}: ProgressIndicatorProps) {
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-12 h-12 text-sm',
    lg: 'w-16 h-16 text-base',
  };

  const colorClasses = {
    blue: 'text-blue-600',
    green: 'text-green-600',
    yellow: 'text-yellow-600',
    red: 'text-red-600',
  };

  const radius = size === 'sm' ? 14 : size === 'md' ? 20 : 28;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className={`relative inline-flex items-center justify-center ${sizeClasses[size]} ${className}`}>
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 60 60">
        <circle
          cx="30"
          cy="30"
          r={radius}
          stroke="currentColor"
          strokeWidth="4"
          fill="transparent"
          className="text-gray-200"
        />
        <circle
          cx="30"
          cy="30"
          r={radius}
          stroke="currentColor"
          strokeWidth="4"
          fill="transparent"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          className={`transition-all duration-300 ease-in-out ${colorClasses[color]}`}
          strokeLinecap="round"
        />
      </svg>
      {showText && (
        <span className={`absolute inset-0 flex items-center justify-center font-medium ${colorClasses[color]}`}>
          {Math.round(percentage)}%
        </span>
      )}
    </div>
  );
} 