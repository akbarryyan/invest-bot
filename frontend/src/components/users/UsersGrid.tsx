import React from 'react';
import { 
  PencilIcon, 
  TrashIcon, 
  CheckCircleIcon, 
  XCircleIcon,
  EllipsisVerticalIcon
} from '@heroicons/react/24/outline';
import type { User } from '../../types';

interface UsersGridProps {
  users: User[];
  onEditUser: (user: User) => void;
  onDeleteUser: (user: User) => void;
}

const UsersGrid: React.FC<UsersGridProps> = ({ users, onEditUser, onDeleteUser }) => {
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

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {users.map((user) => (
        <div key={user.id} className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
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
            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl">
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
              onClick={() => onEditUser(user)}
              className="flex-1 mr-2 px-4 py-2 bg-[#536895]/10 text-[#536895] rounded-xl hover:bg-[#536895]/20 font-medium text-sm flex items-center justify-center"
            >
              <PencilIcon className="w-4 h-4 mr-2" />
              Edit
            </button>
            <button 
              onClick={() => onDeleteUser(user)}
              className="px-4 py-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 font-medium text-sm flex items-center justify-center"
            >
              <TrashIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default UsersGrid;