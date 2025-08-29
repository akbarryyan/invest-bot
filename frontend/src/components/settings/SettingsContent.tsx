import React from 'react';
import { Cog6ToothIcon } from '@heroicons/react/24/outline';

const SettingsContent: React.FC = () => {
  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-12 text-center">
      <Cog6ToothIcon className="w-20 h-20 text-gray-400 mx-auto mb-6" />
      <h3 className="text-2xl font-bold text-gray-900 mb-4">Pengaturan Sistem</h3>
      <p className="text-gray-600 mb-8 max-w-md mx-auto">
        Halaman pengaturan dengan konfigurasi lengkap akan segera tersedia. Fitur ini akan memungkinkan admin mengatur semua aspek platform.
      </p>
      <div className="flex justify-center space-x-4">
        <button className="px-6 py-3 bg-gradient-to-r from-[#536895] to-[#4a5f8a] text-white rounded-2xl hover:from-[#4a5f8a] hover:to-[#536895] transition-all duration-200 font-semibold">
          Konfigurasi
        </button>
        <button className="px-6 py-3 bg-gray-100 text-gray-700 rounded-2xl hover:bg-gray-200 transition-all duration-200 font-semibold">
          Security
        </button>
      </div>
    </div>
  );
};

export default SettingsContent;
