// Custom Hook for Package Management
// Handles package data, API calls, and state management

import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { packageApi } from '../services/api';
import type { Package, CreatePackageRequest, UpdatePackageRequest, PackageFilters, ApiError } from '../types';

interface UsePackagesReturn {
  // Data
  packages: Package[];
  
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
  fetchPackages: (filters?: PackageFilters, page?: number) => Promise<void>;
  createPackage: (packageData: CreatePackageRequest) => Promise<Package | null>;
  updatePackage: (id: number, packageData: UpdatePackageRequest) => Promise<Package | null>;
  deletePackage: (id: number) => Promise<boolean>;
  clearError: () => void;
}

export const usePackages = (): UsePackagesReturn => {
  // State
  const [packages, setPackages] = useState<Package[]>([]);
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

  // Fetch packages with filters and pagination
  const fetchPackages = useCallback(async (filters?: PackageFilters, page: number = 1) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await packageApi.getPackages(filters, page, pagination.limit);
      
                   // Handle response data safely
             console.log('API Response:', response);
             
             // packageApi.getPackages mengembalikan { data: [...], pagination: {...} }
             if (response && response.data) {
               // Convert database data types to frontend types
               const convertedPackages = response.data.map((pkg: any) => {
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
                   ...pkg,
                   is_active: Boolean(pkg.is_active), // Convert 1/0 to true/false
                   price: safeParseFloat(pkg.price),
                   duration_days: safeParseInt(pkg.duration_days),
                   daily_return: safeParseFloat(pkg.daily_return),
                 };
               });
               
               // Filter out inactive packages (if using soft delete)
               const activePackages = convertedPackages.filter(pkg => pkg.is_active);
               
               console.log('Setting packages:', activePackages);
               setPackages(activePackages);
             } else {
               console.log('No data in response, setting empty array');
               setPackages([]);
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
      console.error('Error fetching packages:', err);
      setPackages([]);
      setPagination(prev => ({
        ...prev,
        page: page,
        total: 0,
        total_pages: 1,
      }));
      setError('Failed to fetch packages. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }, [pagination.limit]);

  // Create new package
  const createPackage = useCallback(async (packageData: CreatePackageRequest): Promise<Package | null> => {
    setIsCreating(true);
    setError(null);
    
    try {
      const newPackage = await packageApi.createPackage(packageData);
      
      // Add new package to the list
      setPackages(prev => [newPackage, ...prev]);
      
      return newPackage;
    } catch (err) {
      const apiError = err as ApiError;
      const errorMessage = apiError.message || 'Failed to create package';
      setError(errorMessage);
      toast.error(errorMessage);
      console.error('Error creating package:', apiError);
      return null;
    } finally {
      setIsCreating(false);
    }
  }, []);

  // Update package
  const updatePackage = useCallback(async (id: number, packageData: UpdatePackageRequest): Promise<Package | null> => {
    setIsUpdating(true);
    setError(null);
    
    try {
      const updatedPackage = await packageApi.updatePackage(id, packageData);
      
      // Update package in the list
      setPackages(prev => prev.map(pkg => 
        pkg.id === id ? updatedPackage : pkg
      ));
      
      return updatedPackage;
    } catch (err) {
      const apiError = err as ApiError;
      const errorMessage = apiError.message || 'Failed to update package';
      setError(errorMessage);
      toast.error(errorMessage);
      console.error('Error updating package:', apiError);
      return null;
    } finally {
      setIsUpdating(false);
    }
  }, []);

  // Delete package
  const deletePackage = useCallback(async (id: number): Promise<boolean> => {
    setIsDeleting(true);
    setError(null);
    
    try {
      await packageApi.deletePackage(id);
      
      // Remove package from the list
      setPackages(prev => prev.filter(pkg => pkg.id !== id));
      
      return true;
    } catch (err) {
      const apiError = err as ApiError;
      const errorMessage = apiError.message || 'Failed to delete package';
      setError(errorMessage);
      toast.error(errorMessage);
      console.error('Error deleting package:', apiError);
      return false;
    } finally {
      setIsDeleting(false);
    }
  }, []);

  // Initial data fetch
  useEffect(() => {
    // Only fetch if backend is available
    const initializeData = async () => {
      try {
        await fetchPackages();
      } catch (error) {
        console.log('Backend not available yet, using default state');
      }
    };
    
    initializeData();
  }, [fetchPackages]);

  return {
    // Data
    packages,
    
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
    fetchPackages,
    createPackage,
    updatePackage,
    deletePackage,
    clearError,
  };
};
