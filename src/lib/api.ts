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
import { API_BASE_URL } from '@/config/env';
import { API_TIMEOUT } from '@/config/constants';
import { IS_PRODUCTION } from '@/config/env';

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
export const api = new ApiClient(API_BASE_URL);

// Auth API
export const authApi = {
  register: (data: { name: string; email: string; password: string; password_confirmation: string; phone?: string }) =>
    api.post<AuthResponse>('/v1/register', data),
  
  login: (data: { email: string; password: string }) =>
    api.post<AuthResponse>('/v1/login', data),
  
  logout: () =>
    api.post<LogoutResponse>('/v1/logout'),
  
  getUser: () =>
    api.get<User>('/v1/user'),
};

// Listings API
export const listingsApi = {
  getAll: (params?: { category?: string; search?: string; page?: number }) => {
    const query = new URLSearchParams();
    if (params?.category) query.append('category', params.category);
    if (params?.search) query.append('search', params.search);
    if (params?.page) query.append('page', params.page.toString());
    return api.get<ListingResponse>(`/v1/listings?${query.toString()}`);
  },
  
  getById: (id: number) =>
    api.get<Listing>(`/v1/listings/${id}`),
  
  create: (data: { title: string; description: string; price: number; category: string; images?: string[] }) =>
    api.post<Listing>('/v1/listings', data),
  
  update: (id: number, data: Partial<{ title: string; description: string; price: number; category: string; images: string[]; status: 'active' | 'inactive' }>) =>
    api.put<Listing>(`/v1/listings/${id}`, data),
  
  delete: (id: number) =>
    api.delete<{ message: string }>(`/v1/listings/${id}`),
};

// Orders API
export const ordersApi = {
  getAll: (params?: { page?: number }) => {
    const query = new URLSearchParams();
    if (params?.page) query.append('page', params.page.toString());
    return api.get<OrderResponse>(`/v1/orders?${query.toString()}`);
  },
  
  getById: (id: number) =>
    api.get<Order>(`/v1/orders/${id}`),
  
  create: (data: { listing_id: number; notes?: string }) =>
    api.post<Order>('/v1/orders', data),
  
  update: (id: number, data: Partial<{ status: 'cancelled'; notes: string }>) =>
    api.put<Order>(`/v1/orders/${id}`, data),
};

// Payments API
export const paymentsApi = {
  create: (data: { order_id: number }) =>
    api.post<PaymentCreateResponse>('/v1/payments/create', data),
};

// Disputes API
export const disputesApi = {
  getAll: () =>
    api.get<DisputeResponse>('/v1/disputes'),
  
  getById: (id: number) =>
    api.get<Dispute>(`/v1/disputes/${id}`),
  
  create: (data: { order_id: number; reason: string; description: string }) =>
    api.post<Dispute>('/v1/disputes', data),
  
  update: (id: number, data: { status: 'under_review' | 'resolved' | 'closed'; resolution_notes?: string; resolution?: 'refund_buyer' | 'release_to_seller' }) =>
    api.put<Dispute>(`/v1/disputes/${id}`, data),
};

// Wallet API
export const walletApi = {
  get: () =>
    api.get<Wallet>('/v1/wallet'),
  
  withdraw: (data: { amount: number; bank_account: string }) =>
    api.post<{ message: string; wallet: Wallet; note?: string }>('/v1/wallet/withdraw', data),
};

// KYC API
export const kycApi = {
  get: () =>
    api.get<KycVerification | null>('/v1/kyc'),
  
  create: () =>
    api.post<KycVerification>('/v1/kyc'),
};

// Public API
export const publicApi = {
  leaderboard: () =>
    api.get<LeaderboardResponse>('/v1/leaderboard'),
  
  members: (params?: { page?: number }) => {
    const query = new URLSearchParams();
    if (params?.page) query.append('page', params.page.toString());
    return api.get<MemberResponse>(`/v1/members?${query.toString()}`);
  },
  
  member: (id: number) =>
    api.get<User>(`/v1/members/${id}`),
};

// Admin API
export const adminApi = {
  users: (params?: { page?: number }) => {
    const query = new URLSearchParams();
    if (params?.page) query.append('page', params.page.toString());
    return api.get<AdminUserResponse>(`/v1/admin/users?${query.toString()}`);
  },
  
  updateUser: (id: number, data: Partial<{ role: 'user' | 'admin'; is_verified: boolean; name: string; email: string }>) =>
    api.put<User>(`/v1/admin/users/${id}`, data),
  
  deleteUser: (id: number) =>
    api.delete<{ message: string }>(`/v1/admin/users/${id}`),
  
  disputes: () =>
    api.get<AdminDisputeResponse>('/v1/admin/disputes'),
  
  listings: () =>
    api.get<AdminListingResponse>('/v1/admin/listings'),
  
  orders: () =>
    api.get<AdminOrderResponse>('/v1/admin/orders'),
  
  kyc: () =>
    api.get<AdminKycResponse>('/v1/admin/kyc'),
};

