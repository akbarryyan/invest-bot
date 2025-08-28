import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'pulse' | 'bounce' | 'wave';
  text?: string;
  showText?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  variant = 'default',
  text = 'Loading...',
  showText = true 
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-20 h-20'
  };

  const renderSpinner = () => {
    switch (variant) {
      case 'pulse':
        return (
          <div className={`${sizeClasses[size]} relative`}>
            <div className="absolute inset-0 bg-blue-500 rounded-full animate-ping opacity-75"></div>
            <div className="absolute inset-0 bg-blue-600 rounded-full"></div>
          </div>
        );
      
      case 'bounce':
        return (
          <div className="flex space-x-1">
            <div className={`${sizeClasses[size].split(' ')[0]} h-3 bg-blue-500 rounded-full animate-bounce`} style={{ animationDelay: '0ms' }}></div>
            <div className={`${sizeClasses[size].split(' ')[0]} h-3 bg-blue-500 rounded-full animate-bounce`} style={{ animationDelay: '150ms' }}></div>
            <div className={`${sizeClasses[size].split(' ')[0]} h-3 bg-blue-500 rounded-full animate-bounce`} style={{ animationDelay: '300ms' }}></div>
          </div>
        );
      
      case 'wave':
        return (
          <div className="flex space-x-1">
            <div className={`${sizeClasses[size].split(' ')[0]} h-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-pulse`} style={{ animationDelay: '0ms' }}></div>
            <div className={`${sizeClasses[size].split(' ')[0]} h-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-pulse`} style={{ animationDelay: '100ms' }}></div>
            <div className={`${sizeClasses[size].split(' ')[0]} h-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-pulse`} style={{ animationDelay: '200ms' }}></div>
            <div className={`${sizeClasses[size].split(' ')[0]} h-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-pulse`} style={{ animationDelay: '300ms' }}></div>
          </div>
        );
      
      default:
        return (
          <div className={`${sizeClasses[size]} relative`}>
            <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-transparent border-t-blue-500 rounded-full animate-spin"></div>
            <div className="absolute inset-0 border-4 border-transparent border-r-purple-500 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col items-center justify-center">
      {renderSpinner()}
      {showText && (
        <div className="mt-4 text-center">
          <p className="text-gray-600 font-medium">{text}</p>
          {/* Animated dots */}
          <div className="flex justify-center mt-2 space-x-1">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoadingSpinner;
