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
 * Throws error if required variables are missing
 */
export function getEnvConfig(): EnvConfig {
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
  const gtmId = import.meta.env.VITE_GTM_ID;
  const nodeEnv = import.meta.env.NODE_ENV || import.meta.env.MODE || 'development';

  // Validate required environment variables
  if (!apiBaseUrl) {
    throw new Error(
      'VITE_API_BASE_URL is required. Please set it in your .env file.\n' +
      'Example: VITE_API_BASE_URL=https://backend-piz0.onrender.com/api/v1'
    );
  }

  // Validate API URL format
  try {
    new URL(apiBaseUrl);
  } catch {
    throw new Error(
      `VITE_API_BASE_URL must be a valid URL. Current value: ${apiBaseUrl}`
    );
  }

  return {
    VITE_API_BASE_URL: apiBaseUrl,
    VITE_GTM_ID: gtmId,
    NODE_ENV: nodeEnv,
  };
}

// Export validated config
export const env = getEnvConfig();

// Export individual values for convenience
export const API_BASE_URL = env.VITE_API_BASE_URL;
export const GTM_ID = env.VITE_GTM_ID;
export const IS_PRODUCTION = env.NODE_ENV === 'production';
export const IS_DEVELOPMENT = env.NODE_ENV === 'development';

