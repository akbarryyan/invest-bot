import React, { useState, useEffect } from 'react';
import type { User, CreateUserRequest, UpdateUserRequest } from '../../types';

interface UserFormProps {
  user?: User;
  mode: 'create' | 'edit';
  onSubmit: (data: CreateUserRequest | UpdateUserRequest) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const UserForm: React.FC<UserFormProps> = ({ user, mode, onSubmit, onCancel, isLoading }) => {
  const [formData, setFormData] = useState<CreateUserRequest>({
    telegram_id: 0,
    username: '',
    first_name: '',
    last_name: '',
    phone: '',
    email: '',
    referral_code: '',
    referred_by: '',
    balance: 0,
    total_profit: 0,
    referral_bonus: 0,
    is_active: true
  });

  useEffect(() => {
    if (user && mode === 'edit') {
      setFormData({
        telegram_id: user.telegram_id,
        username: user.username || '',
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        phone: user.phone,
        email: user.email,
        referral_code: user.referral_code,
        referred_by: user.referred_by || '',
        balance: user.balance,
        total_profit: user.total_profit,
        referral_bonus: user.referral_bonus,
        is_active: user.is_active
      });
    }
  }, [user, mode]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.telegram_id || formData.telegram_id <= 0) {
      alert('Telegram ID is required and must be positive');
      return;
    }
    
    if (!formData.first_name?.trim()) {
      alert('First name is required');
      return;
    }
    
    if (!formData.phone?.trim()) {
      alert('Phone is required');
      return;
    }
    
    if (!formData.email?.trim()) {
      alert('Email is required');
      return;
    }
    
    if (!formData.referral_code?.trim()) {
      alert('Referral code is required');
      return;
    }
    
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Telegram ID */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Telegram ID *
          </label>
          <input
            type="number"
            name="telegram_id"
            value={formData.telegram_id}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#536895] focus:border-[#536895] transition-all duration-200"
            placeholder="Enter Telegram ID"
          />
        </div>

        {/* Username */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Username
          </label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#536895] focus:border-[#536895] transition-all duration-200"
            placeholder="Enter username"
          />
        </div>

        {/* First Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            First Name *
          </label>
          <input
            type="text"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#536895] focus:border-[#536895] transition-all duration-200"
            placeholder="Enter first name"
          />
        </div>

        {/* Last Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Last Name
          </label>
          <input
            type="text"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#536895] focus:border-[#536895] transition-all duration-200"
            placeholder="Enter last name"
          />
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone *
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#536895] focus:border-[#536895] transition-all duration-200"
            placeholder="Enter phone number"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email *
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#536895] focus:border-[#536895] transition-all duration-200"
            placeholder="Enter email address"
          />
        </div>

        {/* Referral Code */}
        <div>
          <label className="block text-gray-700 mb-2">
            <span className="text-sm font-medium">Referral Code *</span>
          </label>
          <input
            type="text"
            name="referral_code"
            value={formData.referral_code}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#536895] focus:border-[#536895] transition-all duration-200"
            placeholder="Enter referral code"
          />
        </div>

        {/* Referred By */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Referred By
          </label>
          <input
            type="text"
            name="referred_by"
            value={formData.referred_by}
            onChange={handleChange}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#536895] focus:border-[#536895] transition-all duration-200"
            placeholder="Enter referrer"
          />
        </div>

        {/* Balance */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Balance
          </label>
          <input
            type="number"
            name="balance"
            value={formData.balance}
            onChange={handleChange}
            step="0.01"
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#536895] focus:border-[#536895] transition-all duration-200"
            placeholder="Enter balance"
          />
        </div>

        {/* Total Profit */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Total Profit
          </label>
          <input
            type="number"
            name="total_profit"
            value={formData.total_profit}
            onChange={handleChange}
            step="0.01"
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#536895] focus:border-[#536895] transition-all duration-200"
            placeholder="Enter total profit"
          />
        </div>

        {/* Referral Bonus */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Referral Bonus
          </label>
          <input
            type="number"
            name="referral_bonus"
            value={formData.referral_bonus}
            onChange={handleChange}
            step="0.01"
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#536895] focus:border-[#536895] transition-all duration-200"
            placeholder="Enter referral bonus"
          />
        </div>

        {/* Is Active */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Status
          </label>
          <select
            name="is_active"
            value={formData.is_active?.toString() || 'true'}
            onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.value === 'true' }))}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#536895] focus:border-[#536895] transition-all duration-200"
          >
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:border-gray-400 hover:bg-gray-50 transition-all duration-200 font-medium disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-3 bg-gradient-to-r from-[#536895] to-[#4a5f8a] text-white rounded-xl hover:from-[#4a5f8a] hover:to-[#536895] transition-all duration-200 font-medium disabled:opacity-50 flex items-center"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              {mode === 'create' ? 'Creating...' : 'Updating...'}
            </>
          ) : (
            mode === 'create' ? 'Create User' : 'Update User'
          )}
        </button>
      </div>
    </form>
  );
};

export default UserForm;
