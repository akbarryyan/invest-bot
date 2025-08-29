import React from 'react';
import { UsersIcon } from '@heroicons/react/24/outline';

interface UsersEmptyStateProps {
  onCreateUser: () => void;
}

const UsersEmptyState: React.FC<UsersEmptyStateProps> = ({ onCreateUser }) => {
  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-12 text-center">
      <UsersIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
      <h3 className="text-lg font-semibold text-gray-900 mb-2">No users found</h3>
      <p className="text-gray-500 mb-6">Try adjusting your search or filter criteria.</p>
      <button 
        onClick={onCreateUser}
        className="px-6 py-3 bg-gradient-to-r from-[#536895] to-[#4a5f8a] text-white rounded-2xl hover:from-[#4a5f8a] hover:to-[#536895] transition-all duration-200 font-semibold"
      >
        Add New User
      </button>
    </div>
  );
};

export default UsersEmptyState;
