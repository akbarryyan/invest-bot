import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { XMarkIcon, PhotoIcon } from '@heroicons/react/24/outline';
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

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

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
        setPreviewUrl(packageData.image_url || '');
      } else {
        setFormData({
          name: '',
          description: '',
          price: 0,
          duration_days: 30,
          daily_return: 0,
          image_url: '',
        });
        setPreviewUrl('');
        setSelectedFile(null);
      }
    }
  }, [isOpen, mode, packageData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      let imageUrl = formData.image_url;
      
      // If there's a selected file, upload it first
      if (selectedFile) {
        const base64 = await convertToBase64(selectedFile);
        
        // Upload base64 image to server
        const uploadResponse = await fetch('http://localhost:8000/api/upload/base64', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            base64: base64,
            filename: selectedFile.name
          })
        });
        
        if (!uploadResponse.ok) {
          throw new Error('Failed to upload image');
        }
        
        const uploadData = await uploadResponse.json();
        imageUrl = uploadData.data.url;
      }
      
      const submitData = {
        ...formData,
        image_url: imageUrl
      };
      
      await onSubmit(submitData);
    } catch (error) {
      console.error('Error uploading image:', error);
      // Fallback to base64 if upload fails
      if (selectedFile) {
        const base64 = await convertToBase64(selectedFile);
        const submitData = {
          ...formData,
          image_url: base64
        };
        await onSubmit(submitData);
      } else {
        await onSubmit(formData);
      }
    }
  };

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      
      // Create preview URL
      const preview = URL.createObjectURL(file);
      setPreviewUrl(preview);
    }
  };

  const handleRemoveImage = () => {
    setSelectedFile(null);
    setPreviewUrl('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
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
          {/* Header - Sama seperti Modal.tsx */}
          <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
            <div className="flex items-center space-x-3">
              <h3 className="text-lg font-semibold text-gray-900">
                {mode === 'create' ? 'Create New Package' : 'Edit Package'}
              </h3>
            </div>
            <button
              onClick={onClose}
              className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          {/* Form - Scrollable */}
          <div className="px-6 py-4 overflow-y-auto max-h-[calc(80vh-120px)]">
            <form onSubmit={handleSubmit} className="space-y-6">
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

              {/* Daily Return and Image Upload Row */}
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Package Image
                  </label>
                  <div className="relative">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                      id="image-upload"
                    />
                    <label
                      htmlFor="image-upload"
                      className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-2xl cursor-pointer hover:border-[#536895] hover:bg-gray-50 transition-all duration-200 flex items-center justify-center space-x-2"
                    >
                      <PhotoIcon className="w-5 h-5 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        {selectedFile ? 'Change Image' : 'Upload Image'}
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Image Preview */}
              {previewUrl && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Image Preview
                  </label>
                  <div className="relative inline-block">
                <div className="w-32 h-32 border-2 border-gray-200 rounded-2xl overflow-hidden bg-white">
                  <img
                    src={previewUrl}
                    alt="Package preview"
                    className="w-full h-full object-contain"
                    style={{ 
                      imageRendering: 'auto'
                    }}
                    onError={(e) => {
                      e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCIgdmlld0JveD0iMCAwIDEyOCAxMjgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjgiIGhlaWdodD0iMTI4IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik02NCAzMkM3My42NzY5IDMyIDgxLjMzMzMgMzkuNjY2NyA4MS4zMzMzIDQ5LjMzMzNDODEuMzMzMyA1OSA3My42NzY5IDY2LjY2NjcgNjQgNjYuNjY2N0M1NC4zMjMxIDY2LjY2NjcgNDYuNjY2NyA1OSA0Ni42NjY3IDQ5LjMzMzNDNDYuNjY2NyAzOS42NjY3IDU0LjMyMzEgMzIgNjQgMzJaIiBmaWxsPSIjOUI5QkEwIi8+CjxwYXRoIGQ9Ik02NCA3MkM0Ny40MzE1IDcyIDM0IDU4LjU2ODUgMzQgNDJDMzQgMjUuNDMxNSA0Ny40MzE1IDEyIDY0IDEyQzgwLjU2ODUgMTIgOTQgMjUuNDMxNSA5NCA0MkM5NCA1OC41Njg1IDgwLjU2ODUgNzIgNjQgNzJaIiBmaWxsPSIjOUI5QkEwIi8+Cjwvc3ZnPgo=';
                    }}
                  />
                </div>
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                    >
                      <XMarkIcon className="w-4 h-4" />
                    </button>
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
                  className="px-6 py-3 bg-[#536895] text-white rounded-2xl hover:bg-[#4a5f8a] transition-all duration-200 font-semibold disabled:opacity-50 flex items-center"
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
            </form>
          </div>
        </div>
      </div>
    </div>
  );

  // Render with portal to escape any parent stacking context (ensures header is blurred/overlaid)
  return createPortal(modalContent, document.body);
};