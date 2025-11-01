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

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Navigate to **Pages** → Your Project
3. Click on **Settings** tab
4. Scroll down to **Environment Variables** section
5. Click **Add variable** for **Production** environment
6. Add the following:

   **Variable 1:**
   - Variable name: `VITE_API_BASE_URL`
   - Value: `https://backend-piz0.onrender.com/api/v1`
   - Environment: Production

   **Variable 2 (Optional):**
   - Variable name: `VITE_GTM_ID`
   - Value: `GTM-THXQ6Q9V`
   - Environment: Production

7. Click **Save**
8. **Redeploy** your site for changes to take effect

## Verification

After setting the environment variables and redeploying:

1. The application should load without errors
2. If the variable is missing, you'll see a user-friendly error page in Arabic explaining what needs to be configured

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


