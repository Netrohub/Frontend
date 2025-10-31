# Frontend-Backend Integration Guide

## Overview

The NXOLand frontend has been successfully connected to the Laravel backend API. This document outlines the integration details and how to use the API.

## Environment Variables

Create a `.env` file in the `frontend/` directory with:

```env
VITE_API_BASE_URL=https://api.nxoland.com
VITE_GTM_ID=GTM-THXQ6Q9V
```

## API Client

The API client is located at `src/lib/api.ts` and provides:
- Automatic token management
- Request/response handling
- Error handling
- Type-safe API methods

## Authentication

Authentication is handled through `AuthContext` (`src/contexts/AuthContext.tsx`):
- Automatically loads token from localStorage on app start
- Provides `login`, `register`, `logout`, and `user` methods
- Token is automatically attached to all API requests

## Connected Pages

### ✅ Completed Integrations

1. **Auth Page** (`/auth`)
   - Login: `POST /api/login`
   - Register: `POST /api/register`
   - Logout: `POST /api/logout`

2. **Marketplace** (`/marketplace`)
   - Listings: `GET /api/listings`
   - Search and filter support

3. **Product Details** (`/product/:id`)
   - Details: `GET /api/listings/:id`
   - Create order: `POST /api/orders`

4. **Checkout** (`/checkout`)
   - Create payment: `POST /api/payments/create`
   - Redirects to Tap Payments

5. **Order** (`/order/:id`)
   - Order details: `GET /api/orders/:id`
   - Real-time escrow countdown
   - Confirm order: `PUT /api/orders/:id`

6. **Wallet** (`/wallet`)
   - Balance: `GET /api/wallet`
   - Withdraw: `POST /api/wallet/withdraw`

7. **KYC** (`/kyc`)
   - Status: `GET /api/kyc`
   - Initiate: `POST /api/kyc`
   - Persona integration

8. **Disputes** (`/disputes`)
   - List: `GET /api/disputes`
   - Create: `POST /api/disputes`

### 🔄 Pending Integrations

1. **Sell Page** (`/sell`)
   - Create listing: `POST /api/listings`
   - Image upload support needed

2. **My Listings** (`/my-listings`)
   - User's listings: Filter by `user_id`

3. **Admin Pages** (`/admin/*`)
   - Admin endpoints ready but pages need connection

4. **Leaderboard** (`/leaderboard`)
   - `GET /api/leaderboard`

5. **Members** (`/members`)
   - `GET /api/members`

## Google Tag Manager

GTM has been added to `index.html` and will automatically track:
- Page views
- User interactions
- Custom events (configure in GTM dashboard)

## Testing the Integration

1. **Start the frontend:**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

2. **Ensure backend is running:**
   - Backend should be accessible at `https://api.nxoland.com`
   - CORS is configured for `nxoland.com`

3. **Test flow:**
   - Register/Login → Create listing → View marketplace → Purchase → Checkout → Order page

## API Response Formats

### Authentication
```typescript
{
  user: {
    id: number;
    name: string;
    email: string;
    // ... other fields
  };
  token: string;
}
```

### Listings
```typescript
{
  data: Listing[];
  current_page: number;
  last_page: number;
  // ... pagination
}
```

### Orders
```typescript
{
  id: number;
  listing_id: number;
  buyer_id: number;
  seller_id: number;
  amount: number;
  status: 'pending' | 'escrow_hold' | 'completed' | 'disputed' | 'cancelled';
  escrow_release_at: string | null;
  // ... other fields
}
```

## Error Handling

All API errors are handled consistently:
- Network errors show generic error message
- Validation errors show field-specific messages
- 401 errors automatically log out user
- 403 errors show unauthorized message

## Token Management

- Tokens are stored in `localStorage` as `auth_token`
- Automatically attached to requests via `Authorization: Bearer <token>` header
- Token is cleared on logout or 401 response

## Next Steps

1. Complete Sell page integration with image upload
2. Connect remaining pages (My Listings, Leaderboard, Members)
3. Add admin page integrations
4. Implement real-time updates (WebSockets optional)
5. Add error boundaries for better error handling
6. Implement offline support (optional)

