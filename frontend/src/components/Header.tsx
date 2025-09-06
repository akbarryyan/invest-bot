import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  BellIcon, 
  MagnifyingGlassIcon,
  HomeIcon, 
  CubeIcon, 
  UsersIcon, 
  CurrencyDollarIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';

const Header: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    logout();
    toast.success('Logout berhasil!');
    navigate('/login');
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const navigation = [
    { name: 'Dashboard', href: '/', icon: HomeIcon },
    { name: 'Paket Investasi', href: '/packages', icon: CubeIcon },
    { name: 'Users', href: '/users', icon: UsersIcon },
    { name: 'Transaksi', href: '/transactions', icon: CurrencyDollarIcon },
    { name: 'Analytics', href: '/analytics', icon: ChartBarIcon },
    { name: 'Settings', href: '/settings', icon: Cog6ToothIcon },
  ];

  return (
    <div className="bg-white shadow-lg border-b border-gray-100">
      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo Section */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-[#536895] to-[#4a5f8a] rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl">💰</span>
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-[#536895] to-[#4a5f8a] bg-clip-text text-transparent">
                  Invest Bot
                </h1>
                <p className="text-sm text-gray-500 font-medium">Professional Investment Management</p>
              </div>
            </div>
          </div>
          
          {/* Right Section */}
          <div className="flex items-center space-x-6">
            {/* Search Bar */}
            <div className="relative hidden lg:block">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search anything..."
                className="block w-80 pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#536895] focus:border-[#536895] text-sm font-medium transition-all duration-200 hover:bg-white hover:border-gray-300"
              />
            </div>

            {/* Notifications */}
            <button className="relative p-3 rounded-xl text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-all duration-200 group">
              <BellIcon className="h-6 w-6 group-hover:scale-110 transition-transform duration-200" />
              <span className="absolute top-2 right-2 block h-3 w-3 rounded-full bg-red-500 ring-2 ring-white animate-pulse"></span>
            </button>
            
            {/* User Menu */}
            <div className="relative" ref={userMenuRef}>
              <button 
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-3 text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#536895] hover:bg-gray-50 p-3 transition-all duration-200 group"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#536895] to-[#4a5f8a] flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-200">
                  <span className="text-white font-bold text-sm">
                    {user?.username?.charAt(0).toUpperCase() || 'A'}
                  </span>
                </div>
                <div className="hidden md:block text-left">
                  <span className="text-gray-800 font-semibold">{user?.username || 'Admin'}</span>
                  <p className="text-xs text-gray-500 font-medium">Super Admin</p>
                </div>
              </button>

              {/* Dropdown Menu */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">{user?.username || 'Admin'}</p>
                    <p className="text-xs text-gray-500">{user?.email || 'admin@investbot.com'}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <ArrowRightOnRectangleIcon className="h-4 w-4 mr-3" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <div className="bg-gradient-to-r from-gray-50 via-[#536895]/5 to-[#4a5f8a]/5 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-1 overflow-x-auto scrollbar-hide">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`nav-item nav-transition ${
                    isActive
                      ? 'active bg-white text-[#536895] border-b-2 border-[#536895] shadow-sm'
                      : 'text-gray-600 hover:text-gray-800 hover:bg-white/70'
                  } group flex items-center px-6 py-4 text-sm font-semibold rounded-t-xl whitespace-nowrap border-b-2 border-transparent hover:border-gray-200 cursor-pointer`}
                >
                  <item.icon
                    className={`${
                      isActive ? 'text-[#536895]' : 'text-gray-400 group-hover:text-gray-600'
                    } mr-3 flex-shrink-0 h-5 w-5 transition-all duration-300 group-hover:scale-110`}
                    aria-hidden="true"
                  />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Header;
