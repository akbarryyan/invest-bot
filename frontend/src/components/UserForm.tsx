import React, { useState, useEffect } from 'react';
import type { User, CreateUserRequest, UpdateUserRequest } from '../types';

interface UserFormProps {
  user?: User;
  onSubmit: (data: CreateUserRequest | UpdateUserRequest) => void;
  onCancel: () => void;
  isLoading?: boolean;
  mode?: 'create' | 'edit';
}

const UserForm: React.FC<UserFormProps> = ({ 
  user, 
  onSubmit, 
  onCancel, 
  isLoading = false,
  mode = 'create'
}) => {
  const isEditing = mode === 'edit' || !!user;
  
  const [formData, setFormData] = useState({
    telegram_id: user?.telegram_id || '',
    username: user?.username || '',
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    referral_code: user?.referral_code || '',
    referred_by: user?.referred_by || '',
    balance: user?.balance || 0,
    total_profit: user?.total_profit || 0,
    referral_bonus: user?.referral_bonus || 0,
    is_active: user?.is_active ?? true
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (user) {
      setFormData({
        telegram_id: user.telegram_id || '',
        username: user.username || '',
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        referral_code: user.referral_code || '',
        referred_by: user.referred_by || '',
        balance: user.balance || 0,
        total_profit: user.total_profit || 0,
        referral_bonus: user.referral_bonus || 0,
        is_active: user.is_active ?? true
      });
    }
  }, [user]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.telegram_id) {
      newErrors.telegram_id = 'Telegram ID is required';
    } else if (isNaN(Number(formData.telegram_id))) {
      newErrors.telegram_id = 'Telegram ID must be a number';
    }

    if (!formData.referral_code) {
      newErrors.referral_code = 'Referral code is required';
    } else if (formData.referral_code.length < 3) {
      newErrors.referral_code = 'Referral code must be at least 3 characters';
    }

    if (formData.balance < 0) {
      newErrors.balance = 'Balance cannot be negative';
    }

    if (formData.total_profit < 0) {
      newErrors.total_profit = 'Total profit cannot be negative';
    }

    if (formData.referral_bonus < 0) {
      newErrors.referral_bonus = 'Referral bonus cannot be negative';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const submitData = {
      ...formData,
      telegram_id: Number(formData.telegram_id),
      balance: Number(formData.balance),
      total_profit: Number(formData.total_profit),
      referral_bonus: Number(formData.referral_bonus)
    };

    onSubmit(submitData);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
          Basic Information
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Telegram ID *
            </label>
            <input
              type="number"
              name="telegram_id"
              value={formData.telegram_id}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                errors.telegram_id 
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                  : 'border-gray-200 focus:border-[#536895] focus:ring-[#536895]'
              } focus:outline-none focus:ring-2`}
              placeholder="Enter Telegram ID"
              disabled={isEditing}
            />
            {errors.telegram_id && (
              <p className="mt-1 text-sm text-red-600">{errors.telegram_id}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Username
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#536895] focus:border-[#536895] transition-all duration-200"
              placeholder="Enter username"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              First Name
            </label>
            <input
              type="text"
              name="first_name"
              value={formData.first_name}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#536895] focus:border-[#536895] transition-all duration-200"
              placeholder="Enter first name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Last Name
            </label>
            <input
              type="text"
              name="last_name"
              value={formData.last_name}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#536895] focus:border-[#536895] transition-all duration-200"
              placeholder="Enter last name"
            />
          </div>
        </div>
      </div>

      {/* Referral Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
          Referral Information
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Referral Code *
            </label>
            <input
              type="text"
              name="referral_code"
              value={formData.referral_code}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                errors.referral_code 
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                  : 'border-gray-200 focus:border-[#536895] focus:ring-[#536895]'
              } focus:outline-none focus:ring-2`}
              placeholder="Enter referral code"
              disabled={isEditing}
            />
            {errors.referral_code && (
              <p className="mt-1 text-sm text-red-600">{errors.referral_code}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Referred By
            </label>
            <input
              type="text"
              name="referred_by"
              value={formData.referred_by}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#536895] focus:border-[#536895] transition-all duration-200"
              placeholder="Enter referrer code"
            />
          </div>
        </div>
      </div>

      {/* Financial Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
          Financial Information
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Balance (IDR)
            </label>
            <input
              type="number"
              name="balance"
              value={formData.balance}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                errors.balance 
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                  : 'border-gray-200 focus:border-[#536895] focus:ring-[#536895]'
              } focus:outline-none focus:ring-2`}
              placeholder="0"
              min="0"
              step="1000"
            />
            {errors.balance && (
              <p className="mt-1 text-sm text-red-600">{errors.balance}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              Current: {formatCurrency(formData.balance)}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Total Profit (IDR)
            </label>
            <input
              type="number"
              name="total_profit"
              value={formData.total_profit}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                errors.total_profit 
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                  : 'border-gray-200 focus:border-[#536895] focus:ring-[#536895]'
              } focus:outline-none focus:ring-2`}
              placeholder="0"
              min="0"
              step="1000"
            />
            {errors.total_profit && (
              <p className="mt-1 text-sm text-red-600">{errors.total_profit}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              Current: {formatCurrency(formData.total_profit)}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Referral Bonus (IDR)
            </label>
            <input
              type="number"
              name="referral_bonus"
              value={formData.referral_bonus}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                errors.referral_bonus 
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                  : 'border-gray-200 focus:border-[#536895] focus:ring-[#536895]'
              } focus:outline-none focus:ring-2`}
              placeholder="0"
              min="0"
              step="1000"
            />
            {errors.referral_bonus && (
              <p className="mt-1 text-sm text-red-600">{errors.referral_bonus}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              Current: {formatCurrency(formData.referral_bonus)}
            </p>
          </div>
        </div>
      </div>

      {/* Status */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
          Account Status
        </h3>
        
        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            name="is_active"
            checked={formData.is_active}
            onChange={handleInputChange}
            className="w-4 h-4 text-[#536895] bg-gray-100 border-gray-300 rounded focus:ring-[#536895] focus:ring-2"
          />
          <label className="text-sm font-medium text-gray-700">
            Active Account
          </label>
        </div>
        <p className="text-xs text-gray-500">
          Inactive accounts cannot perform transactions or claims
        </p>
      </div>

      {/* Form Actions */}
      <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-3 bg-gray-100 text-gray-700 rounded-2xl hover:bg-gray-200 transition-all duration-200 font-semibold"
          disabled={isLoading}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-3 bg-gradient-to-r from-[#536895] to-[#4a5f8a] text-white rounded-2xl hover:from-[#4a5f8a] hover:to-[#536895] transition-all duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Saving...</span>
            </div>
          ) : (
            isEditing ? 'Update User' : 'Create User'
          )}
        </button>
      </div>
    </form>
  );
};

export default UserForm;
