import React from 'react';
import { 
  UserPlusIcon, 
  CubeIcon, 
  ChartBarIcon,
  ArrowUpIcon
} from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

interface QuickActionsAndActivityProps {
  recentUsers: Array<{
    id: number;
    first_name: string;
    last_name: string;
    username: string;
    balance: number;
    created_at: string;
  }>;
}

const QuickActionsAndActivity: React.FC<QuickActionsAndActivityProps> = ({ recentUsers }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const quickActions = [
    {
      title: 'Add User',
      description: 'Create new user account',
      icon: UserPlusIcon,
      href: '/users/create',
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Add Package',
      description: 'Create investment package',
      icon: CubeIcon,
      href: '/packages/create',
      color: 'from-emerald-500 to-emerald-600'
    },
    {
      title: 'View Reports',
      description: 'Analytics & insights',
      icon: ChartBarIcon,
      href: '/reports',
      color: 'from-purple-500 to-purple-600'
    }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Quick Actions */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
        <div className="space-y-4">
          {quickActions.map((action, index) => (
            <Link
              key={index}
              to={action.href}
              className="flex items-center p-4 rounded-2xl border-2 border-gray-100 hover:border-gray-200 hover:bg-gray-50 transition-all duration-200 group"
            >
              <div className={`w-12 h-12 bg-gradient-to-r ${action.color} rounded-2xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-200`}>
                <action.icon className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 group-hover:text-gray-700 transition-colors duration-200">
                  {action.title}
                </h3>
                <p className="text-sm text-gray-600">
                  {action.description}
                </p>
              </div>
              <ArrowUpIcon className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors duration-200 transform rotate-45" />
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Recent Users</h2>
          <Link
            to="/users"
            className="text-sm text-[#536895] hover:text-[#4a5f8a] font-medium transition-colors duration-200"
          >
            View All
          </Link>
        </div>
        
        <div className="space-y-4">
          {recentUsers.length > 0 ? (
            recentUsers.map((user) => (
              <div key={user.id} className="flex items-center p-4 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors duration-200">
                <div className="w-10 h-10 bg-gradient-to-r from-[#536895] to-[#4a5f8a] rounded-xl flex items-center justify-center mr-4">
                  <span className="text-white font-bold text-sm">
                    {user.first_name?.charAt(0)}{user.last_name?.charAt(0)}
                  </span>
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">
                    {user.first_name} {user.last_name}
                  </h4>
                  <p className="text-sm text-gray-600">
                    @{user.username || 'N/A'} • {formatDate(user.created_at)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">
                    {formatCurrency(user.balance)}
                  </p>
                  <p className="text-xs text-gray-500">Balance</p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <UserPlusIcon className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500">No users yet</p>
              <p className="text-sm text-gray-400">Create your first user to get started</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuickActionsAndActivity;
