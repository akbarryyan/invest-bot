import React from 'react';
import { UserCircleIcon, BellIcon } from '@heroicons/react/24/outline';

interface WelcomeHeaderProps {
  userName: string;
  currentTime: string;
}

const WelcomeHeader: React.FC<WelcomeHeaderProps> = ({ userName, currentTime }) => {
  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-gradient-to-r from-[#536895] to-[#4a5f8a] rounded-2xl flex items-center justify-center">
            <UserCircleIcon className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Selamat datang, {userName}! 👋
            </h1>
            <p className="text-gray-600">
              {currentTime} • Dashboard Invest Bot
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <button className="relative p-3 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all duration-200">
            <BellIcon className="w-6 h-6" />
            <span className="absolute top-2 right-2 w-3 h-3 bg-red-500 rounded-full"></span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default WelcomeHeader;
