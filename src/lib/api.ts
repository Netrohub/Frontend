/**
 * API Client for NXOLand Backend
 * Connects to Laravel API backend
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.nxoland.com/api';

interface RequestOptions extends RequestInit {
  headers?: HeadersInit;
}

class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    // Load token from localStorage
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('auth_token');
    }
  }

  setToken(token: string | null) {
    this.token = token;
    if (token && typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token);
    } else if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
    }
  }

  getToken(): string | null {
    return this.token;
  }

  private async request<T>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
      credentials: 'include', // For Sanctum cookies
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        message: response.statusText,
      }));
      throw new Error(error.message || 'API request failed');
    }

    return response.json();
  }

  async get<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  async post<T>(endpoint: string, data?: any, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: any, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }
}

// Create singleton instance
export const api = new ApiClient(API_BASE_URL);

// Auth API
export const authApi = {
  register: (data: { name: string; email: string; password: string; password_confirmation: string; phone?: string }) =>
    api.post<{ user: any; token: string }>('/register', data),
  
  login: (data: { email: string; password: string }) =>
    api.post<{ user: any; token: string }>('/login', data),
  
  logout: () =>
    api.post('/logout'),
  
  getUser: () =>
    api.get<any>('/user'),
};

// Listings API
export const listingsApi = {
  getAll: (params?: { category?: string; search?: string; page?: number }) => {
    const query = new URLSearchParams();
    if (params?.category) query.append('category', params.category);
    if (params?.search) query.append('search', params.search);
    if (params?.page) query.append('page', params.page.toString());
    return api.get(`/listings?${query.toString()}`);
  },
  
  getById: (id: number) =>
    api.get(`/listings/${id}`),
  
  create: (data: any) =>
    api.post('/listings', data),
  
  update: (id: number, data: any) =>
    api.put(`/listings/${id}`, data),
  
  delete: (id: number) =>
    api.delete(`/listings/${id}`),
};

// Orders API
export const ordersApi = {
  getAll: (params?: { page?: number }) => {
    const query = new URLSearchParams();
    if (params?.page) query.append('page', params.page.toString());
    return api.get(`/orders?${query.toString()}`);
  },
  
  getById: (id: number) =>
    api.get(`/orders/${id}`),
  
  create: (data: { listing_id: number; notes?: string }) =>
    api.post('/orders', data),
  
  update: (id: number, data: any) =>
    api.put(`/orders/${id}`, data),
};

// Payments API
export const paymentsApi = {
  create: (data: { order_id: number }) =>
    api.post('/payments/create', data),
};

// Disputes API
export const disputesApi = {
  getAll: () =>
    api.get('/disputes'),
  
  getById: (id: number) =>
    api.get(`/disputes/${id}`),
  
  create: (data: { order_id: number; reason: string; description: string }) =>
    api.post('/disputes', data),
  
  update: (id: number, data: any) =>
    api.put(`/disputes/${id}`, data),
};

// Wallet API
export const walletApi = {
  get: () =>
    api.get('/wallet'),
  
  withdraw: (data: { amount: number; bank_account: string }) =>
    api.post('/wallet/withdraw', data),
};

// KYC API
export const kycApi = {
  get: () =>
    api.get('/kyc'),
  
  create: () =>
    api.post('/kyc'),
};

// Public API
export const publicApi = {
  leaderboard: () =>
    api.get('/leaderboard'),
  
  members: (params?: { page?: number }) => {
    const query = new URLSearchParams();
    if (params?.page) query.append('page', params.page.toString());
    return api.get(`/members?${query.toString()}`);
  },
  
  member: (id: number) =>
    api.get(`/members/${id}`),
};

// Admin API
export const adminApi = {
  users: (params?: { page?: number }) => {
    const query = new URLSearchParams();
    if (params?.page) query.append('page', params.page.toString());
    return api.get(`/admin/users?${query.toString()}`);
  },
  
  updateUser: (id: number, data: any) =>
    api.put(`/admin/users/${id}`, data),
  
  deleteUser: (id: number) =>
    api.delete(`/admin/users/${id}`),
  
  disputes: () =>
    api.get('/admin/disputes'),
  
  listings: () =>
    api.get('/admin/listings'),
  
  orders: () =>
    api.get('/admin/orders'),
  
  kyc: () =>
    api.get('/admin/kyc'),
};

