import React from 'react';
import { CubeIcon, PlusIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

const PackageContent: React.FC = () => {
  return (
    <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
      <div className="text-center">
        <div className="w-20 h-20 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
          <CubeIcon className="w-10 h-10 text-gray-400" />
        </div>
        <h3 className="text-xl font-bold text-gray-700 mb-2">No packages yet</h3>
        <p className="text-gray-500 mb-6">Create your first investment package to get started</p>
        <Link
          to="/packages/create"
          className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#536895] to-[#4a5f8a] text-white rounded-2xl hover:from-[#4a5f8a] hover:to-[#536895] transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl font-semibold"
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          Create First Package
        </Link>
      </div>
    </div>
  );
};

export default PackageContent;
