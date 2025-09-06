import React, { useState, useEffect } from 'react';
import { 
  CubeIcon, 
  PlusIcon,
} from '@heroicons/react/24/outline';
import { PackageTable } from './PackageTable';
import { PackageModal } from './PackageModal';
import { DeleteConfirmModal } from '../common/DeleteConfirmModal';
import { usePackages } from '../../hooks/usePackages';
import type { Package, CreatePackageRequest, UpdatePackageRequest } from '../../types';
import toast from 'react-hot-toast';

interface PackageContentProps {
  onCreateModalOpen?: boolean;
  onCloseCreateModal?: () => void;
}

const PackageContent: React.FC<PackageContentProps> = ({
  onCreateModalOpen = false,
  onCloseCreateModal
}) => {
  const {
    packages,
    isLoading,
    isCreating,
    isUpdating,
    isDeleting,
    error,
    pagination,
    fetchPackages,
    createPackage,
    updatePackage,
    deletePackage,
    clearError
  } = usePackages();

  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(onCreateModalOpen);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);

  // Handle create
  const handleCreate = async (data: CreatePackageRequest | UpdatePackageRequest) => {
    const result = await createPackage(data as CreatePackageRequest);
    if (result) {
      setIsCreateModalOpen(false);
      toast.success('Package created successfully!');
    }
  };

  // Handle edit
  const handleEdit = async (data: CreatePackageRequest | UpdatePackageRequest) => {
    if (selectedPackage) {
      const result = await updatePackage(selectedPackage.id, data as UpdatePackageRequest);
      if (result) {
        setIsEditModalOpen(false);
        setSelectedPackage(null);
        toast.success('Package updated successfully!');
      }
    }
  };

  // Handle delete
  const handleDelete = async () => {
    if (selectedPackage) {
      const result = await deletePackage(selectedPackage.id);
      if (result) {
        setIsDeleteModalOpen(false);
        setSelectedPackage(null);
        toast.success('Package deleted successfully!');
      }
    }
  };

  // Open edit modal
  const openEditModal = (pkg: Package) => {
    setSelectedPackage(pkg);
    setIsEditModalOpen(true);
  };

  // Open delete modal
  const openDeleteModal = (pkg: Package) => {
    setSelectedPackage(pkg);
    setIsDeleteModalOpen(true);
  };

  // Sync create modal with props
  useEffect(() => {
    setIsCreateModalOpen(onCreateModalOpen);
  }, [onCreateModalOpen]);

  // Handle create modal close
  const handleCreateModalClose = () => {
    setIsCreateModalOpen(false);
    onCloseCreateModal?.();
  };

  // If no packages, show empty state
  if (packages.length === 0 && !isLoading) {
    return (
      <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <CubeIcon className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-700 mb-2">No packages yet</h3>
          <p className="text-gray-500 mb-6">Create your first investment package to get started</p>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#536895] to-[#4a5f8a] text-white rounded-2xl hover:from-[#4a5f8a] hover:to-[#536895] transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl font-semibold"
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            Create First Package
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Package Table */}
      <PackageTable
        packages={packages}
        isLoading={isLoading}
        onEdit={openEditModal}
        onDelete={openDeleteModal}
        pagination={pagination}
        onPageChange={(page: number) => fetchPackages(undefined, page)}
      />

      {/* Create Package Modal */}
      <PackageModal
        isOpen={isCreateModalOpen}
        onClose={handleCreateModalClose}
        onSubmit={handleCreate}
        isLoading={isCreating}
        mode="create"
      />

      {/* Edit Package Modal */}
      <PackageModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedPackage(null);
        }}
        onSubmit={handleEdit}
        isLoading={isUpdating}
        mode="edit"
        package={selectedPackage}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedPackage(null);
        }}
        onConfirm={handleDelete}
        isLoading={isDeleting}
        title="Delete Package"
        message={`Are you sure you want to delete "${selectedPackage?.name}"? This action cannot be undone.`}
      />
    </>
  );
};

export default PackageContent;
