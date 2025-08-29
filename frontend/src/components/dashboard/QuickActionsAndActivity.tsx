import React from 'react';
import { 
  UserPlusIcon, 
  CubeIcon, 
  ChartBarIcon,
  ArrowUpIcon,
  ClockIcon,
  ChartBarIcon as TrendingUpIcon
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
      color: 'from-blue-500 to-blue-600',
      bgColor: 'from-blue-50 to-blue-100',
      borderColor: 'border-blue-200',
      shadowColor: 'shadow-blue-500/20',
      badge: 'New'
    },
    {
      title: 'Add Package',
      description: 'Create investment package',
      icon: CubeIcon,
      href: '/packages/create',
      color: 'from-emerald-500 to-emerald-600',
      bgColor: 'from-emerald-50 to-emerald-100',
      borderColor: 'border-emerald-200',
      shadowColor: 'shadow-emerald-500/20',
      badge: 'Hot'
    },
    {
      title: 'View Reports',
      description: 'Analytics & insights',
      icon: ChartBarIcon,
      href: '/reports',
      color: 'from-purple-500 to-purple-600',
      bgColor: 'from-purple-50 to-purple-100',
      borderColor: 'border-purple-200',
      shadowColor: 'shadow-purple-500/20',
      badge: 'Pro'
    }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Quick Actions */}
      <div className="group relative bg-white rounded-3xl p-6 shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-500 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-emerald-400 to-teal-600 rounded-full blur-2xl"></div>
        </div>

        {/* Header */}
        <div className="relative z-10 mb-8">
          <div className="flex items-center space-x-4 mb-2">
            <div className="p-3 rounded-2xl bg-gradient-to-r from-[#536895] to-[#4a5f8a] shadow-lg group-hover:shadow-xl transition-all duration-300">
              <TrendingUpIcon className="w-7 h-7 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Quick Actions</h2>
              <p className="text-sm text-gray-500 font-medium">Access frequently used features</p>
            </div>
          </div>
        </div>

        {/* Actions Grid */}
        <div className="relative z-10 space-y-4">
          {quickActions.map((action, index) => (
            <Link
              key={index}
              to={action.href}
              className="group/action relative bg-gradient-to-br from-gray-50 via-white to-gray-50 rounded-3xl border-2 border-gray-100 hover:border-gray-200 transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 hover:shadow-xl overflow-hidden"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-0 group-hover/action:opacity-100 transition-opacity duration-500">
                <div className={`absolute inset-0 bg-gradient-to-br ${action.bgColor}`}></div>
              </div>

              {/* Content */}
              <div className="relative z-10 p-6">
                {/* Icon Section */}
                <div className="flex items-center justify-between mb-4">
                  <div className={`icon-shine p-4 rounded-2xl bg-gradient-to-r ${action.color} shadow-lg group-hover/action:shadow-2xl group-hover/action:scale-110 transition-all duration-500 relative overflow-hidden`}>
                    {/* Icon Shine Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/action:translate-x-full transition-transform duration-1000"></div>
                    <action.icon className="w-6 h-6 text-white relative z-10" />
                  </div>
                  
                  {/* Badge */}
                  <div className={`px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r ${action.color} text-white shadow-sm`}>
                    {action.badge}
                  </div>
                </div>

                {/* Text Content */}
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-gray-900 group-hover/action:text-gray-800 transition-colors duration-300">
                    {action.title}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {action.description}
                  </p>
                </div>

                {/* Hover Line */}
                <div className="absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r from-transparent via-white to-transparent group-hover/action:w-full transition-all duration-500 ease-out"></div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="group relative bg-white rounded-3xl p-6 shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-500 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-400 to-pink-600 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-orange-400 to-red-600 rounded-full blur-2xl"></div>
        </div>

        {/* Header */}
        <div className="relative z-10 flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div className="p-3 rounded-2xl bg-gradient-to-r from-[#536895] to-[#4a5f8a] shadow-lg group-hover:shadow-xl transition-all duration-300">
              <ClockIcon className="w-7 h-7 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Recent Users</h2>
              <p className="text-sm text-gray-500 font-medium">Latest platform activity</p>
            </div>
          </div>
          <Link
            to="/users"
            className="px-4 py-2 bg-gradient-to-r from-[#536895] to-[#4a5f8a] text-white rounded-2xl hover:from-[#4a5f8a] hover:to-[#536895] transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl font-semibold text-sm"
          >
            View All
          </Link>
        </div>
        
        {/* Users List */}
        <div className="relative z-10 space-y-4">
          {recentUsers.length > 0 ? (
            recentUsers.map((user, index) => (
              <div 
                key={user.id} 
                className="group/user relative bg-gradient-to-br from-gray-50 via-white to-gray-50 rounded-2xl border-2 border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02] overflow-hidden"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-0 group-hover/user:opacity-100 transition-opacity duration-500">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#536895]/5 via-[#4a5f8a]/5 to-[#536895]/5"></div>
                </div>

                {/* Content */}
                <div className="relative z-10 p-5">
                  <div className="flex items-center space-x-4">
                    {/* Avatar */}
                    <div className="relative">
                      <div className="w-14 h-14 bg-gradient-to-r from-[#536895] to-[#4a5f8a] rounded-2xl flex items-center justify-center shadow-lg group-hover/user:shadow-xl transition-all duration-300 transform group-hover/user:scale-110">
                        <span className="text-white text-sm font-bold">
                          {user.first_name?.charAt(0)}{user.last_name?.charAt(0)}
                        </span>
                      </div>
                      
                      {/* Status Indicator */}
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full border-2 border-white shadow-sm animate-pulse"></div>
                    </div>

                    {/* User Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-base font-bold text-gray-900 truncate group-hover/user:text-gray-800 transition-colors duration-300">
                          {user.first_name} {user.last_name}
                        </h4>
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border-2 border-emerald-200 shadow-sm">
                          Active
                        </span>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-2 font-medium">
                        @{user.username || 'N/A'} • {formatDate(user.created_at)}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-gray-900 group-hover/user:text-gray-800 transition-colors duration-300">
                          {formatCurrency(user.balance)}
                        </span>
                        <span className="text-xs text-gray-500 font-medium flex items-center space-x-1">
                          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                          <span>Balance</span>
                        </span>
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="opacity-0 group-hover/user:opacity-100 transition-all duration-300 transform translate-x-2 group-hover/user:translate-x-0">
                      <button className="p-2 rounded-xl bg-gradient-to-r from-[#536895] to-[#4a5f8a] text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Hover Line */}
                <div className="absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r from-[#536895] to-[#4a5f8a] group-hover/user:w-full transition-all duration-500 ease-out"></div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <UserPlusIcon className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-700 mb-2">No users yet</h3>
              <p className="text-gray-500 mb-4">Create your first user to get started</p>
              <Link
                to="/users/create"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#536895] to-[#4a5f8a] text-white rounded-2xl hover:from-[#4a5f8a] hover:to-[#536895] transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl font-semibold"
              >
                <UserPlusIcon className="w-5 h-5 mr-2" />
                Create First User
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuickActionsAndActivity;
