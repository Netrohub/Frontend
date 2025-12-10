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
  KycStatusResponse,
  PaginatedResponse,
  LeaderboardResponse,
  MemberResponse,
  AdminUserResponse,
  AdminDisputeResponse,
  AdminListingResponse,
  AdminOrderResponse,
  AdminKycResponse,
  ApiError,
} from "@/types/api";
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
    
    // Check if body is FormData - if so, don't set Content-Type (browser will set it with boundary)
    const isFormData = options.body instanceof FormData;
    
    const headers: HeadersInit = {
      ...(!isFormData && { 'Content-Type': 'application/json' }),
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

        // Handle rate limiting (429 Too Many Requests)
        if (response.status === 429) {
          const retryAfter = response.headers.get('Retry-After');
          const errorMessage = errorData.message || 'Too Many Attempts.';
          const error = new Error(errorMessage) as Error & ApiError;
          error.status = response.status;
          error.data = { ...errorData, retryAfter: retryAfter ? parseInt(retryAfter) : null };
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
    // Check if data is FormData - if so, send it directly without JSON.stringify
    const body = data instanceof FormData ? data : (data ? JSON.stringify(data) : undefined);
    
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body,
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

  requestPasswordReset: (email: string) =>
    api.post<{ message: string }>('/password/forgot', { email }),

  resetPassword: (data: { email: string; password: string; password_confirmation: string; token: string }) =>
    api.post<{ message: string }>('/password/reset', data),
  
  logout: () =>
    api.post<LogoutResponse>('/logout'),
  
  getUser: () =>
    api.get<User>('/user'),
  
  // Resend email verification
  resendVerificationEmail: () =>
    api.post<{ message: string }>('/email/resend'),
  
  getUserStats: () =>
    api.get<{
      total_sales: number;
      total_purchases: number;
      total_revenue: number;
      active_listings: number;
      total_listings: number;
      member_since: string;
      average_rating?: number;
      total_reviews?: number;
    }>('/user/stats'),
  
  getUserActivity: () =>
    api.get<any[]>('/user/activity'),
  
  updateProfile: (data: { name?: string; email?: string; phone?: string }) =>
    api.put<User>('/user/profile', data),
  
  updateAvatar: async (file: File) => {
    const formData = new FormData();
    formData.append('avatar', file);
    // Don't set Content-Type - browser will set it automatically with boundary
    return api.post<{ user: User; avatar_url: string }>('/user/avatar', formData);
  },
  
  updatePassword: (data: { current_password: string; password: string; password_confirmation: string }) =>
    api.put<{ message: string }>('/user/password', data),

  // Discord OAuth
  discordLogin: () => {
    const baseUrl = getAPIBaseURL();
    window.location.href = `${baseUrl}/auth/discord/redirect?mode=login&redirect_to=${encodeURIComponent(window.location.pathname)}`;
  },

  discordConnect: () => {
    const baseUrl = getAPIBaseURL();
    // Get token from localStorage directly (since api instance might not be accessible here)
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    // For connect mode, pass token as query parameter since browser redirects don't send headers
    const tokenParam = token ? `&token=${encodeURIComponent(token)}` : '';
    window.location.href = `${baseUrl}/auth/discord/redirect?mode=connect&redirect_to=${encodeURIComponent(window.location.pathname)}${tokenParam}`;
  },
};

// KYC API
export const kycApi = {
  complete: (payload: { inquiryId: string; status: string; userId: number | string }) =>
    api.post('/kyc/complete', payload),
  status: () => api.get<KycStatusResponse>('/kyc/status'),
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
  
  // Get current user's listings only (SECURITY: data isolation)
  getMyListings: (params?: { status?: string; search?: string; page?: number }) => {
    const query = new URLSearchParams();
    if (params?.status) query.append('status', params.status);
    if (params?.search) query.append('search', params.search);
    if (params?.page) query.append('page', params.page.toString());
    return api.get<ListingResponse>(`/my-listings?${query.toString()}`);
  },
  
  getById: (id: number) =>
    api.get<Listing>(`/listings/${id}`),
  
  create: (data: { 
    title: string; 
    description: string; 
    price: number; 
    category: string; 
    images?: string[];
    account_email?: string;
    account_password?: string;
    account_metadata?: any;
  }) =>
    api.post<Listing>('/listings', data),
  
  update: (id: number, data: Partial<{ 
    title: string; 
    description: string; 
    price: number; 
    category: string; 
    images: string[]; 
    status: 'active' | 'inactive' | 'sold';
    account_email?: string;
    account_password?: string;
    account_metadata?: any;
  }>) =>
    api.put<Listing>(`/listings/${id}`, data),
  
  delete: (id: number) =>
    api.delete<{ message: string }>(`/listings/${id}`),
  
  // Get account credentials (only for owner, buyer after purchase, or admin)
  getCredentials: (id: number) =>
    api.get<{
      listing_id: number;
      account_email: string;
      account_password: string;
      account_metadata: any;
      bill_images_unlocked: boolean;
    }>(`/listings/${id}/credentials`),
};

export const imagesApi = {
  upload: async (files: File[]): Promise<string[]> => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('images[]', file);
    });

    const baseURL = getAPIBaseURL();
    const token = localStorage.getItem('auth_token');
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT * 5); // Longer timeout for Cloudflare uploads

    try {
      const response = await fetch(`${baseURL}/images/upload`, {
        method: 'POST',
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
          'Accept': 'application/json',
          // Don't set Content-Type header - browser will set it with boundary for FormData
        },
        credentials: 'include',
        body: formData,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: response.statusText }));
        const errorMessage = errorData.message || errorData.error || response.statusText || 'Failed to upload images';
        const errorCode = errorData.error_code || null;
        
        // Create more descriptive error
        const error = new Error(errorMessage);
        (error as any).status = response.status;
        (error as any).errorCode = errorCode;
        (error as any).errorData = errorData;
        throw error;
      }

      const data = await response.json();
      // Returns { urls: [...], images: [...full data...], count: N }
      return data.urls || [];
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Request timeout - upload may still be processing');
      }
      throw error;
    }
  },

  delete: (id: number) =>
    api.delete<{ message: string; deleted: boolean }>(`/images/${id}`),

  getAll: () =>
    api.get<any>('/images'),
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
  
  // Confirm order receipt (buyer only)
  confirm: (id: number) =>
    api.post<{ message: string; order: Order }>(`/orders/${id}/confirm`),
  
  // Cancel order (buyer or seller, with refund if in escrow)
  cancel: (id: number) =>
    api.post<{ message: string; order: Order }>(`/orders/${id}/cancel`),
};

// Payments API
export const paymentsApi = {
  create: (data: { order_id: number }) =>
    api.post<PaymentCreateResponse>('/payments/create', data),
  prepareHyperPayCheckout: (data: { order_id: number; payment_method?: 'MADA' | 'VISA' | 'MASTERCARD'; browserData?: any }) =>
    api.post<{ payment: any; checkoutId: string; widgetScriptUrl: string; integrity?: string }>('/payments/hyperpay/prepare', data),
  getHyperPayStatus: (data: { resourcePath: string; order_id: number }) =>
    api.post<{ status: string; resultCode?: string; resultDescription?: string; isMadaCard?: boolean; response: any }>('/payments/hyperpay/status', data),
};

// Disputes API
export const disputesApi = {
  getAll: (params?: { page?: number; status?: string }) => {
    const query = new URLSearchParams();
    if (params?.page) query.append('page', params.page.toString());
    if (params?.status) query.append('status', params.status);
    return api.get<DisputeResponse>(`/disputes?${query.toString()}`);
  },
  
  getById: (id: number) =>
    api.get<Dispute>(`/disputes/${id}`),
  
  create: (data: { order_id: number; reason: string; description: string }) =>
    api.post<Dispute>('/disputes', data),
  
  cancel: (id: number) =>
    api.post<{ message: string; dispute: Dispute }>(`/disputes/${id}/cancel`),
  
  update: (id: number, data: { status: 'under_review' | 'resolved' | 'closed'; resolution_notes?: string; resolution?: 'refund_buyer' | 'release_to_seller' }) =>
    api.put<Dispute>(`/disputes/${id}`, data),
};

// Wallet API
export const walletApi = {
  get: () =>
    api.get<Wallet>('/wallet'),
  
  getWithdrawals: () =>
    api.get<any[]>('/wallet/withdrawals'),
  
  getFeeInfo: () =>
    api.get<{ fee_percentage: number; min_withdrawal: number; max_withdrawal: number }>('/wallet/fee-info'),
  
  withdraw: (data: { amount: number; iban: string; bank_name: string; account_holder_name: string }) =>
    api.post<{ 
      message: string; 
      wallet: Wallet; 
      withdrawal_request?: any; 
      note?: string;
      fee_info?: {
        requested_amount: number;
        fee_percentage: number;
        fee_amount: number;
        net_amount: number;
      };
    }>('/wallet/withdraw', data),
};

// KYC API
// Public API
export const publicApi = {
  leaderboard: () =>
    api.get<LeaderboardResponse>('/leaderboard'),
  
  members: (params?: { page?: number; per_page?: number }) => {
    const query = new URLSearchParams();
    if (params?.page) query.append('page', params.page.toString());
    if (params?.per_page) query.append('per_page', params.per_page.toString());
    return api.get<MemberResponse>(`/members?${query.toString()}`);
  },
  
  member: (id: number) =>
    api.get<User>(`/members/${id}`),
  
  checkMaintenance: () =>
    api.get<{ maintenance_mode: boolean }>('/public/maintenance-status'),
};

// Notifications API
export const notificationsApi = {
  getAll: (params?: { page?: number; filter?: string; type?: string }) => {
    const query = new URLSearchParams();
    if (params?.page) query.append('page', params.page.toString());
    if (params?.filter) query.append('filter', params.filter);
    if (params?.type) query.append('type', params.type);
    return api.get<any>(`/notifications?${query.toString()}`);
  },
  
  getUnreadCount: () =>
    api.get<{ count: number }>('/notifications/unread-count'),
  
  markAsRead: (id: number) =>
    api.post<{ message: string }>(`/notifications/${id}/read`),
  
  markAllAsRead: () =>
    api.post<{ message: string }>('/notifications/mark-all-read'),
  
  delete: (id: number) =>
    api.delete<{ message: string }>(`/notifications/${id}`),
  
  deleteAllRead: () =>
    api.delete<{ message: string }>('/notifications/read/all'),
};

// Settings API
export const settingsApi = {
  get: (key: string) =>
    api.get<any>(`/settings/${key}`),
  
  getAll: () =>
    api.get<any>('/admin/settings'),
  
  update: (key: string, value: any) =>
    api.put<{ message: string }>(`/admin/settings/${key}`, { value }),
  
  bulkUpdate: (settings: Array<{ key: string; value: any }>) =>
    api.post<{ message: string }>('/admin/settings/bulk', { settings }),
  
  create: (data: { key: string; value: any; type: string; group: string; description?: string }) =>
    api.post<{ message: string }>('/admin/settings', data),
  
  delete: (key: string) =>
    api.delete<{ message: string }>(`/admin/settings/${key}`),
};

// Reviews API
export const reviewsApi = {
  getBySeller: (sellerId: number, params?: { rating?: string; sort?: string; page?: number }) => {
    const query = new URLSearchParams();
    if (params?.rating) query.append('rating', params.rating);
    if (params?.sort) query.append('sort', params.sort);
    if (params?.page) query.append('page', params.page.toString());
    return api.get<any>(`/reviews/seller/${sellerId}?${query.toString()}`);
  },

  getSellerStats: (sellerId: number) =>
    api.get<{
      average_rating: number;
      total_reviews: number;
      rating_distribution: { [key: number]: number };
    }>(`/reviews/seller/${sellerId}/stats`),

  create: (data: { order_id: number; seller_id: number; rating: number; comment: string }) =>
    api.post<any>('/reviews', data),

  update: (id: number, data: { rating: number; comment: string }) =>
    api.put<any>(`/reviews/${id}`, data),

  delete: (id: number) =>
    api.delete<{ message: string }>(`/reviews/${id}`),

  markHelpful: (id: number) =>
    api.post<{ helpful_count: number; user_found_helpful: boolean }>(`/reviews/${id}/helpful`),

  report: (id: number, reason: string) =>
    api.post<{ message: string }>(`/reviews/${id}/report`, { reason }),
};

// Admin API
export const adminApi = {
  // Dashboard
  getStats: () =>
    api.get<any>('/admin/stats'),
  
  getActivity: () =>
    api.get<any>('/admin/activity'),
  
  // Users
  users: (params?: { page?: number; search?: string }) => {
    const query = new URLSearchParams();
    if (params?.page) query.append('page', params.page.toString());
    if (params?.search) query.append('search', params.search);
    return api.get<AdminUserResponse>(`/admin/users?${query.toString()}`);
  },

  kyc: (params?: { page?: number; search?: string }) => {
    const query = new URLSearchParams();
    if (params?.page) query.append('page', params.page.toString());
    if (params?.search) query.append('search', params.search);
    return api.get<AdminKycResponse>(`/admin/kyc?${query.toString()}`);
  },
  
  updateUser: (id: number, data: Partial<{ role: 'user' | 'admin'; is_verified: boolean; name: string; email: string }>) =>
    api.put<User>(`/admin/users/${id}`, data),
  
  deleteUser: (id: number) =>
    api.delete<{ message: string }>(`/admin/users/${id}`),
  
  // Listings
  listings: (params?: { page?: number; search?: string }) => {
    const query = new URLSearchParams();
    if (params?.page) query.append('page', params.page.toString());
    if (params?.search) query.append('search', params.search);
    return api.get<AdminListingResponse>(`/admin/listings?${query.toString()}`);
  },
  
  updateListingStatus: (id: number, status: 'active' | 'inactive' | 'sold') =>
    api.put<{ message: string; listing: any }>(`/admin/listings/${id}/status`, { status }),
  
  deleteListing: (id: number, deleteOrders: boolean = false) => {
    // For DELETE requests, we need to send data as query params or use a different approach
    // Laravel accepts JSON in DELETE body, but axios/fetch might not always support it
    // Using query params is more reliable
    const url = `/admin/listings/${id}${deleteOrders ? '?delete_orders=true' : ''}`;
    return api.delete<{ message: string; orders_deleted: number; orders_remaining: number }>(url);
  },
  
  // Orders
  orders: (params?: { page?: number; search?: string }) => {
    const query = new URLSearchParams();
    if (params?.page) query.append('page', params.page.toString());
    if (params?.search) query.append('search', params.search);
    return api.get<AdminOrderResponse>(`/admin/orders?${query.toString()}`);
  },
  
  cancelOrder: (id: number, reason: string) =>
    api.post<{ message: string; order: any }>(`/admin/orders/${id}/cancel`, { reason }),
  
  // Disputes
  disputes: (params?: { page?: number }) => {
    const query = new URLSearchParams();
    if (params?.page) query.append('page', params.page.toString());
    return api.get<AdminDisputeResponse>(`/admin/disputes?${query.toString()}`);
  },
  
  // Financial
  financial: () =>
    api.get<{
      stats: {
        total_revenue: number;
        revenue_growth: number;
        total_commissions: number;
        commissions_growth: number;
        pending_payments: number;
        total_withdrawals: number;
        withdrawals_growth: number;
      };
      transactions: Array<{
        id: string;
        type: 'order' | 'withdrawal';
        amount: number;
        order_id?: number;
        order_number?: string;
        buyer?: string;
        seller?: string;
        listing_title?: string;
        user?: string;
        status: string;
        date: string;
      }>;
    }>('/admin/financial'),
  
  // Reviews
  reviews: (params?: { page?: number; search?: string; status?: string; rating?: string }) => {
    const query = new URLSearchParams();
    if (params?.page) query.append('page', params.page.toString());
    if (params?.search) query.append('search', params.search);
    if (params?.status) query.append('status', params.status);
    if (params?.rating) query.append('rating', params.rating);
    return api.get<any>(`/admin/reviews?${query.toString()}`);
  },
  
  // Suggestions
  updateSuggestion: (id: number, status: 'pending' | 'implemented') =>
    api.put<any>(`/admin/suggestions/${id}`, { status }),
  
  deleteSuggestion: (id: number) =>
    api.delete<{ message: string }>(`/admin/suggestions/${id}`),
  
  // Notifications
  createNotification: (data: { 
    user_id?: number; 
    broadcast?: boolean; 
    target_role?: 'all' | 'buyer' | 'seller';
    type: string; 
    title: string; 
    message: string; 
    icon?: string; 
    color?: string;
  }) =>
    api.post<{ message: string; users_count?: number }>('/admin/notifications', data),
  
  getNotificationHistory: () =>
    api.get<any[]>('/admin/notifications/history'),
  
  // Withdrawals (manual approval)
  withdrawals: (params?: { page?: number; status?: string; search?: string; from_date?: string; to_date?: string }) => {
    const query = new URLSearchParams();
    if (params?.page) query.append('page', params.page.toString());
    if (params?.status) query.append('status', params.status);
    if (params?.search) query.append('search', params.search);
    if (params?.from_date) query.append('from_date', params.from_date);
    if (params?.to_date) query.append('to_date', params.to_date);
    return api.get<any>(`/admin/withdrawals?${query.toString()}`);
  },
  
  approveWithdrawal: (id: number) =>
    api.post<{ message: string; withdrawal_request: any }>(`/admin/withdrawals/${id}/approve`),
  
  rejectWithdrawal: (id: number, reason: string) =>
    api.post<{ message: string; withdrawal_request: any }>(`/admin/withdrawals/${id}/reject`, { reason }),
};

// Suggestions API
export const suggestionsApi = {
  getAll: (params?: { status?: string; page?: number }) => {
    const query = new URLSearchParams();
    if (params?.status && params.status !== 'all') query.append('status', params.status);
    if (params?.page) query.append('page', params.page.toString());
    return api.get<any>(`/suggestions?${query.toString()}`);
  },
  
  create: (data: { title: string; description: string }) =>
    api.post<any>('/suggestions', data),
  
  vote: (id: number, voteType: 'up' | 'down') =>
    api.post<any>(`/suggestions/${id}/vote`, { vote_type: voteType }),
  
  // Platform Reviews
  getPlatformStats: () =>
    api.get<{
      average_rating: number;
      total_reviews: number;
      rating_distribution: Record<string, number>;
    }>('/platform/stats'),
  
  submitPlatformReview: (data: { rating: number; review?: string }) =>
    api.post<any>('/platform/review', data),
  
  getUserPlatformReview: () =>
    api.get<{ rating: number; review: string } | null>('/platform/review/user'),
};

// Site Settings API (Terms & Privacy)
export const siteSettingsApi = {
  get: (key: string) =>
    api.get<{ data: { key: string; value_ar: string; value_en: string; type: string; updated_at: string } }>(`/site-settings/${key}`),
  
  // Admin only
  getAll: () =>
    api.get<{ data: Array<{ key: string; value_ar: string; value_en: string; type: string }> }>('/admin/site-settings'),
  
  update: (key: string, data: { value_ar?: string; value_en?: string }) =>
    api.put<any>(`/admin/site-settings/${key}`, data),
};

// Auctions API
export const auctionsApi = {
  list: (params?: { status?: string; page?: number }) => {
    const query = new URLSearchParams();
    if (params?.status) query.append('status', params.status);
    if (params?.page) query.append('page', params.page.toString());
    return api.get<{ data: any[]; meta: any }>(`/auctions?${query.toString()}`);
  },
  
  get: (id: number) =>
    api.get<any>(`/auctions/${id}`),
  
  create: (listingId: number) =>
    api.post<any>('/auctions', { listing_id: listingId }),
  
  getBids: (id: number, params?: { page?: number }) => {
    const query = new URLSearchParams();
    if (params?.page) query.append('page', params.page.toString());
    return api.get<{ data: any[]; meta: any }>(`/auctions/${id}/bids?${query.toString()}`);
  },
  
  placeBid: (id: number, amount: number, depositAmount: number) =>
    api.post<{ bid: any; auction: any }>(`/auctions/${id}/bid`, {
      amount,
      deposit_amount: depositAmount,
    }),
  
  // Admin methods
  approve: (id: number, data: { 
    starting_bid: number; 
    starts_at?: string; 
    ends_at: string; 
    admin_notes?: string; 
    is_maxed_account?: boolean;
  }) =>
    api.post<any>(`/admin/auctions/${id}/approve`, data),
  
  endAuction: (id: number) =>
    api.post<any>(`/admin/auctions/${id}/end`),
  
  refundDeposits: (id: number) =>
    api.post<any>(`/admin/auctions/${id}/refund-deposits`),
  
  update: (id: number, data: {
    title?: string;
    description?: string;
    starting_bid?: number;
    current_bid?: number;
    starts_at?: string;
    ends_at?: string;
    admin_notes?: string;
    is_maxed_account?: boolean;
    status?: string;
  }) =>
    api.put<any>(`/admin/auctions/${id}`, data),
  
  reject: (id: number, rejection_reason?: string) =>
    api.post<any>(`/admin/auctions/${id}/reject`, { rejection_reason }),
  
  pause: (id: number, pause_reason?: string) =>
    api.post<any>(`/admin/auctions/${id}/pause`, { pause_reason }),
  
  resume: (id: number) =>
    api.post<any>(`/admin/auctions/${id}/resume`),
  
  stop: (id: number, stop_reason?: string) =>
    api.post<any>(`/admin/auctions/${id}/stop`, { stop_reason }),
};

