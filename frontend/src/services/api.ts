// API Client Service
// Handles all API calls to the backend

import type { 
  User, 
  CreateUserRequest, 
  UpdateUserRequest, 
  UserFilters,
  Package,
  CreatePackageRequest,
  UpdatePackageRequest,
  PackageFilters,
  ApiResponse, 
  PaginatedResponse,
  ApiError 
} from '../types';

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// Helper function to handle API responses
const handleResponse = async <T>(response: Response): Promise<ApiResponse<T>> => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw {
      message: errorData.message || `HTTP error! status: ${response.status}`,
      status: response.status,
      details: errorData
    } as ApiError;
  }

  const data = await response.json();
  return data;
};

// Helper function to make API requests
const apiRequest = async <T>(
  endpoint: string, 
  options: RequestInit = {}
): Promise<ApiResponse<T>> => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    return await handleResponse<T>(response);
  } catch (error) {
    console.error('API request failed:', error);
    throw {
      message: 'Network error occurred',
      status: 0,
      details: error
    } as ApiError;
  }
};

// User API Functions
export const userApi = {
  // Get all users with pagination and filters
  getUsers: async (filters?: UserFilters, page: number = 1, limit: number = 10): Promise<PaginatedResponse<User>> => {
    const params = new URLSearchParams();
    
    if (filters?.search) params.append('search', filters.search);
    if (filters?.status && filters.status !== 'all') params.append('is_active', filters.status === 'active' ? 'true' : 'false');
    if (filters?.min_balance) params.append('min_balance', filters.min_balance.toString());
    if (filters?.max_balance) params.append('max_balance', filters.max_balance.toString());
    if (filters?.sort_by) params.append('sort_by', filters.sort_by);
    if (filters?.sort_order) params.append('sort_order', filters.sort_order);
    
    params.append('page', page.toString());
    params.append('limit', limit.toString());

    console.log('API Request URL:', `/users?${params.toString()}`);
    const response = await apiRequest<any>(`/users?${params.toString()}`);
    console.log('API Response:', response);
    
    // Backend mengirim { message, data: [...], pagination: {...} }
    // Kita perlu mengembalikan { data: [...], pagination: {...} }
    if (response.data) {
      return {
        data: response.data,
        pagination: response.data.pagination || { page: 1, limit: 10, total: 0, total_pages: 1 }
      };
    }
    
    return { data: [], pagination: { page: 1, limit: 10, total: 0, total_pages: 1 } };
  },

  // Get user by ID
  getUserById: async (id: number): Promise<User> => {
    const response = await apiRequest<User>(`/users/${id}`);
    return response.data!;
  },

  // Create new user
  createUser: async (userData: CreateUserRequest): Promise<User> => {
    const response = await apiRequest<User>('/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    return response.data!;
  },

  // Update user
  updateUser: async (id: number, userData: UpdateUserRequest): Promise<User> => {
    const response = await apiRequest<User>(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
    return response.data!;
  },

  // Delete user
  deleteUser: async (id: number): Promise<void> => {
    await apiRequest<void>(`/users/${id}`, {
      method: 'DELETE',
    });
  },

  // Get user statistics
  getUserStats: async (): Promise<{
    total_users: number;
    active_users: number;
    total_balance: number;
    inactive_users: number;
  }> => {
    const response = await apiRequest<{
      total_users: number;
      active_users: number;
      total_balance: number;
      inactive_users: number;
    }>('/users/stats');
    return response.data || {
      total_users: 0,
      active_users: 0,
      total_balance: 0,
      inactive_users: 0,
    };
  },
};

// Package API Functions
export const packageApi = {
  // Get all packages with pagination and filters
  getPackages: async (filters?: PackageFilters, page: number = 1, limit: number = 10): Promise<PaginatedResponse<Package>> => {
    const params = new URLSearchParams();
    
    if (filters?.search) params.append('search', filters.search);
    if (filters?.status && filters.status !== 'all') params.append('is_active', filters.status === 'active' ? 'true' : 'false');
    if (filters?.min_price) params.append('min_price', filters.min_price.toString());
    if (filters?.max_price) params.append('max_price', filters.max_price.toString());
    if (filters?.sort_by) params.append('sort_by', filters.sort_by);
    if (filters?.sort_order) params.append('sort_order', filters.sort_order);
    
    params.append('page', page.toString());
    params.append('limit', limit.toString());

    console.log('API Request URL:', `/packages?${params.toString()}`);
    const response = await apiRequest<any>(`/packages?${params.toString()}`);
    console.log('API Response:', response);
    
    // Backend mengirim { message, data: [...], pagination: {...} }
    // Kita perlu mengembalikan { data: [...], pagination: {...} }
    if (response.data) {
      return {
        data: response.data,
        pagination: response.data.pagination || { page: 1, limit: 10, total: 0, total_pages: 1 }
      };
    }
    
    return { data: [], pagination: { page: 1, limit: 10, total: 0, total_pages: 1 } };
  },

  // Get package by ID
  getPackageById: async (id: number): Promise<Package> => {
    const response = await apiRequest<Package>(`/packages/${id}`);
    return response.data!;
  },

  // Create new package
  createPackage: async (packageData: CreatePackageRequest): Promise<Package> => {
    const response = await apiRequest<Package>('/packages', {
      method: 'POST',
      body: JSON.stringify(packageData),
    });
    return response.data!;
  },

  // Update package
  updatePackage: async (id: number, packageData: UpdatePackageRequest): Promise<Package> => {
    const response = await apiRequest<Package>(`/packages/${id}`, {
      method: 'PUT',
      body: JSON.stringify(packageData),
    });
    return response.data!;
  },

  // Delete package
  deletePackage: async (id: number): Promise<void> => {
    await apiRequest<void>(`/packages/${id}`, {
      method: 'DELETE',
    });
  },
};

// Dashboard API Functions
export const dashboardApi = {
  // Get dashboard statistics
  getStats: async (): Promise<{
    total_users: number;
    active_users: number;
    total_balance: number;
    pending_users: number;
    total_packages: number;
    active_packages: number;
    total_transactions: number;
    total_profit: number;
  }> => {
    const response = await apiRequest<{
      total_users: number;
      active_users: number;
      total_balance: number;
      pending_users: number;
      total_packages: number;
      active_packages: number;
      total_transactions: number;
      total_profit: number;
    }>('/dashboard/stats');
    return response.data!;
  },

  // Get recent activity
  getRecentActivity: async (): Promise<Array<{
    id: number;
    type: 'user_registered' | 'package_purchased' | 'claim_made' | 'transaction_completed';
    user_id: number;
    description: string;
    amount?: number;
    created_at: string;
    user?: User;
  }>> => {
    const response = await apiRequest<Array<{
      id: number;
      type: 'user_registered' | 'package_purchased' | 'claim_made' | 'transaction_completed';
      user_id: number;
      description: string;
      amount?: number;
      created_at: string;
      user?: User;
    }>>('/dashboard/recent-activity');
    return response.data!;
  },
};

// Export default API client
export default {
  users: userApi,
  packages: packageApi,
  dashboard: dashboardApi,
};
