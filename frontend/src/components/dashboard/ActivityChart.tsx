import React from 'react';
import { ChartBarIcon } from '@heroicons/react/24/outline';

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
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Activity Overview</h2>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-sm text-gray-600">Users</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
            <span className="text-sm text-gray-600">Profit</span>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {/* Chart Bars */}
        <div className="flex items-end justify-between space-x-2 h-48">
          {chartData.map((data, index) => (
            <div key={index} className="flex-1 flex flex-col items-center space-y-2">
              {/* Users Bar */}
              <div className="w-full bg-gray-100 rounded-t-lg relative">
                <div 
                  className="bg-blue-500 rounded-t-lg transition-all duration-500 ease-out"
                  style={{ 
                    height: `${(data.users / maxUsers) * 100}%`,
                    minHeight: '4px'
                  }}
                ></div>
              </div>
              
              {/* Profit Bar */}
              <div className="w-full bg-gray-100 rounded-t-lg relative">
                <div 
                  className="bg-emerald-500 rounded-t-lg transition-all duration-500 ease-out"
                  style={{ 
                    height: `${(data.profit / maxProfit) * 100}%`,
                    minHeight: '4px'
                  }}
                ></div>
              </div>
              
              {/* Month Label */}
              <span className="text-xs text-gray-500 font-medium">
                {data.month}
              </span>
            </div>
          ))}
        </div>

        {/* Chart Legend */}
        <div className="grid grid-cols-2 gap-6 pt-6 border-t border-gray-100">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Monthly Users</h3>
            <div className="space-y-2">
              {chartData.map((data, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{data.month}</span>
                  <span className="font-semibold text-gray-900">{data.users}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Monthly Profit</h3>
            <div className="space-y-2">
              {chartData.map((data, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{data.month}</span>
                  <span className="font-semibold text-emerald-600">
                    {formatCurrency(data.profit)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityChart;
