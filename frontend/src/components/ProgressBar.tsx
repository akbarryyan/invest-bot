import React, { useState, useEffect } from 'react';

interface ProgressBarProps {
  duration?: number;
  onComplete?: () => void;
  variant?: 'default' | 'gradient' | 'striped' | 'pulse';
  height?: 'sm' | 'md' | 'lg';
  showPercentage?: boolean;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ 
  duration = 400,
  onComplete,
  variant = 'gradient',
  height = 'md',
  showPercentage = true
}) => {
  const [progress, setProgress] = useState(0);

  const heightClasses = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3'
  };

  const getVariantClasses = () => {
    switch (variant) {
      case 'striped':
        return 'bg-gradient-to-r from-blue-500 to-purple-600 bg-stripes bg-stripes-white';
      case 'pulse':
        return 'bg-gradient-to-r from-blue-500 to-purple-600 animate-pulse';
      case 'gradient':
      default:
        return 'bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-600';
    }
  };

  useEffect(() => {
    const startTime = Date.now();
    const endTime = startTime + duration;

    const updateProgress = () => {
      const now = Date.now();
      const elapsed = now - startTime;
      const newProgress = Math.min((elapsed / duration) * 100, 100);
      
      setProgress(newProgress);

      if (newProgress < 100) {
        requestAnimationFrame(updateProgress);
      } else {
        setTimeout(() => {
          onComplete?.();
        }, 100);
      }
    };

    requestAnimationFrame(updateProgress);
  }, [duration, onComplete]);

  return (
    <div className="w-full">
      {/* Progress Bar Container */}
      <div className={`${heightClasses[height]} bg-gray-200 rounded-full overflow-hidden relative`}>
        {/* Progress Fill */}
        <div
          className={`${getVariantClasses()} h-full rounded-full transition-all duration-75 ease-out relative`}
          style={{ width: `${progress}%` }}
        >
          {/* Shine Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
        </div>
      </div>

      {/* Percentage Display */}
      {showPercentage && (
        <div className="mt-2 text-center">
          <span className="text-sm font-medium text-gray-600">
            {Math.round(progress)}%
          </span>
        </div>
      )}

      {/* Loading Text */}
      <div className="mt-2 text-center">
        <div className="flex justify-center space-x-1">
          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;
