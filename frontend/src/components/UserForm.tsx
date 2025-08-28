import React, { useState, useEffect } from 'react';
import type { CreateUserRequest, UpdateUserRequest, UserFormProps } from '../types';

const UserForm: React.FC<UserFormProps> = ({ 
  user, 
  mode, 
  onSubmit, 
  onCancel, 
  isLoading = false 
}) => {
  const [formData, setFormData] = useState<CreateUserRequest | UpdateUserRequest>(
    mode === 'create' 
      ? {
          telegram_id: 0,
          username: '',
          first_name: '',
          last_name: '',
          referral_code: '',
          referred_by: '',
        }
      : {
          username: '',
          first_name: '',
          last_name: '',
          balance: 0,
          total_profit: 0,
          referral_bonus: 0,
          is_active: true,
        }
  );

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Initialize form data when user prop changes
  useEffect(() => {
    if (user && mode === 'edit') {
      setFormData({
        username: user.username || '',
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        balance: user.balance,
        total_profit: user.total_profit,
        referral_bonus: user.referral_bonus,
        is_active: user.is_active,
      });
    }
  }, [user, mode]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (mode === 'create') {
      const createData = formData as CreateUserRequest;
      if (!createData.telegram_id) {
        newErrors.telegram_id = 'Telegram ID is required';
      }
      if (!createData.referral_code) {
        newErrors.referral_code = 'Referral code is required';
      }
    }

    if (!formData.first_name) {
      newErrors.first_name = 'First name is required';
    }

    if (!formData.last_name) {
      newErrors.last_name = 'Last name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    onSubmit(formData);
  };

  // Helper reserved for future use
  const formatCurrency = (_amount: number) => '';

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Telegram ID (only for create mode) */}
        {mode === 'create' && (
          <div>
            <label htmlFor="telegram_id" className="block text-sm font-medium text-gray-700 mb-2">
              Telegram ID *
            </label>
            <input
              type="number"
              id="telegram_id"
              name="telegram_id"
              value={(formData as CreateUserRequest).telegram_id || ''}
              onChange={handleChange}
              className={`w-full px-4 py-3 border-2 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#536895] focus:border-[#536895] transition-all duration-200 ${
                errors.telegram_id ? 'border-red-300' : 'border-gray-200'
              }`}
              placeholder="Enter Telegram ID"
            />
            {errors.telegram_id && (
              <p className="mt-1 text-sm text-red-600">{errors.telegram_id}</p>
            )}
          </div>
        )}

        {/* Username */}
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
            Username
          </label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username || ''}
            onChange={handleChange}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#536895] focus:border-[#536895] transition-all duration-200"
            placeholder="Enter username"
          />
        </div>

        {/* First Name */}
        <div>
          <label htmlFor="first_name" className="block text-sm font-medium text-gray-700 mb-2">
            First Name *
          </label>
          <input
            type="text"
            id="first_name"
            name="first_name"
            value={formData.first_name || ''}
            onChange={handleChange}
            className={`w-full px-4 py-3 border-2 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#536895] focus:border-[#536895] transition-all duration-200 ${
              errors.first_name ? 'border-red-300' : 'border-gray-200'
            }`}
            placeholder="Enter first name"
          />
          {errors.first_name && (
            <p className="mt-1 text-sm text-red-600">{errors.first_name}</p>
          )}
        </div>

        {/* Last Name */}
        <div>
          <label htmlFor="last_name" className="block text-sm font-medium text-gray-700 mb-2">
            Last Name *
          </label>
          <input
            type="text"
            id="last_name"
            name="last_name"
            value={formData.last_name || ''}
            onChange={handleChange}
            className={`w-full px-4 py-3 border-2 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#536895] focus:border-[#536895] transition-all duration-200 ${
              errors.last_name ? 'border-red-300' : 'border-gray-200'
            }`}
            placeholder="Enter last name"
          />
          {errors.last_name && (
            <p className="mt-1 text-sm text-red-600">{errors.last_name}</p>
          )}
        </div>

        {/* Referral Code (only for create mode) */}
        {mode === 'create' && (
          <div>
            <label htmlFor="referral_code" className="block text-sm font-medium text-gray-700 mb-2">
              Referral Code *
            </label>
            <input
              type="text"
              id="referral_code"
              name="referral_code"
              value={(formData as CreateUserRequest).referral_code || ''}
              onChange={handleChange}
              className={`w-full px-4 py-3 border-2 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#536895] focus:border-[#536895] transition-all duration-200 ${
                errors.referral_code ? 'border-red-300' : 'border-gray-200'
              }`}
              placeholder="Enter referral code"
            />
            {errors.referral_code && (
              <p className="mt-1 text-sm text-red-600">{errors.referral_code}</p>
            )}
          </div>
        )}

        {/* Referred By (only for create mode) */}
        {mode === 'create' && (
          <div>
            <label htmlFor="referred_by" className="block text-sm font-medium text-gray-700 mb-2">
              Referred By
            </label>
            <input
              type="text"
              id="referred_by"
              name="referred_by"
              value={(formData as CreateUserRequest).referred_by || ''}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#536895] focus:border-[#536895] transition-all duration-200"
              placeholder="Enter referrer code"
            />
          </div>
        )}

        {/* Balance (only for edit mode) */}
        {mode === 'edit' && (
          <div>
            <label htmlFor="balance" className="block text-sm font-medium text-gray-700 mb-2">
              Balance
            </label>
            <input
              type="number"
              id="balance"
              name="balance"
              value={(formData as UpdateUserRequest).balance || 0}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#536895] focus:border-[#536895] transition-all duration-200"
              placeholder="Enter balance"
            />
          </div>
        )}

        {/* Total Profit (only for edit mode) */}
        {mode === 'edit' && (
          <div>
            <label htmlFor="total_profit" className="block text-sm font-medium text-gray-700 mb-2">
              Total Profit
            </label>
            <input
              type="number"
              id="total_profit"
              name="total_profit"
              value={(formData as UpdateUserRequest).total_profit || 0}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#536895] focus:border-[#536895] transition-all duration-200"
              placeholder="Enter total profit"
            />
          </div>
        )}

        {/* Referral Bonus (only for edit mode) */}
        {mode === 'edit' && (
          <div>
            <label htmlFor="referral_bonus" className="block text-sm font-medium text-gray-700 mb-2">
              Referral Bonus
            </label>
            <input
              type="number"
              id="referral_bonus"
              name="referral_bonus"
              value={(formData as UpdateUserRequest).referral_bonus || 0}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#536895] focus:border-[#536895] transition-all duration-200"
              placeholder="Enter referral bonus"
            />
          </div>
        )}

        {/* Is Active (only for edit mode) */}
        {mode === 'edit' && (
          <div>
            <label htmlFor="is_active" className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              id="is_active"
              name="is_active"
              value={(formData as UpdateUserRequest).is_active ? 'true' : 'false'}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#536895] focus:border-[#536895] transition-all duration-200"
            >
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-2xl hover:bg-gray-50 transition-all duration-200 font-semibold"
          disabled={isLoading}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-6 py-3 bg-gradient-to-r from-[#536895] to-[#4a5f8a] text-white rounded-2xl hover:from-[#4a5f8a] hover:to-[#536895] transition-all duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="flex items-center">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              {mode === 'create' ? 'Creating...' : 'Updating...'}
            </div>
          ) : (
            mode === 'create' ? 'Create User' : 'Update User'
          )}
        </button>
      </div>
    </form>
  );
};

export default UserForm;
