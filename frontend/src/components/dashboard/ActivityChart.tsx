import React from 'react';
import { ChartBarIcon, UsersIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline';

interface ActivityChartProps {
  chartData: Array<{
    month: string;
    users: number;
    profit: number;
  }>;
}

const ActivityChart: React.FC<ActivityChartProps> = ({ chartData }) => {
  const maxUsers = Math.max(...chartData.map(d => d.users));
  const maxProfit = Math.max(...chartData.map(d => d.profit));

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="group relative bg-white rounded-3xl p-6 shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-500 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-400 to-purple-600 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-blue-400 to-cyan-600 rounded-full blur-2xl"></div>
      </div>

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <div className="p-3 rounded-2xl bg-gradient-to-r from-[#536895] to-[#4a5f8a] shadow-lg group-hover:shadow-xl transition-all duration-300">
            <ChartBarIcon className="w-7 h-7 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Activity Overview</h2>
            <p className="text-sm text-gray-500 font-medium">Monthly performance insights</p>
          </div>
        </div>
        
        {/* Legend */}
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-600 font-medium">Users</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-600 font-medium">Profit</span>
          </div>
        </div>
      </div>

      {/* Chart Content */}
      <div className="relative z-10 space-y-8">
        {/* Chart Bars */}
        <div className="relative">
          <div className="flex items-end justify-between space-x-3 h-64">
            {chartData.map((data, index) => (
              <div key={index} className="flex-1 flex flex-col items-center space-y-3">
                {/* Chart Container */}
                <div className="w-full h-full flex flex-col justify-end space-y-2">
                  {/* Users Bar */}
                  <div className="relative">
                    <div className="w-full bg-gray-100 rounded-t-lg relative overflow-hidden">
                      <div 
                        className="bg-gradient-to-t from-blue-500 to-blue-600 rounded-t-lg transition-all duration-1000 ease-out transform origin-bottom"
                        style={{ 
                          height: `${(data.users / maxUsers) * 100}%`,
                          minHeight: '8px',
                          animationDelay: `${index * 200}ms`
                        }}
                      >
                        {/* Bar Shine Effect */}
                        <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      </div>
                    </div>
                    
                    {/* Value Label */}
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="bg-blue-600 text-white text-xs px-2 py-1 rounded-lg whitespace-nowrap">
                        {data.users.toLocaleString()}
                      </div>
                      <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-blue-600 mx-auto"></div>
                    </div>
                  </div>
                  
                  {/* Profit Bar */}
                  <div className="relative">
                    <div className="w-full bg-gray-100 rounded-t-lg relative overflow-hidden">
                      <div 
                        className="bg-gradient-to-t from-emerald-500 to-emerald-600 rounded-t-lg transition-all duration-1000 ease-out transform origin-bottom"
                        style={{ 
                          height: `${(data.profit / maxProfit) * 100}%`,
                          minHeight: '8px',
                          animationDelay: `${index * 200 + 100}ms`
                        }}
                      >
                        {/* Bar Shine Effect */}
                        <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      </div>
                    </div>
                    
                    {/* Value Label */}
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="bg-emerald-600 text-white text-xs px-2 py-1 rounded-lg whitespace-nowrap">
                        {formatCurrency(data.profit)}
                      </div>
                      <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-emerald-600 mx-auto"></div>
                    </div>
                  </div>
                </div>
                
                {/* Month Label */}
                <div className="text-center">
                  <span className="text-sm font-medium text-gray-600 bg-gray-50 px-3 py-1 rounded-full">
                    {data.month}
                  </span>
                </div>
              </div>
            ))}
          </div>
          
          {/* Grid Lines */}
          <div className="absolute inset-0 pointer-events-none">
            {[0, 25, 50, 75, 100].map((line) => (
              <div
                key={line}
                className="absolute left-0 right-0 border-t border-gray-200 border-dashed"
                style={{ top: `${100 - line}%` }}
              ></div>
            ))}
          </div>
        </div>

        {/* Chart Legend & Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-8 border-t border-gray-100">
          {/* Monthly Users */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                <UsersIcon className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Monthly Users</h3>
            </div>
            
            <div className="space-y-3">
              {chartData.map((data, index) => (
                <div 
                  key={index} 
                  className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-blue-100/50 rounded-2xl border border-blue-200/50 hover:from-blue-100 hover:to-blue-200 transition-all duration-300 transform hover:scale-105"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-sm font-medium text-gray-700">{data.month}</span>
                  </div>
                  <span className="font-bold text-blue-600">{data.users.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Monthly Profit */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center">
                <CurrencyDollarIcon className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Monthly Profit</h3>
            </div>
            
            <div className="space-y-3">
              {chartData.map((data, index) => (
                <div 
                  key={index} 
                  className="flex items-center justify-between p-3 bg-gradient-to-r from-emerald-50 to-emerald-100/50 rounded-2xl border border-emerald-200/50 hover:from-emerald-100 hover:to-emerald-200 transition-all duration-300 transform hover:scale-105"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                    <span className="text-sm font-medium text-gray-700">{data.month}</span>
                  </div>
                  <span className="font-bold text-emerald-600">{formatCurrency(data.profit)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="pt-6 border-t border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-blue-100/50 rounded-2xl border border-blue-200/50">
              <div className="text-2xl font-bold text-blue-600 mb-1">
                {chartData.reduce((sum, d) => sum + d.users, 0).toLocaleString()}
              </div>
              <div className="text-sm text-blue-700 font-medium">Total Users</div>
            </div>
            
            <div className="text-center p-4 bg-gradient-to-r from-emerald-50 to-emerald-100/50 rounded-2xl border border-emerald-200/50">
              <div className="text-2xl font-bold text-emerald-600 mb-1">
                {formatCurrency(chartData.reduce((sum, d) => sum + d.profit, 0))}
              </div>
              <div className="text-sm text-emerald-700 font-medium">Total Profit</div>
            </div>
            
            <div className="text-center p-4 bg-gradient-to-r from-purple-50 to-purple-100/50 rounded-2xl border border-purple-200/50">
              <div className="text-2xl font-bold text-purple-600 mb-1">
                {chartData.length}
              </div>
              <div className="text-sm text-purple-700 font-medium">Months Tracked</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityChart;
