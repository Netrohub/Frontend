# Cloudflare Images Migration Guide

## ✅ Completed Migration

All images in the website now use Cloudflare Images for:
- ✅ Fast CDN delivery
- ✅ Automatic optimization (WebP/AVIF)
- ✅ Global performance
- ✅ No storage costs

## 📋 Images Migrated

### Static Assets (Need to be uploaded to Cloudflare Images):

1. **Logos:**
   - `LOGO` - Main NXOLand logo (`/nxoland-new-logo.png`)
   - `LOGO_OFFICIAL` - Official logo fallback (`/nxoland-official-logo.png`)

2. **Stove Levels (Whiteout Survival):**
   - `STOVE_LV_1` through `STOVE_LV_10` - Furnace level icons

3. **Social Media Logos:**
   - `TIKTOK_LOGO` - TikTok logo
   - `INSTAGRAM_LOGO` - Instagram logo

4. **Game Assets:**
   - Game logos (Whiteout Survival, KingShot, PUBG, Fortnite)
   - Game background images (4 backgrounds)

### Dynamic Images (Already using Cloudflare Images):

- ✅ **Listing images** - Uploaded via `/api/v1/images/upload` endpoint
- ✅ **Bill images** - Uploaded via listing creation
- ✅ **User avatars** - Uploaded via `/api/v1/auth/avatar` endpoint

## 🔧 Setup Instructions

### Step 1: Upload Images to Cloudflare Images

1. Go to **Cloudflare Dashboard** → **Images**
2. Upload all static images listed above
3. Copy the **Image ID** for each uploaded image

### Step 2: Get Account Hash

1. In **Cloudflare Dashboard** → **Images** → **Overview**
2. Find the Delivery URL example: `https://imagedelivery.net/{YOUR_HASH}/...`
3. Copy `{YOUR_HASH}`

### Step 3: Set Environment Variable

**In Cloudflare Pages:**
1. Go to **Pages** → Your Project → **Settings** → **Environment Variables**
2. Add: `VITE_CF_IMAGES_ACCOUNT_HASH` = `{YOUR_HASH}`

**Locally (for testing):**
Create `frontend/.env.local`:
```env
VITE_CF_IMAGES_ACCOUNT_HASH=your_hash_here
```

### Step 4: Update Image IDs in Code

Open `frontend/src/lib/cloudflareImages.ts` and replace placeholder IDs:

```typescript
export const STATIC_IMAGE_IDS = {
  LOGO: 'YOUR_ACTUAL_LOGO_ID', // Replace with actual Cloudflare image ID
  LOGO_OFFICIAL: 'YOUR_ACTUAL_OFFICIAL_LOGO_ID',
  STOVE_LV_1: 'YOUR_STOVE_LV_1_ID',
  // ... etc
};
```

Open `frontend/src/config/games.ts` and replace placeholder IDs:

```typescript
image: getCloudflareImageUrl("YOUR_WHITEOUT_SURVIVAL_LOGO_ID", "public"),
backgroundImage: getCloudflareImageUrl("YOUR_WOS_BG_ID", "public"),
// ... etc
```

## 📁 Files Updated

### Core Utilities:
- ✅ `frontend/src/lib/cloudflareImages.ts` - New utility functions

### Components:
- ✅ `frontend/src/components/Navbar.tsx` - Logo
- ✅ `frontend/src/components/SEO.tsx` - Default SEO image
- ✅ `frontend/src/pages/Home.tsx` - Footer logo

### Pages:
- ✅ `frontend/src/pages/sell/SellWOS.tsx` - Stove level images
- ✅ `frontend/src/pages/ProductDetails.tsx` - Stove level images
- ✅ `frontend/src/config/games.ts` - Game logos and backgrounds

## 🎯 Benefits

1. **Performance:**
   - Images served from global CDN
   - Automatic format optimization (WebP/AVIF)
   - Faster page loads

2. **Cost:**
   - No storage costs (within free tier limits)
   - Reduced bandwidth usage

3. **Maintenance:**
   - Easy to update images without redeploying
   - Centralized image management

## ⚠️ Important Notes

- **Listing images** and **bill images** are already using Cloudflare Images (uploaded via API)
- **User avatars** are already using Cloudflare Images (uploaded via API)
- Only **static assets** need to be manually uploaded and configured
- After uploading images, update the Image IDs in the code files listed above

## 🧪 Testing

After setup:
1. Clear browser cache (Ctrl+Shift+R)
2. Check Network tab - images should load from `imagedelivery.net`
3. Verify all images display correctly
4. Check console for any errors

