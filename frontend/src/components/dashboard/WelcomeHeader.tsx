import React from 'react';
import { UserCircleIcon, BellIcon, SparklesIcon } from '@heroicons/react/24/outline';

interface WelcomeHeaderProps {
  userName: string;
  currentTime: string;
}

const WelcomeHeader: React.FC<WelcomeHeaderProps> = ({ userName, currentTime }) => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/50 rounded-3xl p-6 sm:p-8 shadow-lg border border-gray-100/80 backdrop-blur-sm">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-purple-400 to-pink-600 rounded-full blur-2xl"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          {/* Left Section - Welcome & Info */}
          <div className="flex-1 space-y-4">
            {/* Avatar & Welcome */}
            <div className="flex items-center space-x-4 sm:space-x-6">
              <div className="relative">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-[#536895] via-[#4a5f8a] to-[#3d4f7a] rounded-2xl flex items-center justify-center shadow-xl ring-4 ring-white/50">
                  <UserCircleIcon className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                </div>
                {/* Decorative Elements */}
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                  <SparklesIcon className="w-3 h-3 text-white" />
                </div>
                <div className="absolute -bottom-1 -left-1 w-4 h-4 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full shadow-lg"></div>
              </div>
              
              <div className="space-y-2">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 via-[#536895] to-[#4a5f8a] bg-clip-text text-transparent leading-tight">
                  Selamat datang, {userName}! 👋
                </h1>
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2 text-gray-600">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                    <span className="text-sm sm:text-base font-medium">
                      {currentTime}
                    </span>
                  </div>
                  <span className="text-gray-400">•</span>
                  <span className="text-sm sm:text-base text-gray-500 font-medium">
                    Dashboard Invest Bot
                  </span>
                </div>
              </div>
            </div>

            {/* Subtitle & Description */}
            <div className="max-w-2xl">
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                Monitor platform performance, kelola investasi, dan lihat insight bisnis Anda dalam satu dashboard yang terintegrasi.
              </p>
            </div>
          </div>
          
          {/* Right Section - Actions & Stats */}
          <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 lg:space-x-6">
            {/* Quick Stats */}
            <div className="hidden sm:flex items-center space-x-4 text-center">
              <div className="px-4 py-2 bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-sm">
                <div className="text-lg font-bold text-gray-900">24/7</div>
                <div className="text-xs text-gray-500">Support</div>
              </div>
              <div className="px-4 py-2 bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-sm">
                <div className="text-lg font-bold text-emerald-600">99.9%</div>
                <div className="text-xs text-gray-500">Uptime</div>
              </div>
            </div>

            {/* Notification Button */}
            <div className="relative">
              <button className="group relative p-3 sm:p-4 bg-white/80 backdrop-blur-sm hover:bg-white transition-all duration-300 rounded-2xl border border-gray-200/50 shadow-sm hover:shadow-lg hover:scale-105">
                <BellIcon className="w-6 h-6 sm:w-7 sm:h-7 text-gray-600 group-hover:text-[#536895] transition-colors duration-300" />
                
                {/* Notification Badge */}
                <span className="absolute top-2 right-2 w-3 h-3 bg-red-500 rounded-full animate-pulse ring-2 ring-white"></span>
                
                {/* Hover Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#536895]/10 to-[#4a5f8a]/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            </div>

            {/* Action Button */}
            <button className="group px-6 py-3 sm:px-8 sm:py-4 bg-gradient-to-r from-[#536895] via-[#4a5f8a] to-[#536895] hover:from-[#4a5f8a] hover:via-[#536895] hover:to-[#4a5f8a] text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1">
              <span className="flex items-center space-x-2">
                <SparklesIcon className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                <span className="text-sm sm:text-base">Quick Start</span>
              </span>
            </button>
          </div>
        </div>

        {/* Bottom Decorative Line */}
        <div className="mt-6 pt-6 border-t border-gray-200/50">
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>🚀 Platform siap untuk performa maksimal</span>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeHeader;
