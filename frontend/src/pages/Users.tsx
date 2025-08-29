import React, { useState } from 'react';
import toast from 'react-hot-toast';
import Modal from '../components/Modal';
import UserForm from '../components/users/UserForm';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';
import { useUsers } from '../hooks/useUsers';
import {
  UsersHeader,
  UsersStatsGrid,
  UsersSearchFilters,
  UsersGrid,
  UsersList,
  UsersEmptyState
} from '../components/users';
import type { User, CreateUserRequest, UpdateUserRequest, UserFilters } from '../types';

const Users: React.FC = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<UserFilters['status']>('all');
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Use custom hook for API calls
  const {
    users,
    stats,
    isLoading,
    isCreating,
    isUpdating,
    isDeleting,
    error,
    pagination,
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
    } = useUsers();

  // Debug log untuk melihat state
  console.log('Users state:', { users, stats, isLoading, error, pagination });



  const filteredUsers = (users || []).filter(user => {
    const matchesSearch = 
      user.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.telegram_id.toString().includes(searchTerm);
    
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'active' && user.is_active) ||
      (statusFilter === 'inactive' && !user.is_active);
    
    return matchesSearch && matchesStatus;
  });



  // CRUD Handlers
  const handleCreateUser = async (data: CreateUserRequest | UpdateUserRequest) => {
    if ('telegram_id' in data && 'referral_code' in data) {
      const createData = data as CreateUserRequest;
      const newUser = await createUser(createData);
      
      if (newUser) {
        setIsCreateModalOpen(false);
        
        // Show success toast
        toast.success('User created successfully! 🎉');
        
        // Refresh users list
        await fetchUsers();
      }
    }
  };

  const handleUpdateUser = async (data: CreateUserRequest | UpdateUserRequest) => {
    if (!selectedUser) return;
    
    const updatedUser = await updateUser(selectedUser.id, data as UpdateUserRequest);
    
    if (updatedUser) {
      setIsEditModalOpen(false);
      setSelectedUser(null);
      
      // Show success toast
      toast.success('User updated successfully! ✨');
      
      // Refresh users list
      await fetchUsers();
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    
    const success = await deleteUser(selectedUser.id);
    
    if (success) {
      setIsDeleteModalOpen(false);
      setSelectedUser(null);
      
      // Show success toast
      toast.success('User deleted successfully! 🗑️');
      
      // Refresh users list
      await fetchUsers();
    }
  };

  const openEditModal = (user: User) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (user: User) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <UsersHeader onCreateUser={() => setIsCreateModalOpen(true)} />

      {/* Stats Grid */}
      <UsersStatsGrid stats={stats} users={users || []} />

      {/* Search & Filters */}
      <UsersSearchFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      {/* Users Grid/List */}
      {viewMode === 'grid' ? (
        <UsersGrid 
          users={filteredUsers}
          onEditUser={openEditModal}
          onDeleteUser={openDeleteModal}
        />
      ) : (
        <UsersList 
          users={filteredUsers}
          onEditUser={openEditModal}
          onDeleteUser={openDeleteModal}
        />
      )}

      {/* Empty State */}
      {filteredUsers.length === 0 && (
        <UsersEmptyState onCreateUser={() => setIsCreateModalOpen(true)} />
      )}

      {/* Create User Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New User"
        size="xl"
      >
        <UserForm
          mode="create"
          onSubmit={handleCreateUser}
          onCancel={() => setIsCreateModalOpen(false)}
                          isLoading={isCreating}
        />
      </Modal>

      {/* Edit User Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedUser(null);
        }}
        title="Edit User"
        size="xl"
      >
        <UserForm
          mode="edit"
          user={selectedUser || undefined}
          onSubmit={handleUpdateUser}
          onCancel={() => {
            setIsEditModalOpen(false);
            setSelectedUser(null);
          }}
                          isLoading={isUpdating}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedUser(null);
        }}
        onConfirm={handleDeleteUser}
        user={selectedUser}
                    isLoading={isDeleting}
      />
    </div>
  );
};

export default Users;
