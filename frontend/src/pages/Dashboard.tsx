import React, { useState, useEffect } from 'react';
import { 
  WelcomeHeader,
  StatsGrid,
  QuickActionsAndActivity,
  ActivityChart
} from '../components/dashboard';
import { useUsers } from '../hooks/useUsers';

const Dashboard: React.FC = () => {
  const { users, stats: userStats, isLoading } = useUsers();
  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      };
      setCurrentTime(now.toLocaleDateString('id-ID', options));
    };

    updateTime();
    const interval = setInterval(updateTime, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  // Mock chart data - replace with real data later
  const chartData = [
    { month: 'Jan', users: 120, profit: 5000000 },
    { month: 'Feb', users: 180, profit: 7500000 },
    { month: 'Mar', users: 220, profit: 9000000 },
    { month: 'Apr', users: 280, profit: 12000000 },
    { month: 'May', users: 320, profit: 15000000 },
    { month: 'Jun', users: 380, profit: 18000000 }
  ];

  // Get recent users for activity section
  const recentUsers = users.slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <WelcomeHeader 
        userName="Admin" 
        currentTime={currentTime} 
      />

      {/* Stats Grid */}
      <StatsGrid 
        stats={{
          totalUsers: userStats?.total_users || 0,
          totalBalance: userStats?.total_balance || 0,
          totalProfit: 0, // TODO: Add total_profit to userStats
          activeUsers: userStats?.active_users || 0
        }}
      />

      {/* Quick Actions & Recent Activity */}
      <QuickActionsAndActivity 
        recentUsers={recentUsers.map(user => ({
          id: user.id,
          first_name: user.first_name || '',
          last_name: user.last_name || '',
          username: user.username || '',
          balance: user.balance,
          created_at: user.created_at
        }))}
      />

      {/* Activity Chart */}
      <ActivityChart 
        chartData={chartData}
      />
    </div>
  );
};

export default Dashboard;
