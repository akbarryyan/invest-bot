// Custom Hook for User Management
// Handles user data, API calls, and state management

import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { userApi } from '../services/api';
import type { User, CreateUserRequest, UpdateUserRequest, UserFilters, ApiError } from '../types';

interface UseUsersReturn {
  // Data
  users: User[];
  stats: {
    total_users: number;
    active_users: number;
    total_balance: number;
    inactive_users: number;
  };
  
  // Loading states
  isLoading: boolean;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  
  // Error states
  error: string | null;
  
  // Pagination
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
  
  // Actions
  fetchUsers: (filters?: UserFilters, page?: number) => Promise<void>;
  createUser: (userData: CreateUserRequest) => Promise<User | null>;
  updateUser: (id: number, userData: UpdateUserRequest) => Promise<User | null>;
  deleteUser: (id: number) => Promise<boolean>;
  fetchStats: () => Promise<void>;
  clearError: () => void;
}

export const useUsers = (): UseUsersReturn => {
  // State
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState({
    total_users: 0,
    active_users: 0,
    total_balance: 0,
    inactive_users: 0,
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    total_pages: 0,
  });
  
  // Loading states
  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Error state
  const [error, setError] = useState<string | null>(null);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Fetch users with filters and pagination
  const fetchUsers = useCallback(async (filters?: UserFilters, page: number = 1) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await userApi.getUsers(filters, page, pagination.limit);
      
      // Handle response data safely
      console.log('API Response:', response);
      if (response && response.data) {
        // Convert database data types to frontend types
        const convertedUsers = response.data.map(user => {
          // Helper function to safely convert to number
          const safeParseFloat = (value: any): number => {
            if (typeof value === 'number') return value;
            if (typeof value === 'string') return parseFloat(value) || 0;
            return 0;
          };

          const safeParseInt = (value: any): number => {
            if (typeof value === 'number') return value;
            if (typeof value === 'string') return parseInt(value) || 0;
            return 0;
          };

          return {
            ...user,
            is_active: Boolean(user.is_active), // Convert 1/0 to true/false
            balance: safeParseFloat(user.balance),
            total_profit: safeParseFloat(user.total_profit),
            referral_bonus: safeParseFloat(user.referral_bonus),
            telegram_id: safeParseInt(user.telegram_id)
          };
        });
        
        console.log('Setting users:', convertedUsers);
        setUsers(convertedUsers);
      } else {
        console.log('No data in response, setting empty array');
        setUsers([]);
      }
      
      // Handle pagination safely
      if (response && response.pagination) {
        setPagination({
          page: response.pagination.page || page,
          limit: response.pagination.limit || pagination.limit,
          total: response.pagination.total || 0,
          total_pages: response.pagination.total_pages || 1,
        });
      } else {
        // Set default pagination if response doesn't have pagination
        setPagination(prev => ({
          ...prev,
          page: page,
          total: 0,
          total_pages: 1,
        }));
      }
    } catch (err) {
      console.error('Error fetching users:', err);
      setUsers([]);
      setPagination(prev => ({
        ...prev,
        page: page,
        total: 0,
        total_pages: 1,
      }));
      setError('Failed to fetch users. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }, [pagination.limit]);

  // Fetch user statistics
  const fetchStats = useCallback(async () => {
    try {
      const statsData = await userApi.getUserStats();
      console.log('Stats response:', statsData);
      setStats(statsData);
    } catch (err) {
      console.error('Error fetching user stats:', err);
      // Set default stats on error
      setStats({
        total_users: 0,
        active_users: 0,
        total_balance: 0,
        inactive_users: 0,
      });
    }
  }, []);

  // Create new user
  const createUser = useCallback(async (userData: CreateUserRequest): Promise<User | null> => {
    setIsCreating(true);
    setError(null);
    
    try {
      const newUser = await userApi.createUser(userData);
      
      // Add new user to the list
      setUsers(prev => [newUser, ...prev]);
      
      // Update stats
      await fetchStats();
      
      return newUser;
    } catch (err) {
      const apiError = err as ApiError;
      const errorMessage = apiError.message || 'Failed to create user';
      setError(errorMessage);
      toast.error(errorMessage);
      console.error('Error creating user:', apiError);
      return null;
    } finally {
      setIsCreating(false);
    }
  }, [fetchStats]);

  // Update user
  const updateUser = useCallback(async (id: number, userData: UpdateUserRequest): Promise<User | null> => {
    setIsUpdating(true);
    setError(null);
    
    try {
      const updatedUser = await userApi.updateUser(id, userData);
      
      // Update user in the list
      setUsers(prev => prev.map(user => 
        user.id === id ? updatedUser : user
      ));
      
      // Update stats
      await fetchStats();
      
      return updatedUser;
    } catch (err) {
      const apiError = err as ApiError;
      const errorMessage = apiError.message || 'Failed to update user';
      setError(errorMessage);
      toast.error(errorMessage);
      console.error('Error updating user:', apiError);
      return null;
    } finally {
      setIsUpdating(false);
    }
  }, [fetchStats]);

  // Delete user
  const deleteUser = useCallback(async (id: number): Promise<boolean> => {
    setIsDeleting(true);
    setError(null);
    
    try {
      await userApi.deleteUser(id);
      
      // Remove user from the list
      setUsers(prev => prev.filter(user => user.id !== id));
      
      // Update stats
      await fetchStats();
      
      return true;
    } catch (err) {
      const apiError = err as ApiError;
      const errorMessage = apiError.message || 'Failed to delete user';
      setError(errorMessage);
      toast.error(errorMessage);
      console.error('Error deleting user:', apiError);
      return false;
    } finally {
      setIsDeleting(false);
    }
  }, [fetchStats]);

  // Initial data fetch
  useEffect(() => {
    // Only fetch if backend is available
    const initializeData = async () => {
      try {
        await Promise.all([
          fetchUsers(),
          fetchStats()
        ]);
      } catch (error) {
        console.log('Backend not available yet, using default state');
      }
    };
    
    initializeData();
  }, [fetchUsers, fetchStats]);

  return {
    // Data
    users,
    stats,
    
    // Loading states
    isLoading,
    isCreating,
    isUpdating,
    isDeleting,
    
    // Error state
    error,
    
    // Pagination
    pagination,
    
    // Actions
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
    fetchStats,
    clearError,
  };
};
