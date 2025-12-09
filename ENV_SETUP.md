# Environment Variables Setup for Cloudflare Pages

## Required Environment Variables

The following environment variables must be set in Cloudflare Pages for the application to work:

### Production Environment

1. **VITE_API_BASE_URL** (Required)
   - Value: `https://backend-piz0.onrender.com/api/v1`
   - Description: Backend API base URL

2. **VITE_GTM_ID** (Optional)
   - Value: `GTM-THXQ6Q9V`
   - Description: Google Tag Manager ID

## How to Set Environment Variables in Cloudflare Pages

### Step-by-Step Instructions:

1. **Go to Cloudflare Dashboard**
   - Visit: https://dash.cloudflare.com/
   - Log in to your account

2. **Navigate to Pages**
   - Click on **"Workers & Pages"** in the left sidebar
   - Click on **"Pages"** 
   - Find and click on your frontend project name

3. **Open Settings**
   - Click on the **"Settings"** tab at the top
   - Scroll down to find the **"Environment Variables"** section

4. **Add Environment Variables**
   - Click **"Add variable"** button
   - Select **"Production"** environment (or the environment you're deploying to)
   
   **Add Variable 1 (Required):**
   - **Variable name:** `VITE_API_BASE_URL`
   - **Value:** `https://backend-piz0.onrender.com/api/v1`
   - **Environment:** Production
   - Click **"Save"**

   **Add Variable 2 (Optional - for Google Analytics):**
   - Click **"Add variable"** again
   - **Variable name:** `VITE_GTM_ID`
   - **Value:** `GTM-THXQ6Q9V` (or your GTM ID)
   - **Environment:** Production
   - Click **"Save"**

5. **Redeploy Your Site**
   - After saving, you need to trigger a new deployment
   - Go to **"Deployments"** tab
   - Click **"Retry deployment"** on the latest deployment, OR
   - Push a new commit to trigger automatic deployment, OR
   - Click **"Create deployment"** and select your branch

## Verification

After setting the environment variables and redeploying:

1. **Wait for deployment to complete** (usually 2-5 minutes)
2. **Visit your site** - The application should load without errors
3. **Check the browser console** - There should be no errors about `VITE_API_BASE_URL`
4. **If you see the error page**, it means:
   - The variable wasn't set correctly, OR
   - The deployment hasn't completed yet, OR
   - The variable is set in the wrong environment

## Current Error Message

If you see this message, it means `VITE_API_BASE_URL` is not set:

```
خطأ في الإعدادات
المتغير البيئي VITE_API_BASE_URL غير محدد

يرجى إضافة المتغيرات التالية في Cloudflare Pages:
VITE_API_BASE_URL=https://backend-piz0.onrender.com/api/v1

Cloudflare Dashboard → Pages → Settings → Environment Variables
```

**This is normal behavior** - the app is gracefully handling the missing variable. Follow the steps above to fix it.

## Troubleshooting

### Error: "VITE_API_BASE_URL is required"

**Solution:**
- Ensure the environment variable is set in Cloudflare Pages Settings
- Make sure you selected the correct environment (Production)
- Redeploy the site after adding the variable
- Check that the variable name is exactly `VITE_API_BASE_URL` (case-sensitive)

### Build succeeds but runtime fails

**Solution:**
- Environment variables must be set **before** building
- In Cloudflare Pages, variables are available during build time
- Make sure variables are set in the correct environment (Production)
- Redeploy after adding variables

## Notes

- Environment variables are embedded at **build time** in Vite
- Variables must be set before deployment
- Changes to environment variables require a **new deployment**
- The error page will display instructions in Arabic if variables are missing


