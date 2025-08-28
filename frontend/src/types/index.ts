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
}

export interface CreateUserRequest {
  telegram_id: number;
  username?: string;
  first_name?: string;
  last_name?: string;
  referral_code: string;
  referred_by?: string;
}

export interface UpdateUserRequest {
  username?: string;
  first_name?: string;
  last_name?: string;
  balance?: number;
  total_profit?: number;
  referral_bonus?: number;
  is_active?: boolean;
}

// Package Types
export interface Package {
  id: number;
  name: string;
  description?: string;
  price: number;
  duration_days: number;
  daily_return: number;
  image_url?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreatePackageRequest {
  name: string;
  description?: string;
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

// User Package Types (Active investments)
export interface UserPackage {
  id: number;
  user_id: number;
  package_id: number;
  purchase_date: string;
  expiry_date: string;
  daily_return_amount: number;
  total_return_earned: number;
  is_active: boolean;
  // Joined data
  user?: User;
  package?: Package;
}

export interface CreateUserPackageRequest {
  user_id: number;
  package_id: number;
  expiry_date: string;
  daily_return_amount: number;
}

// Transaction Types
export type TransactionType = 'purchase' | 'claim' | 'deposit' | 'withdraw' | 'referral' | 'bonus';
export type TransactionStatus = 'pending' | 'completed' | 'failed' | 'cancelled';

export interface Transaction {
  id: number;
  user_id: number;
  package_id?: number;
  transaction_type: TransactionType;
  amount: number;
  status: TransactionStatus;
  description?: string;
  created_at: string;
  updated_at: string;
  // Joined data
  user?: User;
  package?: Package;
}

export interface CreateTransactionRequest {
  user_id: number;
  package_id?: number;
  transaction_type: TransactionType;
  amount: number;
  description?: string;
}

export interface UpdateTransactionRequest {
  status?: TransactionStatus;
  description?: string;
}

// Referral Types
export interface Referral {
  id: number;
  referrer_id: number;
  referred_id: number;
  bonus_amount: number;
  is_paid: boolean;
  created_at: string;
  // Joined data
  referrer?: User;
  referred?: User;
}

export interface CreateReferralRequest {
  referrer_id: number;
  referred_id: number;
  bonus_amount: number;
}

// Daily Claim Types (Anti-spam)
export interface DailyClaim {
  id: number;
  user_id: number;
  package_id: number;
  claim_date: string;
  amount: number;
  created_at: string;
  // Joined data
  user?: User;
  package?: Package;
}

export interface CreateDailyClaimRequest {
  user_id: number;
  package_id: number;
  claim_date: string;
  amount: number;
}

// Admin User Types
export interface AdminUser {
  id: number;
  username: string;
  password_hash: string;
  email?: string;
  is_active: boolean;
  last_login?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateAdminUserRequest {
  username: string;
  password: string;
  email?: string;
}

export interface UpdateAdminUserRequest {
  username?: string;
  password?: string;
  email?: string;
  is_active?: boolean;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
  message?: string;
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
  type?: TransactionType;
  status?: TransactionStatus;
  user_id?: number;
  package_id?: number;
  date_from?: string;
  date_to?: string;
  sort_by?: 'created_at' | 'amount' | 'transaction_type';
  sort_order?: 'asc' | 'desc';
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
export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'number' | 'select' | 'textarea' | 'checkbox' | 'date';
  required?: boolean;
  placeholder?: string;
  options?: { value: string | number; label: string }[];
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    message?: string;
  };
}

// Dashboard Stats Types
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

// Recent Activity Types
export interface RecentActivity {
  id: number;
  type: 'user_registered' | 'package_purchased' | 'claim_made' | 'transaction_completed';
  user_id: number;
  description: string;
  amount?: number;
  created_at: string;
  user?: User;
}

// Notification Types
export interface Notification {
  id: number;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

// Utility Types
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export interface ApiError {
  message: string;
  status: number;
  details?: any;
}
