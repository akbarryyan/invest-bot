import React from 'react';
import { MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline';

const PackageSearchAndFilters: React.FC = () => {
  return (
    <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100 mb-8">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-2xl leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-[#536895] focus:border-transparent transition-all duration-200"
            placeholder="Search packages..."
          />
        </div>
        
        {/* Filters */}
        <div className="flex items-center space-x-4">
          <button className="inline-flex items-center px-4 py-3 border border-gray-200 rounded-2xl text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#536895] focus:ring-offset-2 transition-all duration-200">
            <FunnelIcon className="h-4 w-4 mr-2" />
            Filters
          </button>
          
          <select className="inline-flex items-center px-4 py-3 border border-gray-200 rounded-2xl text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#536895] focus:ring-offset-2 transition-all duration-200">
            <option>All Status</option>
            <option>Active</option>
            <option>Inactive</option>
          </select>
          
          <select className="inline-flex items-center px-4 py-3 border border-gray-200 rounded-2xl text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#536895] focus:ring-offset-2 transition-all duration-200">
            <option>All Types</option>
            <option>Starter</option>
            <option>Premium</option>
            <option>VIP</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default PackageSearchAndFilters;
