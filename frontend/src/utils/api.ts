const API_BASE_URL = 'http://localhost:8000/api';

export interface ApiResponse<T> {
  data?: T;
  message?: string;
  error?: string;
}

export class ApiClient {
  private static async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const defaultOptions: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Add auth token if available
    const token = localStorage.getItem('auth_token');
    if (token) {
      defaultOptions.headers = {
        ...defaultOptions.headers,
        'Authorization': `Bearer ${token}`,
      };
    }

    try {
      const response = await fetch(url, defaultOptions);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return { data };
    } catch (error) {
      console.error('API request failed:', error);
      return { 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      };
    }
  }

  // Authentication
  static async login(username: string, password: string) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
  }

  static async logout() {
    return this.request('/auth/logout', {
      method: 'POST',
    });
  }

  // Packages
  static async getPackages() {
    return this.request('/packages');
  }

  static async createPackage(packageData: any) {
    return this.request('/packages', {
      method: 'POST',
      body: JSON.stringify(packageData),
    });
  }

  static async updatePackage(id: number, packageData: any) {
    return this.request(`/packages/${id}`, {
      method: 'PUT',
      body: JSON.stringify(packageData),
    });
  }

  static async deletePackage(id: number) {
    return this.request(`/packages/${id}`, {
      method: 'DELETE',
    });
  }

  // Users
  static async getUsers() {
    return this.request('/users');
  }

  static async getUser(id: number) {
    return this.request(`/users/${id}`);
  }

  static async updateUser(id: number, userData: any) {
    return this.request(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  // Transactions
  static async getTransactions() {
    return this.request('/transactions');
  }

  static async getTransaction(id: number) {
    return this.request(`/transactions/${id}`);
  }
}

export default ApiClient;
