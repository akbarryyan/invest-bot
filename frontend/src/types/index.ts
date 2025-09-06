// Database Schema Types
// Based on MySQL schema for Invest Bot

// User Types
export interface User {
  id: number;
  telegram_id: number;
  username?: string;
  first_name?: string;
  last_name?: string;
  balance: number;
  total_profit: number;
  referral_code: string;
  referred_by?: string;
  referral_bonus: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  phone: string;
  email: string;
  last_activity: string;
}

export interface CreateUserRequest {
  telegram_id: number;
  username?: string;
  first_name?: string;
  last_name?: string;
  phone: string;
  email: string;
  referral_code: string;
  referred_by?: string;
  // Optional fields allowed on create for admin panel convenience
  balance?: number;
  total_profit?: number;
  referral_bonus?: number;
  is_active?: boolean;
}

export interface UpdateUserRequest {
  username?: string;
  first_name?: string;
  last_name?: string;
  balance?: number;
  total_profit?: number;
  referral_bonus?: number;
  is_active?: boolean;
  // Allow updating referral metadata if needed
  referral_code?: string;
  referred_by?: string;
}

// Package Types
export interface Package {
  id: number;
  name: string;
  description: string;
  price: number;
  duration_days: number;
  daily_return: number;
  daily_return_amount?: number; // Backend field for compatibility
  image_url?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreatePackageRequest {
  name: string;
  description: string;
  price: number;
  duration_days: number;
  daily_return: number;
  image_url?: string;
}

export interface UpdatePackageRequest {
  name?: string;
  description?: string;
  price?: number;
  duration_days?: number;
  daily_return?: number;
  image_url?: string;
  is_active?: boolean;
}

// User Package Types
export interface UserPackage {
  id: number;
  user_id: number;
  package_id: number;
  purchase_date: string;
  expiry_date: string;
  is_active: boolean;
  total_claimed: number;
  created_at: string;
  updated_at: string;
  user?: User;
  package?: Package;
}

// Transaction Types
export interface Transaction {
  id: number;
  user_id: number;
  type: 'deposit' | 'withdraw' | 'claim' | 'referral' | 'package_purchase';
  amount: number;
  description: string;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  reference_id?: string;
  created_at: string;
  updated_at: string;
  user?: User;
}

export interface CreateTransactionRequest {
  user_id: number;
  type: 'deposit' | 'withdraw' | 'claim' | 'referral' | 'package_purchase';
  amount: number;
  description: string;
  reference_id?: string;
}

// Referral Types
export interface Referral {
  id: number;
  referrer_id: number;
  referred_id: number;
  bonus_amount: number;
  status: 'pending' | 'paid' | 'cancelled';
  created_at: string;
  updated_at: string;
  referrer?: User;
  referred?: User;
}

// Daily Claim Types
export interface DailyClaim {
  id: number;
  user_id: number;
  user_package_id: number;
  claim_date: string;
  amount: number;
  created_at: string;
  user?: User;
  user_package?: UserPackage;
}

// Admin User Types
export interface AdminUser {
  id: number;
  username: string;
  email: string;
  role: 'admin' | 'super_admin';
  is_active: boolean;
  last_login?: string;
  created_at: string;
  updated_at: string;
}

// API Response Types
export interface ApiResponse<T = any> {
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
}

export interface ApiError {
  message: string;
  status: number;
  details?: any;
}

// Filter and Search Types
export interface UserFilters {
  search?: string;
  status?: 'active' | 'inactive' | 'all';
  min_balance?: number;
  max_balance?: number;
  sort_by?: 'created_at' | 'balance' | 'total_profit' | 'username';
  sort_order?: 'asc' | 'desc';
}

export interface PackageFilters {
  search?: string;
  status?: 'active' | 'inactive' | 'all';
  min_price?: number;
  max_price?: number;
  sort_by?: 'created_at' | 'price' | 'daily_return' | 'name';
  sort_order?: 'asc' | 'desc';
}

export interface TransactionFilters {
  search?: string;
  type?: 'deposit' | 'withdraw' | 'claim' | 'referral' | 'package_purchase' | 'all';
  status?: 'pending' | 'completed' | 'failed' | 'cancelled' | 'all';
  min_amount?: number;
  max_amount?: number;
  date_from?: string;
  date_to?: string;
  sort_by?: 'created_at' | 'amount' | 'type';
  sort_order?: 'asc' | 'desc';
}

// Dashboard Types
export interface DashboardStats {
  total_users: number;
  active_users: number;
  total_balance: number;
  pending_users: number;
  total_packages: number;
  active_packages: number;
  total_transactions: number;
  total_profit: number;
}

export interface RecentActivity {
  id: number;
  type: 'user_registered' | 'package_purchased' | 'claim_made' | 'transaction_completed';
  user_id: number;
  description: string;
  amount?: number;
  created_at: string;
  user?: User;
}

// Modal Types
export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

// Form Types
export interface UserFormProps {
  user?: User;
  mode: 'create' | 'edit';
  onSubmit: (data: CreateUserRequest | UpdateUserRequest) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export interface PackageFormProps {
  package?: Package;
  mode: 'create' | 'edit';
  onSubmit: (data: CreatePackageRequest | UpdatePackageRequest) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

// Component Props Types
export interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  isLoading?: boolean;
}

export interface UserDeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  user: User | null;
  isLoading?: boolean;
}

// Utility Types
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export interface PaginationState {
  page: number;
  limit: number;
  total: number;
  total_pages: number;
}

export interface SortState {
  field: string;
  direction: 'asc' | 'desc';
}
