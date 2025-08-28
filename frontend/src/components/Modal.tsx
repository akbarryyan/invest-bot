import React from 'react';
import { createPortal } from 'react-dom';
import { XMarkIcon } from '@heroicons/react/24/outline';
import type { ModalProps } from '../types';

const Modal: React.FC<ModalProps> = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  size = 'md' 
}) => {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  const modalContent = (
    <div className="fixed inset-0 z-[2147483646] overflow-hidden">
      {/* Backdrop - ensure it sits above header (very high z-index) */}
      <div
        className="fixed inset-0 z-[2147483646] bg-white/10 backdrop-blur-sm backdrop-saturate-100"
        onClick={onClose}
      />

      {/* Modal - slightly above vertical center */}
      <div className="fixed top-[45%] left-1/2 -translate-x-1/2 -translate-y-1/2 p-4 z-[2147483647] w-full">
        <div className={`relative mx-auto w-full ${sizeClasses[size]} transform overflow-hidden rounded-3xl bg-white shadow-2xl transition-all max-h-[80vh]`}> 
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <button
              onClick={onClose}
              className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
          
          {/* Content */}
          <div className="px-6 py-4 overflow-y-auto max-h-[calc(80vh-120px)]">
            {children}
          </div>
        </div>
      </div>
    </div>
  );

  // Render with portal to escape any parent stacking context (ensures header is blurred/overlaid)
  return createPortal(modalContent, document.body);
};

export default Modal;
