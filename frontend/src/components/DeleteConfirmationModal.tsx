import React from 'react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import Modal from './Modal';
import type { User, UserDeleteConfirmationModalProps } from '../types';

const DeleteConfirmationModal: React.FC<UserDeleteConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  user,
  isLoading = false
}) => {
  if (!user) return null;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Delete User"
      size="md"
    >
      <div className="space-y-6">
        {/* Warning Icon */}
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
            <ExclamationTriangleIcon className="w-8 h-8 text-red-600" />
          </div>
        </div>

        {/* Warning Message */}
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Are you sure you want to delete this user?
          </h3>
          <p className="text-gray-600">
            This action cannot be undone. All user data, transactions, and packages will be permanently deleted.
          </p>
        </div>

        {/* User Information */}
        <div className="bg-gray-50 rounded-2xl p-4">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-[#536895] to-[#4a5f8a] rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">
                {user.first_name?.charAt(0)}{user.last_name?.charAt(0)}
              </span>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">
                {user.first_name} {user.last_name}
              </h4>
              <p className="text-sm text-gray-500">
                @{user.username || 'N/A'} • ID: {user.telegram_id}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Balance:</span>
              <p className="font-semibold text-gray-900">{formatCurrency(user.balance)}</p>
            </div>
            <div>
              <span className="text-gray-500">Total Profit:</span>
              <p className="font-semibold text-emerald-600">{formatCurrency(user.total_profit)}</p>
            </div>
            <div>
              <span className="text-gray-500">Referral Code:</span>
              <p className="font-semibold text-gray-900">{user.referral_code}</p>
            </div>
            <div>
              <span className="text-gray-500">Status:</span>
              <p className={`font-semibold ${user.is_active ? 'text-emerald-600' : 'text-red-600'}`}>
                {user.is_active ? 'Active' : 'Inactive'}
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-2xl hover:bg-gray-50 transition-all duration-200 font-semibold"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-6 py-3 bg-red-600 text-white rounded-2xl hover:bg-red-700 transition-all duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Deleting...
              </div>
            ) : (
              'Delete User'
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteConfirmationModal;

