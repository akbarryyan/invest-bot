import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { XMarkIcon, CubeIcon } from '@heroicons/react/24/outline';
import type { Package, CreatePackageRequest, UpdatePackageRequest } from '../../types';

interface PackageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreatePackageRequest | UpdatePackageRequest) => Promise<void>;
  isLoading: boolean;
  mode: 'create' | 'edit';
  package?: Package | null;
}

export const PackageModal: React.FC<PackageModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
  mode,
  package: packageData
}) => {
  const [formData, setFormData] = useState<CreatePackageRequest>({
    name: '',
    description: '',
    price: 0,
    duration_days: 30,
    daily_return: 0,
    image_url: '',
  });

  // Reset form when modal opens/closes or package changes
  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && packageData) {
        setFormData({
          name: packageData.name,
          description: packageData.description,
          price: packageData.price,
          duration_days: packageData.duration_days,
          daily_return: packageData.daily_return,
          image_url: packageData.image_url || '',
        });
      } else {
        setFormData({
          name: '',
          description: '',
          price: 0,
          duration_days: 30,
          daily_return: 0,
          image_url: '',
        });
      }
    }
  }, [isOpen, mode, packageData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value,
    }));
  };

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
        <div className="relative mx-auto w-full max-w-2xl transform overflow-hidden rounded-3xl bg-white shadow-2xl transition-all max-h-[80vh]">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#536895] to-[#4a5f8a] px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-2xl bg-white bg-opacity-20">
                  <CubeIcon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white">
                  {mode === 'create' ? 'Create New Package' : 'Edit Package'}
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

          {/* Form - Scrollable */}
          <div className="px-6 py-6 space-y-6 overflow-y-auto max-h-[calc(80vh-120px)]">
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Package Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#536895] focus:border-[#536895] transition-all duration-200"
                placeholder="Enter package name"
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                rows={3}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#536895] focus:border-[#536895] transition-all duration-200"
                placeholder="Enter package description"
              />
            </div>

            {/* Price and Duration Row */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                  Price (IDR) *
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                  min="0"
                  step="1000"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#536895] focus:border-[#536895] transition-all duration-200"
                  placeholder="0"
                />
              </div>
              <div>
                <label htmlFor="duration_days" className="block text-sm font-medium text-gray-700 mb-2">
                  Duration (Days) *
                </label>
                <input
                  type="number"
                  id="duration_days"
                  name="duration_days"
                  value={formData.duration_days}
                  onChange={handleInputChange}
                  required
                  min="1"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#536895] focus:border-[#536895] transition-all duration-200"
                  placeholder="30"
                />
              </div>
            </div>

            {/* Daily Return and Image URL Row */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="daily_return" className="block text-sm font-medium text-gray-700 mb-2">
                  Daily Return (IDR) *
                </label>
                <input
                  type="number"
                  id="daily_return"
                  name="daily_return"
                  value={formData.daily_return}
                  onChange={handleInputChange}
                  required
                  min="0"
                  step="1000"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#536895] focus:border-[#536895] transition-all duration-200"
                  placeholder="0"
                />
              </div>
              <div>
                <label htmlFor="image_url" className="block text-sm font-medium text-gray-700 mb-2">
                  Image URL
                </label>
                <input
                  type="url"
                  id="image_url"
                  name="image_url"
                  value={formData.image_url}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#536895] focus:border-[#536895] transition-all duration-200"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            </div>

            {/* Image Preview */}
            {formData.image_url && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image Preview
                </label>
                <div className="w-32 h-32 border-2 border-gray-200 rounded-2xl overflow-hidden">
                  <img
                    src={formData.image_url}
                    alt="Package preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCIgdmlld0JveD0iMCAwIDEyOCAxMjgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjgiIGhlaWdodD0iMTI4IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik02NCAzMkM3My42NzY5IDMyIDgxLjMzMzMgMzkuNjY2NyA4MS4zMzMzIDQ5LjMzMzNDODEuMzMzMyA1OSA3My42NzY5IDY2LjY2NjcgNjQgNjYuNjY2N0M1NC4zMjMxIDY2LjY2NjcgNDYuNjY2NyA1OSA0Ni42NjY3IDQ5LjMzMzNDNDYuNjY2NyAzOS42NjY3IDU0LjMyMzEgMzIgNjQgMzJaIiBmaWxsPSIjOUI5QkEwIi8+CjxwYXRoIGQ9Ik02NCA3MkM0Ny40MzE1IDcyIDM0IDU4LjU2ODUgMzQgNDJDMzQgMjUuNDMxNSA0Ny40MzE1IDEyIDY0IDEyQzgwLjU2ODUgMTIgOTQgMjUuNDMxNSA5NCA0MkM5NCA1OC41Njg1IDgwLjU2ODUgNzIgNjQgNzJaIiBmaWxsPSIjOUI5QkEwIi8+Cjwvc3ZnPgo=';
                    }}
                  />
                </div>
              </div>
            )}

            {/* Buttons */}
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-2xl hover:border-gray-400 hover:bg-gray-50 transition-all duration-200 font-semibold disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-3 bg-gradient-to-r from-[#536895] to-[#4a5f8a] text-white rounded-2xl hover:from-[#4a5f8a] hover:to-[#536895] transition-all duration-200 font-semibold disabled:opacity-50 flex items-center"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    {mode === 'create' ? 'Creating...' : 'Updating...'}
                  </>
                ) : (
                  mode === 'create' ? 'Create Package' : 'Update Package'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Render with portal to escape any parent stacking context (ensures header is blurred/overlaid)
  return createPortal(modalContent, document.body);
};
