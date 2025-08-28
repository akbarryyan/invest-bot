// Custom Hook for User Management
// Handles user data, API calls, and state management

import { useState, useEffect, useCallback } from 'react';
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
      setUsers(response.data);
      setPagination({
        page: response.pagination.page,
        limit: response.pagination.limit,
        total: response.pagination.total,
        total_pages: response.pagination.total_pages,
      });
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || 'Failed to fetch users');
      console.error('Error fetching users:', apiError);
    } finally {
      setIsLoading(false);
    }
  }, [pagination.limit]);

  // Fetch user statistics
  const fetchStats = useCallback(async () => {
    try {
      const statsData = await userApi.getUserStats();
      setStats(statsData);
    } catch (err) {
      const apiError = err as ApiError;
      console.error('Error fetching user stats:', apiError);
      // Don't set error for stats as it's not critical
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
      setError(apiError.message || 'Failed to create user');
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
      setError(apiError.message || 'Failed to update user');
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
      setError(apiError.message || 'Failed to delete user');
      console.error('Error deleting user:', apiError);
      return false;
    } finally {
      setIsDeleting(false);
    }
  }, [fetchStats]);

  // Initial data fetch
  useEffect(() => {
    fetchUsers();
    fetchStats();
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
