import React from 'react';
import { CurrencyDollarIcon } from '@heroicons/react/24/outline';

const TransactionContent: React.FC = () => {
  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-12 text-center">
      <CurrencyDollarIcon className="w-20 h-20 text-gray-400 mx-auto mb-6" />
      <h3 className="text-2xl font-bold text-gray-900 mb-4">Manajemen Transaksi</h3>
      <p className="text-gray-600 mb-8 max-w-md mx-auto">
        Halaman untuk mengelola dan memantau semua transaksi akan segera tersedia. Fitur ini akan memberikan insight lengkap tentang aktivitas finansial platform.
      </p>
      <div className="flex justify-center space-x-4">
        <button className="px-6 py-3 bg-gradient-to-r from-[#536895] to-[#4a5f8a] text-white rounded-2xl hover:from-[#4a5f8a] hover:to-[#536895] transition-all duration-200 font-semibold">
          Lihat Transaksi
        </button>
        <button className="px-6 py-3 bg-gray-100 text-gray-700 rounded-2xl hover:bg-gray-200 transition-all duration-200 font-semibold">
          Generate Laporan
        </button>
      </div>
    </div>
  );
};

export default TransactionContent;
