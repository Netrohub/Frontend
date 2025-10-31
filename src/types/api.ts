/**
 * TypeScript types for API responses
 * Ensures type safety across the application
 */

// User types
export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  role: 'user' | 'admin';
  is_verified: boolean;
  avatar?: string;
  bio?: string;
  email_verified_at?: string;
  created_at: string;
  updated_at: string;
  wallet?: Wallet;
  kyc_verification?: KycVerification;
}

export interface Wallet {
  id: number;
  user_id: number;
  available_balance: number;
  on_hold_balance: number;
  withdrawn_total: number;
  created_at: string;
  updated_at: string;
}

export interface KycVerification {
  id: number;
  user_id: number;
  status: 'pending' | 'verified' | 'failed' | 'expired';
  persona_inquiry_id?: string;
  verified_at?: string;
  created_at: string;
  updated_at: string;
}

// Auth API responses
export interface AuthResponse {
  user: User;
  token: string;
}

export interface LogoutResponse {
  message: string;
}

// Listing types
export interface Listing {
  id: number;
  user_id: number;
  title: string;
  description: string;
  price: number;
  category: string;
  images: string[];
  status: 'active' | 'inactive';
  views: number;
  created_at: string;
  updated_at: string;
  user?: User;
}

export interface ListingResponse {
  data: Listing[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

// Order types
export interface Order {
  id: number;
  listing_id: number;
  buyer_id: number;
  seller_id: number;
  amount: number;
  status: 'pending' | 'escrow_hold' | 'disputed' | 'completed' | 'cancelled';
  notes?: string;
  tap_charge_id?: string;
  paid_at?: string;
  escrow_hold_at?: string;
  escrow_release_at?: string;
  completed_at?: string;
  created_at: string;
  updated_at: string;
  listing?: Listing;
  buyer?: User;
  seller?: User;
  dispute?: Dispute;
  payment?: Payment;
}

export interface OrderResponse {
  data: Order[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

// Payment types
export interface Payment {
  id: number;
  order_id: number;
  tap_charge_id: string;
  tap_reference?: string;
  status: 'initiated' | 'authorized' | 'captured' | 'failed' | 'cancelled';
  amount: number;
  currency: string;
  captured_at?: string;
  tap_response?: any;
  webhook_payload?: any;
  created_at: string;
  updated_at: string;
}

export interface PaymentCreateResponse {
  payment: Payment;
  redirect_url?: string;
}

// Dispute types
export interface Dispute {
  id: number;
  order_id: number;
  initiated_by: number;
  resolved_by?: number;
  party: 'buyer' | 'seller';
  reason: string;
  description: string;
  status: 'open' | 'under_review' | 'resolved' | 'closed';
  resolution_notes?: string;
  resolved_at?: string;
  created_at: string;
  updated_at: string;
  order?: Order;
  initiator?: User;
  resolver?: User;
}

export interface DisputeResponse {
  data: Dispute[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

// Pagination types
export interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from?: number;
  to?: number;
}

// Error types
export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
  error?: string;
  status?: number;
}

// Admin types
export interface AdminUserResponse extends PaginatedResponse<User> {}
export interface AdminDisputeResponse extends PaginatedResponse<Dispute> {}
export interface AdminListingResponse extends PaginatedResponse<Listing> {}
export interface AdminOrderResponse extends PaginatedResponse<Order> {}
export interface AdminKycResponse extends PaginatedResponse<KycVerification> {}

// Public API types
export interface LeaderboardEntry {
  user_id: number;
  user_name: string;
  total_sales: number;
  total_purchases: number;
  rating?: number;
  user?: User;
}

export interface LeaderboardResponse {
  data: LeaderboardEntry[];
}

export interface MemberResponse extends PaginatedResponse<User> {}

