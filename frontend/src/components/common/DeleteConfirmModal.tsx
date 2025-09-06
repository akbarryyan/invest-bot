import React from 'react';
import { createPortal } from 'react-dom';
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

  const modalContent = (
    <div className="fixed inset-0 z-[2147483646] overflow-hidden">
      {/* Backdrop - ensure it sits above header (very high z-index) */}
      <div
        className="fixed inset-0 z-[2147483646] bg-white/10 backdrop-blur-sm backdrop-saturate-100"
        onClick={onClose}
      />

      {/* Modal - slightly above vertical center */}
      <div className="fixed top-[45%] left-1/2 -translate-x-1/2 -translate-y-1/2 p-4 z-[2147483647] w-full">
        <div className="relative mx-auto w-full max-w-lg transform overflow-hidden rounded-3xl bg-white shadow-2xl transition-all max-h-[80vh]">
          {/* Header - Sama seperti DeleteConfirmationModal.tsx */}
          <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-2xl bg-red-100">
                <ExclamationTriangleIcon className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                {title}
              </h3>
            </div>
            <button
              onClick={onClose}
              className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          {/* Content - Sama seperti DeleteConfirmationModal.tsx */}
          <div className="px-6 py-4 overflow-y-auto max-h-[calc(80vh-120px)]">
            <div className="space-y-6">
              {/* Warning Icon */}
              <div className="flex justify-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                  <ExclamationTriangleIcon className="w-8 h-8 text-red-600" />
                </div>
              </div>

              {/* Warning Message */}
              <div className="text-center">
                <p className="text-gray-600">
                  {message}
                </p>
                <p className="text-red-600 text-sm mt-2">
                  This action cannot be undone.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-2xl hover:bg-gray-50 font-semibold"
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={onConfirm}
                  className="px-6 py-3 bg-red-600 text-white rounded-2xl hover:bg-red-700 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Deleting...
                    </div>
                  ) : (
                    'Delete'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Render with portal to escape any parent stacking context (ensures header is blurred/overlaid)
  return createPortal(modalContent, document.body);
};