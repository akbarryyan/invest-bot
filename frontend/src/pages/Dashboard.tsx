import React from 'react';
import { 
  UsersIcon, 
  CubeIcon, 
  CurrencyDollarIcon, 
  ChartBarIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  EyeIcon,
  PlusIcon,
  ChartBarIcon as TrendingUpIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

const Dashboard: React.FC = () => {
  const stats = [
    {
      name: 'Total Users',
      value: '2,847',
      change: '+12.5%',
      changeType: 'increase',
      icon: UsersIcon,
      color: 'from-[#536895] to-[#4a5f8a]',
      bgColor: 'bg-[#536895]/10',
      textColor: 'text-[#536895]',
      description: 'Active registered users'
    },
    {
      name: 'Active Packages',
      value: '156',
      change: '+8.2%',
      changeType: 'increase',
      icon: CubeIcon,
      color: 'from-[#536895] to-[#4a5f8a]',
      bgColor: 'bg-[#536895]/10',
      textColor: 'text-[#536895]',
      description: 'Currently active investments'
    },
    {
      name: 'Total Revenue',
      value: 'Rp 2.4M',
      change: '+23.1%',
      changeType: 'increase',
      icon: CurrencyDollarIcon,
      color: 'from-[#536895] to-[#4a5f8a]',
      bgColor: 'bg-[#536895]/10',
      textColor: 'text-[#536895]',
      description: 'Total platform revenue'
    },
    {
      name: 'Daily Claims',
      value: '89',
      change: '-2.4%',
      changeType: 'decrease',
      icon: ChartBarIcon,
      color: 'from-[#536895] to-[#4a5f8a]',
      bgColor: 'bg-[#536895]/10',
      textColor: 'text-[#536895]',
      description: 'Claims processed today'
    }
  ];

  const recentTransactions = [
    {
      id: 1,
      user: 'John Doe',
      type: 'Package Purchase',
      amount: 'Rp 500,000',
      status: 'completed',
      time: '2 minutes ago',
      avatar: 'JD'
    },
    {
      id: 2,
      user: 'Jane Smith',
      type: 'Daily Claim',
      amount: 'Rp 25,000',
      status: 'completed',
      time: '5 minutes ago',
      avatar: 'JS'
    },
    {
      id: 3,
      user: 'Mike Johnson',
      type: 'Referral Bonus',
      amount: 'Rp 100,000',
      status: 'completed',
      time: '12 minutes ago',
      avatar: 'MJ'
    },
    {
      id: 4,
      user: 'Sarah Wilson',
      type: 'Package Purchase',
      amount: 'Rp 1,000,000',
      status: 'pending',
      time: '1 hour ago',
      avatar: 'SW'
    },
    {
      id: 5,
      user: 'David Brown',
      type: 'Daily Claim',
      amount: 'Rp 15,000',
      status: 'completed',
      time: '2 hours ago',
      avatar: 'DB'
    }
  ];

  const quickActions = [
    { 
      name: 'Add Package', 
      icon: PlusIcon, 
      color: 'from-[#536895] to-[#4a5f8a]', 
      href: '/packages',
      description: 'Create new investment package'
    },
    { 
      name: 'View Users', 
      icon: UsersIcon, 
      color: 'from-[#536895] to-[#4a5f8a]', 
      href: '/users',
      description: 'Manage user accounts'
    },
    { 
      name: 'Transactions', 
      icon: CurrencyDollarIcon, 
      color: 'from-[#536895] to-[#4a5f8a]', 
      href: '/transactions',
      description: 'Monitor all transactions'
    },
    { 
      name: 'Analytics', 
      icon: ChartBarIcon, 
      color: 'from-[#536895] to-[#4a5f8a]', 
      href: '/analytics',
      description: 'View detailed reports'
    }
  ];

  // reserved helper for future dashboard status badges
  const getStatusColor = (_status: string) => 'bg-gray-100 text-gray-800 border-gray-200';

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="flex-1">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-3">
              Welcome back, Admin! 👋
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl">
              Here's what's happening with your Invest Bot today. Monitor your platform performance and manage investments efficiently.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <button className="px-6 py-3 bg-gradient-to-r from-[#536895] to-[#4a5f8a] text-white rounded-2xl hover:from-[#4a5f8a] hover:to-[#536895] transition-all duration-200 transform hover:scale-105 shadow-lg font-semibold flex items-center justify-center">
              <PlusIcon className="w-5 h-5 mr-2" />
              Quick Action
            </button>
            <button className="px-6 py-3 bg-white border-2 border-gray-200 text-gray-700 rounded-2xl hover:border-gray-300 hover:bg-gray-50 transition-all duration-200 font-semibold flex items-center justify-center">
              <TrendingUpIcon className="w-5 h-5 mr-2" />
              View Reports
            </button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div 
            key={stat.name} 
            className="stats-card stats-card-hover group relative bg-white rounded-3xl shadow-sm border border-gray-100 p-6 hover:shadow-2xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 overflow-hidden"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {/* Background Gradient Overlay */}
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
            
            {/* Animated Border */}
            <div className={`absolute inset-0 rounded-3xl bg-gradient-to-r ${stat.color} opacity-0 group-hover:opacity-20 transition-opacity duration-500`}></div>
            
            {/* Content */}
            <div className="relative z-10">
              {/* Header Section */}
              <div className="flex items-center justify-between mb-6">
                <div className={`icon-shine p-4 rounded-2xl bg-gradient-to-r ${stat.color} shadow-lg group-hover:shadow-2xl group-hover:scale-110 transition-all duration-500 relative overflow-hidden`}>
                  {/* Icon Shine Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  <stat.icon className="w-8 h-8 text-white relative z-10" />
                </div>
                
                {/* Change Badge */}
                <div className={`px-4 py-2 rounded-full text-sm font-bold ${stat.bgColor} ${stat.textColor} border-2 border-current/20 shadow-sm group-hover:shadow-md transition-all duration-300 flex items-center space-x-1`}>
                  {stat.changeType === 'increase' ? (
                    <ArrowUpIcon className="w-4 h-4" />
                  ) : (
                    <ArrowDownIcon className="w-4 h-4" />
                  )}
                  <span>{stat.change}</span>
                </div>
              </div>

              {/* Main Content */}
              <div className="space-y-3">
                {/* Title */}
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">{stat.name}</p>
                  {/* Trend Indicator */}
                  <div className={`w-2 h-2 rounded-full pulse-glow ${
                    stat.changeType === 'increase' ? 'bg-emerald-400' : 'bg-red-400'
                  }`}></div>
                </div>
                
                {/* Value */}
                <div className="space-y-1">
                  <p className="text-4xl font-bold text-gray-900 group-hover:text-gray-800 transition-colors duration-300">
                    {stat.value}
                  </p>
                  <p className="text-xs text-gray-500 font-medium">{stat.description}</p>
                </div>

                {/* Progress Bar */}
                <div className="pt-2">
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                    <span>Progress</span>
                    <span className={`font-semibold ${
                      stat.changeType === 'increase' ? 'text-emerald-600' : 'text-red-600'
                    }`}>
                      {stat.changeType === 'increase' ? 'Growing' : 'Declining'}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div 
                      className={`progress-animate h-full rounded-full bg-gradient-to-r ${stat.color} transition-all duration-1000 ease-out`}
                      style={{ 
                        '--progress-width': `${stat.changeType === 'increase' ? '75' : '45'}%`,
                        animationDelay: `${index * 200}ms`
                      } as React.CSSProperties}
                    ></div>
                  </div>
                </div>

                {/* Trend Info */}
                <div className="flex items-center pt-2 border-t border-gray-100">
                  {stat.changeType === 'increase' ? (
                    <ArrowUpIcon className="w-4 h-4 text-emerald-500 mr-2 flex-shrink-0" />
                  ) : (
                    <ArrowDownIcon className="w-4 h-4 text-red-500 mr-2 flex-shrink-0" />
                  )}
                  <span className={`text-sm font-semibold ${
                    stat.changeType === 'increase' ? 'text-emerald-600' : 'text-red-600'
                  }`}>
                    {stat.change} from last month
                  </span>
                </div>
              </div>

              {/* Hover Action Button */}
              <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                <button className={`p-2 rounded-xl bg-gradient-to-r ${stat.color} text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110`}>
                  <EyeIcon className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Corner Decoration */}
            <div className={`absolute top-0 right-0 w-16 h-16 bg-gradient-to-br ${stat.color} opacity-10 rounded-bl-3xl group-hover:opacity-20 transition-opacity duration-500`}></div>
          </div>
        ))}
      </div>

      {/* Quick Actions & Recent Activity */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Quick Actions */}
        <div className="card-glow bg-white rounded-3xl shadow-sm border border-gray-100 p-8 hover:shadow-lg transition-all duration-300 group">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <div className="p-3 rounded-2xl bg-gradient-to-r from-[#536895] to-[#4a5f8a] shadow-lg group-hover:shadow-xl transition-all duration-300 icon-bounce">
                <ClockIcon className="w-7 h-7 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Quick Actions</h2>
                <p className="text-sm text-gray-500 font-medium">Access frequently used features</p>
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="w-2 h-2 bg-[#536895] rounded-full animate-pulse"></div>
            </div>
          </div>

          {/* Actions Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {quickActions.map((action, index) => (
              <a
                key={action.name}
                href={action.href}
                className="quick-action-card group relative bg-gradient-to-br from-gray-50 via-white to-gray-50 rounded-3xl border-2 border-gray-100 hover:border-gray-200 transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 hover:shadow-xl overflow-hidden"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#536895]/10 via-[#4a5f8a]/5 to-[#536895]/10"></div>
                </div>

                {/* Content */}
                <div className="relative z-10 p-6">
                  {/* Icon Section */}
                  <div className="flex items-center justify-between mb-4">
                    <div className={`icon-shine p-4 rounded-2xl bg-gradient-to-r ${action.color} shadow-lg group-hover:shadow-2xl group-hover:scale-110 transition-all duration-500 relative overflow-hidden`}>
                      {/* Icon Shine Effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                      <action.icon className="w-6 h-6 text-white relative z-10" />
                    </div>
                    
                    {/* Arrow Indicator */}
                    <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                      <div className="w-8 h-8 rounded-full bg-gray-100 group-hover:bg-[#536895]/10 flex items-center justify-center transition-colors duration-300 arrow-slide">
                        <svg className="w-4 h-4 text-gray-400 group-hover:text-[#536895] transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Text Content */}
                  <div className="space-y-2">
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-gray-800 transition-colors duration-300">
                      {action.name}
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {action.description}
                    </p>
                  </div>

                  {/* Hover Line */}
                  <div className="absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r from-[#536895] to-[#4a5f8a] group-hover:w-full transition-all duration-500 ease-out"></div>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="card-glow bg-white rounded-3xl shadow-sm border border-gray-100 p-8 hover:shadow-lg transition-all duration-300 group">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <div className="p-3 rounded-2xl bg-gradient-to-r from-[#536895] to-[#4a5f8a] shadow-lg group-hover:shadow-xl transition-all duration-300 icon-bounce">
                <TrendingUpIcon className="w-7 h-7 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Recent Activity</h2>
                <p className="text-sm text-gray-500 font-medium">Latest platform transactions</p>
              </div>
            </div>
            <button className="px-4 py-2 bg-gradient-to-r from-[#536895] to-[#4a5f8a] text-white rounded-2xl hover:from-[#4a5f8a] hover:to-[#536895] transition-all duration-300 transform hover:scale-105 shadow-lg font-semibold flex items-center space-x-2 text-sm">
              <EyeIcon className="w-4 h-4" />
              <span>View All</span>
            </button>
          </div>

          {/* Transactions List */}
          <div className="space-y-4">
            {recentTransactions.slice(0, 4).map((transaction, index) => (
              <div 
                key={transaction.id} 
                className="transaction-item group relative bg-gradient-to-br from-gray-50 via-white to-gray-50 rounded-2xl border-2 border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02] overflow-hidden"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#536895]/10 via-[#4a5f8a]/5 to-[#536895]/10"></div>
                </div>

                {/* Content */}
                <div className="relative z-10 p-5">
                  <div className="flex items-center space-x-4">
                    {/* Avatar */}
                    <div className="relative">
                      <div className="w-14 h-14 bg-gradient-to-r from-[#536895] to-[#4a5f8a] rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-110">
                        <span className="text-white text-sm font-bold">
                          {transaction.avatar}
                        </span>
                      </div>
                      
                      {/* Status Indicator */}
                      <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white status-pulse ${
                        transaction.status === 'completed' ? 'bg-emerald-400' : 
                        transaction.status === 'pending' ? 'bg-amber-400' : 'bg-red-400'
                      }`}></div>
                    </div>

                    {/* Transaction Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-base font-bold text-gray-900 truncate group-hover:text-gray-800 transition-colors duration-300">
                          {transaction.user}
                        </h4>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold border-2 shadow-sm ${
                          transaction.status === 'completed' ? 'bg-emerald-100 text-emerald-800 border-emerald-200' :
                          transaction.status === 'pending' ? 'bg-amber-100 text-amber-800 border-amber-200' :
                          'bg-red-100 text-red-800 border-red-200'
                        }`}>
                          {transaction.status}
                        </span>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-2 font-medium">
                        {transaction.type}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-gray-900 group-hover:text-gray-800 transition-colors duration-300">
                          {transaction.amount}
                        </span>
                        <span className="text-xs text-gray-500 font-medium flex items-center space-x-1">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>{transaction.time}</span>
                        </span>
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
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
                <div className="absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r from-[#536895] to-[#4a5f8a] group-hover:w-full transition-all duration-500 ease-out"></div>
              </div>
            ))}
          </div>

          {/* View More Button */}
          <div className="mt-6 pt-6 border-t border-gray-100">
            <button className="w-full py-3 bg-gradient-to-r from-gray-50 to-white border-2 border-gray-200 text-gray-700 rounded-2xl hover:border-gray-300 hover:bg-gray-50 transition-all duration-300 font-semibold flex items-center justify-center space-x-2 group arrow-slide">
              <span>View All Transactions</span>
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Activity Chart */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
          <ChartBarIcon className="w-6 h-6 mr-3 text-[#536895]" />
          Activity Overview
        </h2>
        <div className="h-80 bg-gradient-to-br from-[#536895]/5 via-[#4a5f8a]/5 to-[#536895]/5 rounded-3xl border-2 border-dashed border-gray-300 flex items-center justify-center">
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-[#536895] to-[#4a5f8a] rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <ChartBarIcon className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-700 mb-2">Chart Component</h3>
            <p className="text-gray-500">Interactive activity visualization will be displayed here</p>
            <p className="text-sm text-gray-400 mt-2">Coming soon with real-time data</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
