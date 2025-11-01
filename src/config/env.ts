/**
 * Environment variable validation and configuration
 * Ensures required environment variables are present
 */

interface EnvConfig {
  VITE_API_BASE_URL: string;
  VITE_GTM_ID?: string;
  NODE_ENV: string;
}

/**
 * Validates and returns environment configuration
 * Returns null if validation fails (for graceful error handling)
 */
export function getEnvConfig(): EnvConfig | null {
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
  const gtmId = import.meta.env.VITE_GTM_ID;
  const nodeEnv = import.meta.env.NODE_ENV || import.meta.env.MODE || 'development';

  // Validate required environment variables
  if (!apiBaseUrl) {
    return null;
  }

  // Validate API URL format
  try {
    new URL(apiBaseUrl);
  } catch {
    return null;
  }

  return {
    VITE_API_BASE_URL: apiBaseUrl,
    VITE_GTM_ID: gtmId,
    NODE_ENV: nodeEnv,
  };
}

/**
 * Gets environment config or throws with user-friendly error
 */
function getEnvConfigOrThrow(): EnvConfig {
  const config = getEnvConfig();
  if (!config) {
    const errorMessage = 'VITE_API_BASE_URL is required. Please set it in your environment variables.\n' +
      'For Cloudflare Pages: Go to Settings → Environment Variables and add:\n' +
      'VITE_API_BASE_URL=https://backend-piz0.onrender.com/api/v1';
    throw new Error(errorMessage);
  }
  return config;
}

// Export validated config
export const env = getEnvConfigOrThrow();

// Export individual values for convenience
export const API_BASE_URL = env.VITE_API_BASE_URL;
export const GTM_ID = env.VITE_GTM_ID;
export const IS_PRODUCTION = env.NODE_ENV === 'production';
export const IS_DEVELOPMENT = env.NODE_ENV === 'development';

/**
 * Check if environment is properly configured
 */
export function isEnvConfigured(): boolean {
  return getEnvConfig() !== null;
}

