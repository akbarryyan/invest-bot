import React from 'react';
import { XMarkIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  isLoading: boolean;
  title: string;
  message: string;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  isLoading,
  title,
  message
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose}></div>

        {/* Modal panel */}
        <div className="inline-block align-bottom bg-white rounded-3xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          {/* Header */}
          <div className="bg-red-600 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-2xl bg-white bg-opacity-20">
                  <ExclamationTriangleIcon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white">
                  {title}
                </h3>
              </div>
              <button
                onClick={onClose}
                className="text-white hover:text-gray-200 transition-colors"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-6">
            <div className="text-center">
              <ExclamationTriangleIcon className="mx-auto h-12 w-12 text-red-600 mb-4" />
              <p className="text-gray-700 mb-6">
                {message}
              </p>
            </div>

            {/* Buttons */}
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-2xl hover:border-gray-400 hover:bg-gray-50 transition-all duration-200 font-semibold disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={onConfirm}
                disabled={isLoading}
                className="px-6 py-3 bg-red-600 text-white rounded-2xl hover:bg-red-700 transition-all duration-200 font-semibold disabled:opacity-50 flex items-center"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Deleting...
                  </>
                ) : (
                  'Delete'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
