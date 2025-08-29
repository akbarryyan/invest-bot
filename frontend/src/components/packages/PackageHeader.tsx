import React from 'react';
import { PlusIcon, CubeIcon } from '@heroicons/react/24/outline';

interface PackageHeaderProps {
  onCreateClick: () => void;
}

const PackageHeader: React.FC<PackageHeaderProps> = ({ onCreateClick }) => {
  return (
    <div className="flex items-center justify-between mb-8">
      <div className="flex items-center space-x-4">
        <div className="p-3 rounded-2xl bg-gradient-to-r from-[#536895] to-[#4a5f8a] shadow-lg">
          <CubeIcon className="w-7 h-7 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Investment Packages</h1>
          <p className="text-gray-600">Manage and monitor investment packages</p>
        </div>
      </div>
      
      <button
        onClick={onCreateClick}
        className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#536895] to-[#4a5f8a] text-white rounded-2xl hover:from-[#4a5f8a] hover:to-[#536895] transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl font-semibold"
      >
        <PlusIcon className="w-5 h-5 mr-2" />
        Add Package
      </button>
    </div>
  );
};

export default PackageHeader;
