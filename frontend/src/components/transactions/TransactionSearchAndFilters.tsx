import React from 'react';
import { MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline';

const TransactionSearchAndFilters: React.FC = () => {
  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Cari transaksi..."
              className="block w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-2xl leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#536895] focus:border-[#536895] text-sm font-medium transition-all duration-200 hover:bg-white hover:border-gray-300"
            />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <FunnelIcon className="w-5 h-5 text-gray-500" />
            <select className="px-4 py-2 border-2 border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#536895] focus:border-[#536895] transition-all duration-200">
              <option>Semua Tipe</option>
              <option>Deposit</option>
              <option>Withdraw</option>
              <option>Claim</option>
              <option>Referral</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionSearchAndFilters;
