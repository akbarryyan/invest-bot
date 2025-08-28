import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import LoadingSpinner from './LoadingSpinner';
import ProgressBar from './ProgressBar';

interface PageTransitionProps {
  children: React.ReactNode;
}

const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [displayLocation, setDisplayLocation] = useState(useLocation());
  const [transitionStage, setTransitionStage] = useState('fadeIn');
  const location = useLocation();

  useEffect(() => {
    if (location !== displayLocation) {
      setTransitionStage('fadeOut');
      setIsLoading(true);
      
      // Simulate loading time
      const timer = setTimeout(() => {
        setDisplayLocation(location);
        setTransitionStage('fadeIn');
        setIsLoading(false);
      }, 400);

      return () => clearTimeout(timer);
    }
  }, [location, displayLocation]);

  const handleProgressComplete = () => {
    // Progress bar completed, but we still wait for the timer
    // This creates a more realistic loading experience
  };

  return (
    <>
      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-white/95 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="text-center max-w-md">
            {/* Advanced Loading Spinner */}
            <LoadingSpinner 
              size="xl" 
              variant="default" 
              text="Loading Page..." 
              showText={true}
            />
            
            {/* Progress Bar */}
            <div className="mt-8 px-8">
              <ProgressBar 
                duration={400}
                variant="gradient"
                height="lg"
                showPercentage={true}
                onComplete={handleProgressComplete}
              />
            </div>
            
            {/* Loading Message */}
            <div className="mt-6 space-y-2">
              <div className="h-2 bg-gray-200 rounded-full w-32 mx-auto animate-pulse"></div>
              <div className="h-2 bg-gray-200 rounded-full w-24 mx-auto animate-pulse"></div>
            </div>

            {/* Page Name */}
            <div className="mt-4">
              <p className="text-sm text-gray-500">
                Navigating to: <span className="font-medium text-gray-700">{location.pathname === '/' ? 'Dashboard' : location.pathname.slice(1).charAt(0).toUpperCase() + location.pathname.slice(2)}</span>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Page Content with Enhanced Transition */}
      <div
        className={`transition-all duration-500 ease-out ${
          transitionStage === 'fadeOut' 
            ? 'opacity-0 transform translate-y-8 scale-95' 
            : 'opacity-100 transform translate-y-0 scale-100'
        }`}
      >
        {children}
      </div>
    </>
  );
};

export default PageTransition;
