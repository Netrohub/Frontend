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

// Lazy getter for env config (only throws when accessed, not on import)
let cachedEnv: EnvConfig | null = null;

function getEnv(): EnvConfig {
  if (!cachedEnv) {
    cachedEnv = getEnvConfigOrThrow();
  }
  return cachedEnv;
}

// Export validated config (lazy evaluation - only throws when accessed)
export const env = new Proxy({} as EnvConfig, {
  get(_, prop) {
    return getEnv()[prop as keyof EnvConfig];
  }
});

// Export individual values as getters (lazy evaluation)
export function getAPIBaseURL(): string {
  return getEnv().VITE_API_BASE_URL;
}

export function getGTMId(): string | undefined {
  return getEnv().VITE_GTM_ID;
}

// Export constants that are safe to import (don't throw on import)
// IS_PRODUCTION and IS_DEVELOPMENT are safe because they don't require API_BASE_URL
export const IS_PRODUCTION = (() => {
  const nodeEnv = import.meta.env.NODE_ENV || import.meta.env.MODE || 'development';
  return nodeEnv === 'production';
})();

export const IS_DEVELOPMENT = (() => {
  const nodeEnv = import.meta.env.NODE_ENV || import.meta.env.MODE || 'development';
  return nodeEnv === 'development';
})();

// Note: API_BASE_URL and GTM_ID are NOT exported as constants
// Use getAPIBaseURL() and getGTMId() functions instead to avoid import-time evaluation

/**
 * Check if environment is properly configured
 */
export function isEnvConfigured(): boolean {
  return getEnvConfig() !== null;
}

