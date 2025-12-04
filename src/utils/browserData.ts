/**
 * Browser Data Collection for 3D Secure
 * 
 * Collects mandatory browser information required for 3D Secure 2.0 authentication
 * as per HyperPay/OPP requirements
 */

export interface BrowserData {
  acceptHeader: string;
  language: string;
  screenHeight: number;
  screenWidth: number;
  timezone: number;
  userAgent: string;
  javaEnabled: boolean;
  javascriptEnabled: boolean;
  screenColorDepth?: number;
  challengeWindow?: string;
}

/**
 * Collect browser data for 3D Secure authentication
 * @returns BrowserData object with all required fields
 */
export function collectBrowserData(): BrowserData {
  if (typeof window === 'undefined') {
    // Server-side rendering fallback
    return {
      acceptHeader: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      language: 'en',
      screenHeight: 1080,
      screenWidth: 1920,
      timezone: 0,
      userAgent: 'Mozilla/5.0',
      javaEnabled: false,
      javascriptEnabled: true,
    };
  }

  // Get Accept header (if available from request, otherwise use common default)
  const acceptHeader = 
    document.querySelector('meta[http-equiv="Accept"]')?.getAttribute('content') ||
    'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8';

  // Get language from navigator
  const language = navigator.language || navigator.languages?.[0] || 'en';

  // Get screen dimensions
  const screenHeight = window.screen.height || window.innerHeight || 1080;
  const screenWidth = window.screen.width || window.innerWidth || 1920;

  // Get timezone offset in minutes (negative if ahead of UTC, positive if behind)
  const timezone = -new Date().getTimezoneOffset();

  // Get user agent
  const userAgent = navigator.userAgent || 'Mozilla/5.0';

  // Check Java support (deprecated but still required by some issuers)
  const javaEnabled = typeof (window.navigator as any).javaEnabled === 'function'
    ? (window.navigator as any).javaEnabled()
    : false;

  // JavaScript is always enabled if this code runs
  const javascriptEnabled = true;

  // Get color depth (optional but recommended)
  const screenColorDepth = window.screen.colorDepth || window.screen.pixelDepth || 24;

  // Challenge window size (optional)
  // Default to full screen (05) for better UX
  const challengeWindow = '05';

  return {
    acceptHeader,
    language,
    screenHeight,
    screenWidth,
    timezone,
    userAgent,
    javaEnabled,
    javascriptEnabled,
    screenColorDepth,
    challengeWindow,
  };
}

/**
 * Get customer IP address (if available)
 * This is usually collected server-side, but can be sent from frontend if needed
 */
export function getCustomerIP(): string | null {
  // IP address should be collected server-side for security
  // Frontend cannot reliably get real IP due to proxies/NAT
  return null;
}

