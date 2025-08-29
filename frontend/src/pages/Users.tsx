import React, { useState } from 'react';
import { 
  UsersIcon, 
  MagnifyingGlassIcon,
  FunnelIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  CheckCircleIcon,
  XCircleIcon,
  EllipsisVerticalIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import Modal from '../components/Modal';
import UserForm from '../components/UserForm';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';
import { useUsers } from '../hooks/useUsers';
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
    clearError,
    } = useUsers();

  // Debug log untuk melihat state
  console.log('Users state:', { users, stats, isLoading, error, pagination });

  const getStatusColor = (isActive: boolean) => {
    return isActive 
      ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
      : 'bg-red-100 text-red-800 border-red-200';
  };

  const getStatusIcon = (isActive: boolean) => {
    return isActive 
      ? <CheckCircleIcon className="w-4 h-4 text-emerald-600" />
      : <XCircleIcon className="w-4 h-4 text-red-600" />;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

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

  // Stats for display
  const displayStats = [
    {
      name: 'Total Users',
      value: (stats?.total_users || 0).toString(),
      change: '+12.5%',
      changeType: 'increase',
      icon: UsersIcon,
      color: 'from-[#536895] to-[#4a5f8a]'
    },
    {
      name: 'Active Users',
      value: (stats?.active_users || 0).toString(),
      change: '+8.2%',
      changeType: 'increase',
      icon: CheckCircleIcon,
      color: 'from-[#536895] to-[#4a5f8a]'
    },
    {
      name: 'Total Balance',
      value: formatCurrency(stats?.total_balance || 0),
      change: '+23.1%',
      changeType: 'increase',
      icon: CurrencyDollarIcon,
      color: 'from-[#536895] to-[#4a5f8a]'
    },
    {
      name: 'Inactive Users',
      value: (users || []).filter(u => !u.is_active).length.toString(),
      change: '-5.2%',
      changeType: 'decrease',
      icon: XCircleIcon,
      color: 'from-[#536895] to-[#4a5f8a]'
    }
  ];

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
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="flex-1">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-3">
              User Management 👥
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl">
              Manage all user accounts, monitor their activities, and control access to your investment platform.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <button 
              onClick={() => setIsCreateModalOpen(true)}
              className="px-6 py-3 bg-gradient-to-r from-[#536895] to-[#4a5f8a] text-white rounded-2xl hover:from-[#4a5f8a] hover:to-[#536895] transition-all duration-200 transform hover:scale-105 shadow-lg font-semibold flex items-center justify-center"
            >
              <PlusIcon className="w-5 h-5 mr-2" />
              Add New User
            </button>
            <button className="px-6 py-3 bg-white border-2 border-gray-200 text-gray-700 rounded-2xl hover:border-gray-300 hover:bg-gray-50 transition-all duration-200 font-semibold flex items-center justify-center">
              <UsersIcon className="w-5 h-5 mr-2" />
              Export Users
            </button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {displayStats.map((stat) => (
          <div key={stat.name} className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-all duration-300 transform hover:scale-105 group">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-2xl bg-gradient-to-r ${stat.color} shadow-lg group-hover:shadow-xl transition-all duration-300`}>
                <stat.icon className="w-7 h-7 text-white" />
              </div>
              <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                stat.changeType === 'increase' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
              } border`}>
                {stat.change}
              </div>
            </div>
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-600 mb-1">{stat.name}</p>
              <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Search & Filters */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          {/* Search */}
          <div className="flex-1 max-w-md">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search users by name, username, or Telegram ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-2xl leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#536895] focus:border-[#536895] text-sm font-medium transition-all duration-200 hover:bg-white hover:border-gray-300"
              />
            </div>
          </div>

          {/* Filters & View Mode */}
          <div className="flex items-center gap-4">
            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <FunnelIcon className="w-5 h-5 text-gray-500" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as UserFilters['status'])}
                className="px-4 py-2 border-2 border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#536895] focus:border-[#536895] transition-all duration-200"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center bg-gray-100 rounded-xl p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-all duration-200 ${
                  viewMode === 'grid' 
                    ? 'bg-white text-[#536895] shadow-sm' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <div className="w-5 h-5 grid grid-cols-2 gap-0.5">
                  <div className="w-1.5 h-1.5 bg-current rounded-sm"></div>
                  <div className="w-1.5 h-1.5 bg-current rounded-sm"></div>
                  <div className="w-1.5 h-1.5 bg-current rounded-sm"></div>
                  <div className="w-1.5 h-1.5 bg-current rounded-sm"></div>
                </div>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-all duration-200 ${
                  viewMode === 'list' 
                    ? 'bg-white text-[#536895] shadow-sm' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <div className="w-5 h-5 flex flex-col gap-0.5">
                  <div className="w-full h-1 bg-current rounded-sm"></div>
                  <div className="w-full h-1 bg-current rounded-sm"></div>
                  <div className="w-full h-1 bg-current rounded-sm"></div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Users Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers.map((user) => (
            <div key={user.id} className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-all duration-300 transform hover:scale-105 group">
              {/* User Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-[#536895] to-[#4a5f8a] rounded-2xl flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-xl">
                      {user.first_name?.charAt(0)}{user.last_name?.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">
                      {user.first_name} {user.last_name}
                    </h3>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(user.is_active)}
                      <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(user.is_active)}`}>
                        {user.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                </div>
                <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all duration-200">
                  <EllipsisVerticalIcon className="w-5 h-5" />
                </button>
              </div>

              {/* User Info */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center space-x-3 text-sm text-gray-600">
                  <span className="font-medium">Username:</span>
                  <span className="truncate">{user.username || 'N/A'}</span>
                </div>
                <div className="flex items-center space-x-3 text-sm text-gray-600">
                  <span className="font-medium">Telegram ID:</span>
                  <span>{user.telegram_id}</span>
                </div>
                <div className="flex items-center space-x-3 text-sm text-gray-600">
                  <span className="font-medium">Referral Code:</span>
                  <span className="truncate">{user.referral_code}</span>
                </div>
                <div className="flex items-center space-x-3 text-sm text-gray-600">
                  <span className="font-medium">Joined:</span>
                  <span>{formatDate(user.created_at)}</span>
                </div>
              </div>

              {/* Financial Info */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="text-center p-3 bg-gray-50 rounded-xl">
                  <p className="text-xs text-gray-500 mb-1">Balance</p>
                  <p className="text-sm font-bold text-gray-900">{formatCurrency(user.balance)}</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-xl">
                  <p className="text-xs text-gray-500 mb-1">Total Profit</p>
                  <p className="text-sm font-bold text-emerald-600">{formatCurrency(user.total_profit)}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between">
                <button 
                  onClick={() => openEditModal(user)}
                  className="flex-1 mr-2 px-4 py-2 bg-[#536895]/10 text-[#536895] rounded-xl hover:bg-[#536895]/20 transition-all duration-200 font-medium text-sm flex items-center justify-center"
                >
                  <PencilIcon className="w-4 h-4 mr-2" />
                  Edit
                </button>
                <button 
                  onClick={() => openDeleteModal(user)}
                  className="px-4 py-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-all duration-200 font-medium text-sm flex items-center justify-center"
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">User</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Balance</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Profit</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Join Date</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-r from-[#536895] to-[#4a5f8a] rounded-xl flex items-center justify-center mr-3">
                          <span className="text-white font-bold text-sm">
                            {user.first_name?.charAt(0)}{user.last_name?.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <div className="text-sm font-bold text-gray-900">
                            {user.first_name} {user.last_name}
                          </div>
                          <div className="text-sm text-gray-500">
                            @{user.username || 'N/A'} • ID: {user.telegram_id}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(user.is_active)}`}>
                        {getStatusIcon(user.is_active)}
                        <span className="ml-1">{user.is_active ? 'Active' : 'Inactive'}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                      {formatCurrency(user.balance)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-emerald-600">
                      {formatCurrency(user.total_profit)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(user.created_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => openEditModal(user)}
                          className="p-2 bg-[#536895]/10 text-[#536895] rounded-lg hover:bg-[#536895]/20 transition-all duration-200"
                        >
                          <PencilIcon className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => openDeleteModal(user)}
                          className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-all duration-200"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Empty State */}
      {filteredUsers.length === 0 && (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-12 text-center">
          <UsersIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No users found</h3>
          <p className="text-gray-500 mb-6">Try adjusting your search or filter criteria.</p>
          <button 
            onClick={() => setIsCreateModalOpen(true)}
            className="px-6 py-3 bg-gradient-to-r from-[#536895] to-[#4a5f8a] text-white rounded-2xl hover:from-[#4a5f8a] hover:to-[#536895] transition-all duration-200 font-semibold"
          >
            Add New User
          </button>
        </div>
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
