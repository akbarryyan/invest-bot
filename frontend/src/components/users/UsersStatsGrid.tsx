import React from 'react';
import { 
  UsersIcon, 
  CheckCircleIcon, 
  CurrencyDollarIcon, 
  XCircleIcon 
} from '@heroicons/react/24/outline';

interface UsersStatsGridProps {
  stats: {
    total_users: number;
    active_users: number;
    total_balance: number;
    inactive_users: number;
  };
  users: any[];
}

const UsersStatsGrid: React.FC<UsersStatsGridProps> = ({ stats, users }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const displayStats = [
    {
      name: 'Total Users',
      value: (stats?.total_users || 0).toString(),
      change: '+12.5%',
      changeType: 'increase' as const,
      icon: UsersIcon,
      color: 'from-[#536895] to-[#4a5f8a]'
    },
    {
      name: 'Active Users',
      value: (stats?.active_users || 0).toString(),
      change: '+8.2%',
      changeType: 'increase' as const,
      icon: CheckCircleIcon,
      color: 'from-[#536895] to-[#4a5f8a]'
    },
    {
      name: 'Total Balance',
      value: formatCurrency(stats?.total_balance || 0),
      change: '+23.1%',
      changeType: 'increase' as const,
      icon: CurrencyDollarIcon,
      color: 'from-[#536895] to-[#4a5f8a]'
    },
    {
      name: 'Inactive Users',
      value: (users || []).filter(u => !u.is_active).length.toString(),
      change: '-5.2%',
      changeType: 'decrease' as const,
      icon: XCircleIcon,
      color: 'from-[#536895] to-[#4a5f8a]'
    }
  ];

  return (
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
  );
};

export default UsersStatsGrid;
