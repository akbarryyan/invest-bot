import React from 'react';
import { 
  UsersIcon, 
  CurrencyDollarIcon, 
  ChartBarIcon, 
  ArrowUpIcon 
} from '@heroicons/react/24/outline';

interface StatsGridProps {
  stats: {
    totalUsers: number;
    totalBalance: number;
    totalProfit: number;
    activeUsers: number;
  };
}

const StatsGrid: React.FC<StatsGridProps> = ({ stats }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('id-ID').format(num);
  };

  const statItems = [
    {
      title: 'Total Users',
      value: formatNumber(stats.totalUsers),
      change: '+12%',
      changeType: 'positive' as const,
      icon: UsersIcon,
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Total Balance',
      value: formatCurrency(stats.totalBalance),
      change: '+8.2%',
      changeType: 'positive' as const,
      icon: CurrencyDollarIcon,
      color: 'from-emerald-500 to-emerald-600'
    },
    {
      title: 'Total Profit',
      value: formatCurrency(stats.totalProfit),
      change: '+15.3%',
      changeType: 'positive' as const,
      icon: ArrowUpIcon,
      color: 'from-purple-500 to-purple-600'
    },
    {
      title: 'Active Users',
      value: formatNumber(stats.activeUsers),
      change: '+5.7%',
      changeType: 'positive' as const,
      icon: ChartBarIcon,
      color: 'from-orange-500 to-orange-600'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statItems.map((item, index) => (
        <div key={index} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className={`w-12 h-12 bg-gradient-to-r ${item.color} rounded-2xl flex items-center justify-center`}>
              <item.icon className="w-6 h-6 text-white" />
            </div>
            <span className={`text-sm font-medium ${
              item.changeType === 'positive' ? 'text-emerald-600' : 'text-red-600'
            }`}>
              {item.change}
            </span>
          </div>
          
          <h3 className="text-2xl font-bold text-gray-900 mb-1">
            {item.value}
          </h3>
          <p className="text-gray-600 text-sm">
            {item.title}
          </p>
        </div>
      ))}
    </div>
  );
};

export default StatsGrid;
