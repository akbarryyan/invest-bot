import React from 'react';
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

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop - frosted glass blur over entire page including header */}
      <div
        className="fixed inset-0 bg-white/30 backdrop-blur-md backdrop-saturate-150 transition-opacity"
        onClick={onClose}
      />

      {/* Modal - perfectly centered */}
      <div className="relative flex min-h-screen items-center justify-center p-4">
        <div className={`relative w-full ${sizeClasses[size]} transform overflow-hidden rounded-3xl bg-white shadow-2xl transition-all`}> 
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
          <div className="px-6 py-4">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
