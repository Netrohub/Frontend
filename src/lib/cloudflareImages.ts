/**
 * Cloudflare Images Utility
 * 
 * Helper functions for working with Cloudflare Images URLs
 * All images in the website should use Cloudflare Images for:
 * - Fast CDN delivery
 * - Automatic optimization (WebP/AVIF)
 * - Global performance
 */

// Get Cloudflare account hash from environment variable
// Set this in Cloudflare Pages → Settings → Environment Variables
const CLOUDFLARE_ACCOUNT_HASH = import.meta.env.VITE_CF_IMAGES_ACCOUNT_HASH || '';

// Track if we've already warned about missing account hash
let hasWarnedAboutHash = false;

/**
 * Build a Cloudflare Images URL
 * @param imageId - The Cloudflare image ID
 * @param variant - Image variant: 'public' (full size), 'medium' (800x800), 'thumbnail' (300x300)
 * @returns Full Cloudflare Images URL
 */
export function getCloudflareImageUrl(
  imageId: string,
  variant: 'public' | 'medium' | 'thumbnail' = 'public'
): string {
  // If no account hash, return empty immediately (no Cloudflare Images configured)
  if (!CLOUDFLARE_ACCOUNT_HASH) {
    return '';
  }
  
  // If imageId is a placeholder or invalid, return empty (will use fallback)
  if (!imageId || 
      imageId.includes('_ID') || 
      imageId.includes('PLACEHOLDER') ||
      imageId.length < 10) { // Cloudflare image IDs are usually longer
    return '';
  }

  return `https://imagedelivery.net/${CLOUDFLARE_ACCOUNT_HASH}/${imageId}/${variant}`;
}

/**
 * Check if a URL is already a Cloudflare Images URL
 * @param url - URL to check
 * @returns true if URL is from Cloudflare Images
 */
export function isCloudflareImageUrl(url: string): boolean {
  return url.includes('imagedelivery.net');
}

/**
 * Get image variant URL from a Cloudflare Images URL
 * @param baseUrl - Base Cloudflare Images URL (any variant)
 * @param variant - Desired variant
 * @returns URL with the specified variant
 */
export function getImageVariant(baseUrl: string, variant: 'public' | 'medium' | 'thumbnail'): string {
  if (!isCloudflareImageUrl(baseUrl)) {
    return baseUrl; // Return as-is if not a Cloudflare URL
  }
  
  // Replace variant in URL
  return baseUrl.replace(/\/(public|medium|thumbnail)$/, `/${variant}`);
}

/**
 * Predefined image IDs for static assets
 * These should be uploaded to Cloudflare Images and their IDs updated here
 */
export const STATIC_IMAGE_IDS = {
  // Logo
  LOGO: '0d47a52e-6e68-4317-8a68-9efc80165700', // Replace with actual Cloudflare image ID
  LOGO_OFFICIAL: 'NXOLAND_OFFICIAL_LOGO_ID', // Replace with actual Cloudflare image ID
  
  // Stove levels (Whiteout Survival)
  STOVE_LV_1: 'STOVE_LV_1_ID',
  STOVE_LV_2: 'STOVE_LV_2_ID',
  STOVE_LV_3: 'STOVE_LV_3_ID',
  STOVE_LV_4: 'STOVE_LV_4_ID',
  STOVE_LV_5: 'STOVE_LV_5_ID',
  STOVE_LV_6: 'STOVE_LV_6_ID',
  STOVE_LV_7: 'STOVE_LV_7_ID',
  STOVE_LV_8: 'STOVE_LV_8_ID',
  STOVE_LV_9: 'STOVE_LV_9_ID',
  STOVE_LV_10: 'STOVE_LV_10_ID',
  
  // Social media logos
  TIKTOK_LOGO: 'TIKTOK_LOGO_ID',
  INSTAGRAM_LOGO: 'INSTAGRAM_LOGO_ID',
} as const;

/**
 * Get static image URL by key
 * @param key - Key from STATIC_IMAGE_IDS
 * @param variant - Image variant
 * @returns Cloudflare Images URL (empty string if not configured)
 */
export function getStaticImageUrl(
  key: keyof typeof STATIC_IMAGE_IDS,
  variant: 'public' | 'medium' | 'thumbnail' = 'public'
): string {
  const imageId = STATIC_IMAGE_IDS[key];
  const url = getCloudflareImageUrl(imageId, variant);
  
  // If URL is empty (not configured), return empty string silently
  // The component should handle this with fallback or onError handler
  return url;
}

