# NXOLand Frontend

React + TypeScript + Vite frontend for NXOLand escrow marketplace.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```env
VITE_API_BASE_URL=https://backend-piz0.onrender.com
VITE_GTM_ID=GTM-THXQ6Q9V
```

3. Start development server:
```bash
npm run dev
```

## Features

- ✅ Authentication (Login/Register)
- ✅ Marketplace browsing
- ✅ Product details
- ✅ Checkout flow
- ✅ Order management with escrow countdown
- ✅ Wallet management
- ✅ KYC verification
- ✅ Dispute handling
- ✅ Google Tag Manager integration

## API Integration

All API calls are handled through `src/lib/api.ts`. See `INTEGRATION_GUIDE.md` for details.

## Tech Stack

- React 18
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui
- React Query
- React Router
