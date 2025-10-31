# Cloudflare Pages Setup Guide

## Build Settings

When setting up Cloudflare Pages, use these settings:

- **Framework preset**: None (or Vite if available)
- **Build command**: `npm run build`
- **Build output directory**: `dist`
- **Root directory**: `/` (leave empty)
- **Node version**: 18 or higher

## Environment Variables

Make sure to add these in Cloudflare Pages Settings → Environment Variables:

- `VITE_API_BASE_URL`: `https://api.nxoland.com`
- `VITE_GTM_ID`: `GTM-THXQ6Q9V`

## Files Added

1. **`public/_redirects`**: Handles React Router client-side routing
2. **`wrangler.toml`**: Cloudflare Workers/Pages configuration
3. **`.cloudflare-build.json`**: Build configuration for Cloudflare Pages

## Troubleshooting

If deployment fails:
1. Check Node version (should be 18+)
2. Verify build command is `npm run build`
3. Check output directory is `dist`
4. Ensure environment variables are set
5. Check build logs for specific errors

