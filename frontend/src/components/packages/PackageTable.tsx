import React from 'react';
import { 
  PencilIcon, 
  TrashIcon, 
  EyeIcon, 
  EyeSlashIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import type { Package } from '../../types';

interface PackageTableProps {
  packages: Package[];
  isLoading: boolean;
  onEdit: (pkg: Package) => void;
  onDelete: (pkg: Package) => void;
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
  onPageChange: (page: number) => void;
}

export const PackageTable: React.FC<PackageTableProps> = ({
  packages,
  isLoading,
  onEdit,
  onDelete,
  pagination,
  onPageChange
}) => {
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-gray-200 rounded-2xl h-64"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Package Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {packages.map((pkg) => (
          <div key={pkg.id} className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
            {/* Card Header */}
            <div className="relative">
              {/* Image */}
              <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden">
                {pkg.image_url ? (
                  <img 
                    src={pkg.image_url} 
                    alt={pkg.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center mx-auto mb-3">
                        <ChartBarIcon className="w-8 h-8 text-gray-500" />
                      </div>
                      <p className="text-sm text-gray-500">No Image</p>
                    </div>
                  </div>
                )}
                
                {/* Status Badge */}
                <div className="absolute top-4 right-4">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                    pkg.is_active 
                      ? 'bg-green-100 text-green-800 border border-green-200' 
                      : 'bg-red-100 text-red-800 border border-red-200'
                  }`}>
                    {pkg.is_active ? (
                      <>
                        <EyeIcon className="w-3 h-3 mr-1" />
                        Active
                      </>
                    ) : (
                      <>
                        <EyeSlashIcon className="w-3 h-3 mr-1" />
                        Inactive
                      </>
                    )}
                  </span>
                </div>

                {/* ID Badge */}
                <div className="absolute top-4 left-4">
                  <span className="inline-flex items-center px-2 py-1 rounded-lg text-xs font-bold bg-white text-gray-700 border border-gray-200 shadow-sm">
                    #{pkg.id}
                  </span>
                </div>
              </div>
            </div>

            {/* Card Content */}
            <div className="p-6">
              {/* Package Name */}
              <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1">
                {pkg.name}
              </h3>
              
              {/* Description */}
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {pkg.description}
              </p>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                {/* Price */}
                <div className="text-center p-3 bg-green-50 rounded-2xl border border-green-100">
                  <div className="flex items-center justify-center mb-1">
                    <CurrencyDollarIcon className="w-4 h-4 text-green-600 mr-1" />
                    <span className="text-xs font-medium text-green-700">Price</span>
                  </div>
                  <p className="text-lg font-bold text-green-800">
                    {formatCurrency(pkg.price)}
                  </p>
                </div>

                {/* Duration */}
                <div className="text-center p-3 bg-blue-50 rounded-2xl border border-blue-100">
                  <div className="flex items-center justify-center mb-1">
                    <CalendarIcon className="w-4 h-4 text-blue-600 mr-1" />
                    <span className="text-xs font-medium text-blue-700">Duration</span>
                  </div>
                  <p className="text-lg font-bold text-blue-800">
                    {pkg.duration_days} days
                  </p>
                </div>
              </div>

              {/* Daily Return */}
              <div className="text-center p-4 bg-purple-50 rounded-2xl border border-purple-100 mb-6">
                <div className="flex items-center justify-center mb-2">
                  <ChartBarIcon className="w-4 h-4 text-purple-600 mr-2" />
                  <span className="text-sm font-medium text-purple-700">Daily Return</span>
                </div>
                <p className="text-2xl font-bold text-purple-800">
                  {formatCurrency(pkg.daily_return)}
                </p>
                <p className="text-xs text-purple-600 mt-1">per day</p>
              </div>

              {/* Dates */}
              <div className="space-y-2 mb-6">
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Created:</span>
                  <span>{formatDate(pkg.created_at)}</span>
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Updated:</span>
                  <span>{formatDate(pkg.updated_at)}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <button
                  onClick={() => onEdit(pkg)}
                  className="flex-1 mr-2 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors duration-200 font-medium text-sm flex items-center justify-center"
                  title="Edit Package"
                >
                  <PencilIcon className="w-4 h-4 mr-1" />
                  Edit
                </button>
                <button
                  onClick={() => onDelete(pkg)}
                  className="flex-1 ml-2 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors duration-200 font-medium text-sm flex items-center justify-center"
                  title="Delete Package"
                >
                  <TrashIcon className="w-4 h-4 mr-1" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {pagination.total_pages > 1 && (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 px-6 py-4 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing page {pagination.page} of {pagination.total_pages} 
            ({pagination.total} total packages)
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onPageChange(pagination.page - 1)}
              disabled={pagination.page <= 1}
              className="px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeftIcon className="w-4 h-4" />
            </button>
            <span className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-50 rounded-xl">
              {pagination.page}
            </span>
            <button
              onClick={() => onPageChange(pagination.page + 1)}
              disabled={pagination.page >= pagination.total_pages}
              className="px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRightIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
