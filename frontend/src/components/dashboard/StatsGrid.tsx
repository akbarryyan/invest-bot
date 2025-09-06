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
    totalPackages: number;
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
      color: 'from-blue-500 to-blue-600',
      bgColor: 'from-blue-50 to-blue-100',
      textColor: 'text-blue-600',
      borderColor: 'border-blue-200',
      shadowColor: 'shadow-blue-500/20',
      description: 'Active registered users',
      trend: 'Growing steadily'
    },
    {
      title: 'Total Balance',
      value: formatCurrency(stats.totalBalance),
      change: '+8.2%',
      changeType: 'positive' as const,
      icon: CurrencyDollarIcon,
      color: 'from-emerald-500 to-emerald-600',
      bgColor: 'from-emerald-50 to-emerald-100',
      textColor: 'text-emerald-600',
      borderColor: 'border-emerald-200',
      shadowColor: 'shadow-emerald-500/20',
      description: 'Platform total balance',
      trend: 'Strong growth'
    },
    {
      title: 'Total Profit',
      value: formatCurrency(stats.totalProfit),
      change: '+15.3%',
      changeType: 'positive' as const,
      icon: ArrowUpIcon,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'from-purple-50 to-purple-100',
      textColor: 'text-purple-600',
      borderColor: 'border-purple-200',
      shadowColor: 'shadow-purple-500/20',
      description: 'Cumulative profits',
      trend: 'Excellent performance'
    },
    {
      title: 'Total Packages',
      value: formatNumber(stats.totalPackages),
      change: '+2.1%',
      changeType: 'positive' as const,
      icon: ChartBarIcon,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'from-orange-50 to-orange-100',
      textColor: 'text-orange-600',
      borderColor: 'border-orange-200',
      shadowColor: 'shadow-orange-500/20',
      description: 'Available investment packages',
      trend: 'Growing portfolio'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statItems.map((item, index) => (
        <div 
          key={index} 
          className="group relative bg-white rounded-3xl p-6 shadow-lg border border-gray-100 hover:shadow-2xl hover:scale-105 transition-all duration-500 ease-out overflow-hidden"
          style={{ 
            animationDelay: `${index * 100}ms`,
            animationFillMode: 'both'
          }}
        >
          {/* Background Gradient Overlay */}
          <div className={`absolute inset-0 bg-gradient-to-br ${item.bgColor} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
          
          {/* Animated Border */}
          <div className={`absolute inset-0 rounded-3xl bg-gradient-to-r ${item.color} opacity-0 group-hover:opacity-20 transition-opacity duration-500`}></div>
          
          {/* Corner Decoration */}
          <div className={`absolute top-0 right-0 w-16 h-16 bg-gradient-to-br ${item.color} opacity-10 rounded-bl-3xl group-hover:opacity-20 transition-opacity duration-500`}></div>
          
          {/* Content */}
          <div className="relative z-10">
            {/* Header Section */}
            <div className="flex items-center justify-between mb-6">
              <div className={`icon-container p-4 rounded-2xl bg-gradient-to-r ${item.color} shadow-lg group-hover:shadow-2xl group-hover:scale-110 transition-all duration-500 relative overflow-hidden`}>
                {/* Icon Shine Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                <item.icon className="w-8 h-8 text-white relative z-10" />
              </div>
              
              {/* Change Badge */}
              <div className={`px-3 py-2 rounded-full text-sm font-bold bg-gradient-to-r ${item.bgColor} ${item.textColor} border-2 ${item.borderColor} shadow-sm group-hover:shadow-md transition-all duration-300 flex items-center space-x-1`}>
                <ArrowUpIcon className="w-4 h-4" />
                <span>{item.change}</span>
              </div>
            </div>
            
            {/* Main Content */}
            <div className="space-y-4">
              {/* Title & Description */}
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-gray-800 transition-colors duration-300">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-500 group-hover:text-gray-600 transition-colors duration-300">
                  {item.description}
                </p>
              </div>
              
              {/* Value */}
              <div className="space-y-2">
                <div className="text-3xl font-bold text-gray-900 group-hover:text-gray-800 transition-colors duration-300">
                  {item.value}
                </div>
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${item.textColor} animate-pulse`}></div>
                  <span className={`text-sm font-medium ${item.textColor}`}>
                    {item.trend}
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="pt-3">
                <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                  <span>Progress</span>
                  <span className={`font-semibold ${item.textColor}`}>
                    {item.changeType === 'positive' ? 'Growing' : 'Declining'}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div 
                    className={`progress-animate h-full rounded-full bg-gradient-to-r ${item.color} transition-all duration-1000 ease-out`}
                    style={{ 
                      width: item.changeType === 'positive' ? '75%' : '45%',
                      animationDelay: `${index * 200}ms`
                    }}
                  ></div>
                </div>
              </div>

              {/* Trend Info */}
              <div className="flex items-center pt-3 border-t border-gray-100">
                <ArrowUpIcon className={`w-4 h-4 ${item.textColor} mr-2 flex-shrink-0`} />
                <span className={`text-sm font-semibold ${item.textColor}`}>
                  {item.change} from last month
                </span>
              </div>
            </div>

            {/* Hover Action Button */}
            <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
              <button className={`p-2 rounded-xl bg-gradient-to-r ${item.color} text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110`}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </button>
            </div>
          </div>

          {/* Hover Line */}
          <div className="absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r from-transparent via-white to-transparent group-hover:w-full transition-all duration-500 ease-out"></div>
        </div>
      ))}
    </div>
  );
};

export default StatsGrid;
