/**
 * API Client for NXOLand Backend
 * Connects to Laravel API backend
 */

import type {
  AuthResponse,
  LogoutResponse,
  User,
  Listing,
  ListingResponse,
  Order,
  OrderResponse,
  PaymentCreateResponse,
  Dispute,
  DisputeResponse,
  Wallet,
  KycVerification,
  KycCreateResponse,
  PaginatedResponse,
  LeaderboardResponse,
  MemberResponse,
  AdminUserResponse,
  AdminDisputeResponse,
  AdminListingResponse,
  AdminOrderResponse,
  AdminKycResponse,
  ApiError,
} from '@/types/api';
import { getAPIBaseURL } from '@/config/env';
import { API_TIMEOUT } from '@/config/constants';
import { getEnvConfig } from '@/config/env';

// Get IS_PRODUCTION from env without throwing if not configured
const IS_PRODUCTION = (() => {
  const nodeEnv = import.meta.env.NODE_ENV || import.meta.env.MODE || 'development';
  return nodeEnv === 'production';
})();

interface RequestOptions extends RequestInit {
  headers?: HeadersInit;
}

class ApiClient {
  private baseURL: string | null = null;
  private token: string | null = null;

  constructor(baseURL?: string) {
    // Store the baseURL if provided, otherwise it will be lazily evaluated
    this.baseURL = baseURL || null;
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

  private getBaseURL(): string {
    // Lazy evaluation - only get API_BASE_URL when actually making a request
    if (!this.baseURL) {
      this.baseURL = getAPIBaseURL();
    }
    return this.baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<T> {
    const url = `${this.getBaseURL()}${endpoint}`;
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    // Request timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

    try {
      const response = await fetch(url, {
        ...options,
        headers,
        credentials: 'include', // For Sanctum cookies
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);

      if (!response.ok) {
        let errorData: ApiError;
        try {
          errorData = await response.json();
        } catch {
          errorData = { message: response.statusText, status: response.status };
        }

        // Handle Laravel validation errors (422 status)
        if (response.status === 422 && errorData.errors) {
          // Format validation errors into a readable message
          const errorMessages: string[] = [];
          Object.keys(errorData.errors).forEach((key) => {
            const fieldErrors = errorData.errors![key];
            if (Array.isArray(fieldErrors)) {
              errorMessages.push(...fieldErrors);
            } else if (typeof fieldErrors === 'string') {
              errorMessages.push(fieldErrors);
            }
          });
          const errorMessage = errorMessages.length > 0 
            ? errorMessages.join(', ') 
            : errorData.message || 'Validation failed';
          const error = new Error(errorMessage) as Error & ApiError;
          error.errors = errorData.errors;
          error.status = response.status;
          
          // Log validation errors for debugging
          if (!IS_PRODUCTION) {
            console.error('API Validation Error:', {
              endpoint,
              status: response.status,
              errors: errorData.errors,
            });
          }
          
          throw error;
        }

        // Handle other errors
        const errorMessage = errorData.message || errorData.error || response.statusText || 'API request failed';
        const error = new Error(errorMessage) as Error & ApiError;
        error.status = response.status;
        error.data = errorData;
        
        // Log all errors for debugging
        if (!IS_PRODUCTION) {
          console.error('API Error:', {
            endpoint,
            method: options.method || 'GET',
            status: response.status,
            message: errorMessage,
            data: errorData,
          });
        }
        
        throw error;
      }

      return response.json();
    } catch (fetchError) {
      clearTimeout(timeoutId);
      
      // Handle timeout errors
      if (fetchError instanceof Error && fetchError.name === 'AbortError') {
        const timeoutError = new Error('Request timeout - The server took too long to respond') as Error & ApiError;
        timeoutError.status = 408;
        timeoutError.timeout = true;
        if (!IS_PRODUCTION) {
          console.error('API Request Timeout:', {
            endpoint,
            method: options.method || 'GET',
            timeout: API_TIMEOUT / 1000 + 's',
          });
        }
        throw timeoutError;
      }
      
      // Re-throw other errors (including validation errors)
      throw fetchError;
    }
  }

  async get<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  async post<T>(endpoint: string, data?: unknown, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: unknown, options?: RequestOptions): Promise<T> {
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
// baseURL will be lazily evaluated when first request is made
export const api = new ApiClient();

// Auth API
export const authApi = {
  register: (data: { name: string; email: string; password: string; password_confirmation: string; phone?: string }) =>
    api.post<AuthResponse>('/register', data),
  
  login: (data: { email: string; password: string }) =>
    api.post<AuthResponse>('/login', data),
  
  logout: () =>
    api.post<LogoutResponse>('/logout'),
  
  getUser: () =>
    api.get<User>('/user'),
};

// Listings API
export const listingsApi = {
  getAll: (params?: { category?: string; search?: string; page?: number }) => {
    const query = new URLSearchParams();
    if (params?.category) query.append('category', params.category);
    if (params?.search) query.append('search', params.search);
    if (params?.page) query.append('page', params.page.toString());
    return api.get<ListingResponse>(`/listings?${query.toString()}`);
  },
  
  getById: (id: number) =>
    api.get<Listing>(`/listings/${id}`),
  
  create: (data: { title: string; description: string; price: number; category: string; images?: string[] }) =>
    api.post<Listing>('/listings', data),
  
  update: (id: number, data: Partial<{ title: string; description: string; price: number; category: string; images: string[]; status: 'active' | 'inactive' }>) =>
    api.put<Listing>(`/listings/${id}`, data),
  
  delete: (id: number) =>
    api.delete<{ message: string }>(`/listings/${id}`),
};

// Orders API
export const ordersApi = {
  getAll: (params?: { page?: number }) => {
    const query = new URLSearchParams();
    if (params?.page) query.append('page', params.page.toString());
    return api.get<OrderResponse>(`/orders?${query.toString()}`);
  },
  
  getById: (id: number) =>
    api.get<Order>(`/orders/${id}`),
  
  create: (data: { listing_id: number; notes?: string }) =>
    api.post<Order>('/orders', data),
  
  update: (id: number, data: Partial<{ status: 'cancelled'; notes: string }>) =>
    api.put<Order>(`/orders/${id}`, data),
};

// Payments API
export const paymentsApi = {
  create: (data: { order_id: number }) =>
    api.post<PaymentCreateResponse>('/payments/create', data),
};

// Disputes API
export const disputesApi = {
  getAll: () =>
    api.get<DisputeResponse>('/disputes'),
  
  getById: (id: number) =>
    api.get<Dispute>(`/disputes/${id}`),
  
  create: (data: { order_id: number; reason: string; description: string }) =>
    api.post<Dispute>('/disputes', data),
  
  update: (id: number, data: { status: 'under_review' | 'resolved' | 'closed'; resolution_notes?: string; resolution?: 'refund_buyer' | 'release_to_seller' }) =>
    api.put<Dispute>(`/disputes/${id}`, data),
};

// Wallet API
export const walletApi = {
  get: () =>
    api.get<Wallet>('/wallet'),
  
  withdraw: (data: { amount: number; bank_account: string }) =>
    api.post<{ message: string; wallet: Wallet; note?: string }>('/wallet/withdraw', data),
};

// KYC API
export const kycApi = {
  get: () =>
    api.get<KycVerification | null>('/kyc'),
  
  create: () =>
    api.post<KycCreateResponse>('/kyc'),
};

// Public API
export const publicApi = {
  leaderboard: () =>
    api.get<LeaderboardResponse>('/leaderboard'),
  
  members: (params?: { page?: number }) => {
    const query = new URLSearchParams();
    if (params?.page) query.append('page', params.page.toString());
    return api.get<MemberResponse>(`/members?${query.toString()}`);
  },
  
  member: (id: number) =>
    api.get<User>(`/members/${id}`),
};

// Admin API
export const adminApi = {
  users: (params?: { page?: number }) => {
    const query = new URLSearchParams();
    if (params?.page) query.append('page', params.page.toString());
    return api.get<AdminUserResponse>(`/admin/users?${query.toString()}`);
  },
  
  updateUser: (id: number, data: Partial<{ role: 'user' | 'admin'; is_verified: boolean; name: string; email: string }>) =>
    api.put<User>(`/admin/users/${id}`, data),
  
  deleteUser: (id: number) =>
    api.delete<{ message: string }>(`/admin/users/${id}`),
  
  disputes: () =>
    api.get<AdminDisputeResponse>('/admin/disputes'),
  
  listings: () =>
    api.get<AdminListingResponse>('/admin/listings'),
  
  orders: () =>
    api.get<AdminOrderResponse>('/admin/orders'),
  
  kyc: () =>
    api.get<AdminKycResponse>('/admin/kyc'),
};

