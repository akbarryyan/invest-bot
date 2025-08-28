import React from 'react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import Modal from './Modal';
import type { User } from '../types';

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  user: User | null;
  isLoading?: boolean;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
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
        <div className="text-center space-y-2">
          <h3 className="text-lg font-semibold text-gray-900">
            Are you sure you want to delete this user?
          </h3>
          <p className="text-gray-600">
            This action cannot be undone. All user data, transactions, and investments will be permanently deleted.
          </p>
        </div>

        {/* User Details */}
        <div className="bg-gray-50 rounded-2xl p-4 space-y-3">
          <h4 className="font-semibold text-gray-900">User Details:</h4>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Name:</span>
              <p className="font-medium text-gray-900">
                {user.first_name} {user.last_name}
              </p>
            </div>
            
            <div>
              <span className="text-gray-500">Username:</span>
              <p className="font-medium text-gray-900">
                {user.username || 'N/A'}
              </p>
            </div>
            
            <div>
              <span className="text-gray-500">Telegram ID:</span>
              <p className="font-medium text-gray-900">
                {user.telegram_id}
              </p>
            </div>
            
            <div>
              <span className="text-gray-500">Balance:</span>
              <p className="font-medium text-gray-900">
                {formatCurrency(user.balance)}
              </p>
            </div>
            
            <div>
              <span className="text-gray-500">Total Profit:</span>
              <p className="font-medium text-gray-900">
                {formatCurrency(user.total_profit)}
              </p>
            </div>
            
            <div>
              <span className="text-gray-500">Status:</span>
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                user.is_active 
                  ? 'bg-emerald-100 text-emerald-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {user.is_active ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
        </div>

        {/* Warning List */}
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
          <h4 className="font-semibold text-red-800 mb-2">This will delete:</h4>
          <ul className="text-sm text-red-700 space-y-1">
            <li>• User account and profile</li>
            <li>• All active investments</li>
            <li>• Transaction history</li>
            <li>• Referral relationships</li>
            <li>• Daily claim records</li>
          </ul>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end space-x-4 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-2xl hover:bg-gray-200 transition-all duration-200 font-semibold"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-2xl hover:from-red-600 hover:to-red-700 transition-all duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Deleting...</span>
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
