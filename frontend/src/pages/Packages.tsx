import React from 'react';
import { CubeIcon, PlusIcon, MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline';

const Packages: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="flex-1">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-3">
              Paket Investasi 📦
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl">
              Kelola semua paket investasi yang tersedia untuk user. Buat, edit, dan hapus paket sesuai kebutuhan.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <button className="px-6 py-3 bg-gradient-to-r from-[#536895] to-[#4a5f8a] text-white rounded-2xl hover:from-[#4a5f8a] hover:to-[#536895] transition-all duration-200 transform hover:scale-105 shadow-lg font-semibold flex items-center justify-center">
              <PlusIcon className="w-5 h-5 mr-2" />
              Tambah Paket
            </button>
            <button className="px-6 py-3 bg-white border-2 border-gray-200 text-gray-700 rounded-2xl hover:border-gray-300 hover:bg-gray-50 transition-all duration-200 font-semibold flex items-center justify-center">
              <CubeIcon className="w-5 h-5 mr-2" />
              Export Data
            </button>
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Cari paket investasi..."
                className="block w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-2xl leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#536895] focus:border-[#536895] text-sm font-medium transition-all duration-200 hover:bg-white hover:border-gray-300"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <FunnelIcon className="w-5 h-5 text-gray-500" />
              <select className="px-4 py-2 border-2 border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#536895] focus:border-[#536895] transition-all duration-200">
                <option>Semua Kategori</option>
                <option>Gold</option>
                <option>Silver</option>
                <option>Bronze</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Content Placeholder */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-12 text-center">
        <CubeIcon className="w-20 h-20 text-gray-400 mx-auto mb-6" />
        <h3 className="text-2xl font-bold text-gray-900 mb-4">Paket Investasi</h3>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          Halaman untuk mengelola paket investasi akan segera tersedia. Fitur ini akan memungkinkan admin untuk membuat, mengedit, dan menghapus paket investasi.
        </p>
        <div className="flex justify-center space-x-4">
          <button className="px-6 py-3 bg-gradient-to-r from-[#536895] to-[#4a5f8a] text-white rounded-2xl hover:from-[#4a5f8a] hover:to-[#536895] transition-all duration-200 font-semibold">
            Tambah Paket Baru
          </button>
          <button className="px-6 py-3 bg-gray-100 text-gray-700 rounded-2xl hover:bg-gray-200 transition-all duration-200 font-semibold">
            Lihat Demo
          </button>
        </div>
      </div>
    </div>
  );
};

export default Packages;
