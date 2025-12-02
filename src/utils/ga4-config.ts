/**
 * Google Analytics 4 (GA4) Configuration Utility
 * 
 * This utility configures GA4 with privacy-compliant settings via GTM dataLayer.
 * All settings comply with GDPR/PDPL and respect user privacy.
 * 
 * Reference: https://developers.google.com/analytics/devguides/collection/ga4/reference/config
 */

// Extend dataLayer interface
declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
    gtag?: (...args: unknown[]) => void;
  }
}

/**
 * GA4 Configuration Options
 * Based on Google Analytics configuration fields documentation
 */
export interface GA4ConfigOptions {
  // Privacy & Compliance Settings
  allowGoogleSignals?: boolean;
  allowAdPersonalizationSignals?: boolean;
  cookieDomain?: string;
  cookieExpires?: number; // in seconds
  cookieFlags?: string; // e.g., 'SameSite=None;Secure'
  cookiePath?: string;
  cookiePrefix?: string;
  cookieUpdate?: boolean;
  
  // Page Information
  pageLocation?: string;
  pageReferrer?: string;
  pageTitle?: string;
  sendPageView?: boolean;
  
  // User & Session
  userId?: string; // Non-PII user identifier
  clientId?: string;
  language?: string;
  
  // Campaign Tracking
  campaignId?: string;
  campaignSource?: string;
  campaignMedium?: string;
  campaignName?: string;
  campaignTerm?: string;
  campaignContent?: string;
  
  // Custom Properties
  userProperties?: Record<string, string>;
  contentGroup?: string;
  
  // Screen & Device
  screenResolution?: string;
  
  // Referrer Settings
  ignoreReferrer?: boolean;
}

/**
 * Default privacy-compliant configuration
 * These defaults ensure GDPR/PDPL compliance
 */
const DEFAULT_PRIVACY_CONFIG: Partial<GA4ConfigOptions> = {
  // Disable advertising features for privacy compliance
  allowGoogleSignals: false, // Set to true only if user explicitly consents to ads
  allowAdPersonalizationSignals: false, // Disable ad personalization
  
  // Cookie settings for privacy
  cookieDomain: 'auto', // Automatically set to top-level domain
  cookieExpires: 63072000, // 2 years (730 days * 24 * 60 * 60)
  cookiePath: '/',
  cookieUpdate: true, // Update expiration on each visit
  
  // Privacy-friendly flags
  cookieFlags: 'SameSite=Lax;Secure', // Secure cookies, same-site protection
  
  // Page tracking
  sendPageView: true,
  
  // Language detection
  language: typeof navigator !== 'undefined' ? navigator.language : 'ar',
  
  // Screen resolution (privacy-safe aggregate data)
  screenResolution: typeof window !== 'undefined' 
    ? `${window.screen.width}x${window.screen.height}`
    : undefined,
};

/**
 * Push configuration to GTM dataLayer
 * This works with Google Tag Manager to configure GA4 tags
 */
function pushToDataLayer(config: Record<string, unknown>): void {
  if (typeof window === 'undefined' || !window.dataLayer) {
    console.warn('dataLayer not available. GTM may not be loaded yet.');
    return;
  }
  
  window.dataLayer.push(config);
}

/**
 * Configure GA4 via gtag() if available (direct GA4 implementation)
 * Falls back to dataLayer for GTM implementation
 */
function configureViaGtag(streamId: string, config: Record<string, unknown>): void {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', streamId, config);
  } else {
    // Push to dataLayer for GTM to pick up
    pushToDataLayer({
      ...config,
      // GTM will handle the GA4 configuration tag
    });
  }
}

/**
 * Configure GA4 with privacy-compliant settings
 * 
 * @param streamId - GA4 Measurement ID (G-XXXXXXXXXX) - optional if using GTM
 * @param options - Configuration options (will merge with defaults)
 */
export function configureGA4(
  streamId?: string,
  options: GA4ConfigOptions = {}
): void {
  // Merge user options with privacy-compliant defaults
  const config: Record<string, unknown> = {
    ...DEFAULT_PRIVACY_CONFIG,
    ...options,
  };
  
  // Remove undefined values
  Object.keys(config).forEach(key => {
    if (config[key] === undefined) {
      delete config[key];
    }
  });
  
  // If streamId provided, configure directly via gtag
  // Otherwise, push to dataLayer for GTM configuration
  if (streamId) {
    configureViaGtag(streamId, config);
  } else {
    // Push configuration to dataLayer
    // GTM should be configured to read these values in the GA4 Configuration tag
    pushToDataLayer({
      event: 'ga4_config',
      ...config,
    });
  }
}

/**
 * Set GA4 user ID (non-PII identifier)
 * 
 * @param userId - Non-PII user identifier (e.g., database ID, not email)
 * @param streamId - Optional GA4 Measurement ID
 */
export function setGA4UserId(userId: string, streamId?: string): void {
  if (!userId || typeof userId !== 'string') {
    console.warn('GA4: Invalid user ID provided. Must be a non-empty string.');
    return;
  }
  
  const config: Record<string, unknown> = {
    user_id: userId,
  };
  
  if (streamId) {
    configureViaGtag(streamId, config);
  } else {
    pushToDataLayer({
      event: 'ga4_set_user_id',
      ...config,
    });
  }
}

/**
 * Set GA4 user properties
 * Useful for segmenting users (e.g., user role, account type)
 * 
 * @param properties - User properties (max 24 chars for keys, 36 for values)
 * @param streamId - Optional GA4 Measurement ID
 */
export function setGA4UserProperties(
  properties: Record<string, string>,
  streamId?: string
): void {
  // Validate property constraints
  const validProperties: Record<string, string> = {};
  
  Object.entries(properties).forEach(([key, value]) => {
    if (key.length > 24) {
      console.warn(`GA4: Property key "${key}" exceeds 24 character limit.`);
      return;
    }
    if (value.length > 36) {
      console.warn(`GA4: Property value for "${key}" exceeds 36 character limit.`);
      return;
    }
    validProperties[key] = value;
  });
  
  const config: Record<string, unknown> = {
    user_properties: validProperties,
  };
  
  if (streamId) {
    configureViaGtag(streamId, config);
  } else {
    pushToDataLayer({
      event: 'ga4_set_user_properties',
      ...config,
    });
  }
}

/**
 * Clear GA4 user ID (on logout)
 * 
 * @param streamId - Optional GA4 Measurement ID
 */
export function clearGA4UserId(streamId?: string): void {
  const config: Record<string, unknown> = {
    user_id: null,
  };
  
  if (streamId) {
    configureViaGtag(streamId, config);
  } else {
    pushToDataLayer({
      event: 'ga4_clear_user_id',
      ...config,
    });
  }
}

/**
 * Set campaign parameters
 * Used for tracking marketing campaigns
 * 
 * @param campaign - Campaign parameters
 * @param streamId - Optional GA4 Measurement ID
 */
export function setGA4Campaign(
  campaign: {
    id?: string;
    source?: string;
    medium?: string;
    name?: string;
    term?: string;
    content?: string;
  },
  streamId?: string
): void {
  const config: Record<string, unknown> = {};
  
  if (campaign.id) config.campaign_id = campaign.id;
  if (campaign.source) config.campaign_source = campaign.source;
  if (campaign.medium) config.campaign_medium = campaign.medium;
  if (campaign.name) config.campaign_name = campaign.name;
  if (campaign.term) config.campaign_term = campaign.term;
  if (campaign.content) config.campaign_content = campaign.content;
  
  if (streamId) {
    configureViaGtag(streamId, config);
  } else {
    pushToDataLayer({
      event: 'ga4_set_campaign',
      ...config,
    });
  }
}

/**
 * Initialize GA4 with privacy-compliant defaults
 * Call this after GTM loads and user consents to cookies
 * 
 * @param streamId - Optional GA4 Measurement ID (if not using GTM)
 */
export function initializeGA4(streamId?: string): void {
  // Configure with privacy-compliant defaults
  configureGA4(streamId, DEFAULT_PRIVACY_CONFIG);
}

/**
 * Configure GA4 for authenticated user
 * Sets user ID and relevant properties while respecting privacy
 * 
 * @param userId - Non-PII user identifier
 * @param userProperties - Additional user properties (role, account type, etc.)
 * @param streamId - Optional GA4 Measurement ID
 */
export function configureGA4ForUser(
  userId: string | number,
  userProperties?: Record<string, string>,
  streamId?: string
): void {
  // Set user ID (convert to string if number)
  setGA4UserId(String(userId), streamId);
  
  // Set user properties if provided
  if (userProperties && Object.keys(userProperties).length > 0) {
    setGA4UserProperties(userProperties, streamId);
  }
}

/**
 * Disable advertising features (for privacy compliance)
 * Call this if user rejects advertising cookies
 * 
 * @param streamId - Optional GA4 Measurement ID
 */
export function disableGA4Advertising(streamId?: string): void {
  configureGA4(streamId, {
    allowGoogleSignals: false,
    allowAdPersonalizationSignals: false,
  });
}

/**
 * Enable advertising features (only with explicit user consent)
 * 
 * @param streamId - Optional GA4 Measurement ID
 */
export function enableGA4Advertising(streamId?: string): void {
  configureGA4(streamId, {
    allowGoogleSignals: true,
    allowAdPersonalizationSignals: true,
  });
}

