# Cloudflare Pages Development Mode Guide

## Overview
There are several ways to enable "development mode" functionality in Cloudflare Pages. This guide covers all options.

## Option 1: Cloudflare Dashboard Development Mode (Bypass Cache)

**Purpose**: Temporarily bypass Cloudflare's cache to see latest changes immediately.

### Steps:
1. Log into [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Go to **Pages** → Select your project (`nxoland-frontend` or similar)
3. Click on your **production deployment**
4. Find **"Development Mode"** toggle in the right sidebar
5. Turn it **ON** (you'll see a yellow banner)
6. Development Mode lasts for **3 hours** (can be extended)

**Note**: This only bypasses cache, it doesn't change `NODE_ENV` or enable debug panels.

---

## Option 2: Environment Variables (Recommended for Debug Panels)

**Purpose**: Set `NODE_ENV=development` to enable debug panels and development features.

### Steps:

1. **In Cloudflare Dashboard**:
   - Go to **Pages** → Your project → **Settings** → **Environment Variables**
   - Add new variable:
     - **Variable name**: `NODE_ENV`
     - **Value**: `development`
     - **Environment**: Select which environments (Production, Preview, or both)
   - Click **Save**

2. **For Preview Deployments** (recommended):
   - Add `NODE_ENV=development` to **Preview** environment only
   - This way production stays optimized, but previews show debug info

3. **Redeploy**:
   - Either push a new commit, or
   - Go to **Deployments** → Find your deployment → Click **Retry deployment**

### Important Notes:
- Setting `NODE_ENV=development` in Cloudflare will make Vite build in development mode
- This increases bundle size and disables optimizations
- **Only use for debugging**, not for production

---

## Option 3: Preview Deployments (Best Practice)

**Purpose**: Each pull request gets its own preview URL with separate environment variables.

### Steps:

1. **Enable Preview Deployments** (if not already):
   - Cloudflare Pages automatically creates previews for PRs
   - Go to **Settings** → **Builds & deployments**
   - Ensure "Preview deployments" is enabled

2. **Set Environment Variables for Previews**:
   - Go to **Settings** → **Environment Variables**
   - Add `NODE_ENV=development` to **Preview** environment
   - Production environment stays as `production`

3. **Create a Pull Request**:
   - Create a PR in your GitHub repository
   - Cloudflare will build a preview deployment
   - Preview URL will have `NODE_ENV=development` enabled

---

## Option 4: Local Development with Wrangler

**Purpose**: Run Cloudflare Pages locally with full development features.

### Setup:

1. **Install Wrangler CLI**:
   ```bash
   npm install -g wrangler
   ```

2. **Login to Cloudflare**:
   ```bash
   wrangler login
   ```

3. **Install Dependencies**:
   ```bash
   cd frontend
   npm install
   ```

4. **Run Development Server**:
   ```bash
   npm run dev
   ```
   This uses Vite's dev server (not Cloudflare Pages, but simulates it)

5. **Or Use Wrangler Pages Dev** (if using Workers):
   ```bash
   wrangler pages dev dist --compatibility-date=2024-01-01
   ```

---

## Option 5: Custom Build Command for Development

**Purpose**: Use a different build command that sets development mode.

### Steps:

1. **Update Cloudflare Pages Build Settings**:
   - Go to **Settings** → **Builds & deployments**
   - Change **Build command** from:
     ```
     npm run build
     ```
   - To:
     ```
     npm run build:dev
     ```
   - This uses the `build:dev` script which runs `vite build --mode development`

2. **Revert After Debugging**:
   - Change back to `npm run build` when done
   - Or create a separate branch/environment for development builds

---

## Recommended Approach

For **debugging the KYC button issue**:

1. **Short-term**: Use **Option 1** (Development Mode toggle) to bypass cache
2. **For Debug Panel**: Use **Option 2** or **Option 3** to set `NODE_ENV=development` in Preview deployments
3. **Long-term**: Use **Option 3** (Preview deployments) for all testing

### Quick Setup for Debug Panel:

```bash
# In Cloudflare Dashboard:
1. Pages → Your Project → Settings → Environment Variables
2. Add:
   - Name: NODE_ENV
   - Value: development
   - Environment: Preview (not Production!)
3. Create a new branch/PR to trigger preview deployment
4. Preview URL will show debug panel
```

---

## Current Code Behavior

Your code checks `process.env.NODE_ENV === 'development'` to show debug panels:

```typescript
{process.env.NODE_ENV === 'development' && (
  <div className="mb-4 p-2 bg-black/20 text-xs text-white/60 rounded">
    Debug: user={user ? 'yes' : 'no'}, ...
  </div>
)}
```

**In Vite**, use `import.meta.env.MODE` or `import.meta.env.DEV` instead:

```typescript
// Current (might not work in production)
process.env.NODE_ENV === 'development'

// Better for Vite
import.meta.env.DEV  // true in development
import.meta.env.MODE === 'development'  // explicit check
```

---

## Troubleshooting

### Debug Panel Not Showing?
- Check that `NODE_ENV=development` is set in Cloudflare environment variables
- Verify you're checking the correct deployment (preview vs production)
- Clear browser cache
- Check browser console for errors

### Build Failing?
- Ensure `build:dev` script exists in `package.json`
- Check Cloudflare build logs for errors
- Verify environment variables are set correctly

### Changes Not Reflecting?
- Enable Development Mode toggle (Option 1)
- Clear Cloudflare cache
- Wait for deployment to complete
- Hard refresh browser (Ctrl+Shift+R)

---

## Security Note

⚠️ **Never set `NODE_ENV=development` in Production environment** - this exposes debug information and increases bundle size.

Always use Preview deployments or separate staging environments for development mode.

