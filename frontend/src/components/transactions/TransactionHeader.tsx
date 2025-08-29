import React from 'react';
import { CurrencyDollarIcon, PlusIcon } from '@heroicons/react/24/outline';

const TransactionHeader: React.FC = () => {
  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div className="flex-1">
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-3">
            Transaksi 💰
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl">
            Monitor semua transaksi yang terjadi di platform. Deposit, withdraw, claim, dan referral bonus.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <button className="px-6 py-3 bg-gradient-to-r from-[#536895] to-[#4a5f8a] text-white rounded-2xl hover:from-[#4a5f8a] hover:to-[#536895] transition-all duration-200 transform hover:scale-105 shadow-lg font-semibold flex items-center justify-center">
            <PlusIcon className="w-5 h-5 mr-2" />
            Tambah Transaksi
          </button>
          <button className="px-6 py-3 bg-white border-2 border-gray-200 text-gray-700 rounded-2xl hover:border-gray-300 hover:bg-gray-50 transition-all duration-200 font-semibold flex items-center justify-center">
            <CurrencyDollarIcon className="w-5 h-5 mr-2" />
            Export Laporan
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransactionHeader;
