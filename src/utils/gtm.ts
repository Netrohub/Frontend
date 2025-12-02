/**
 * Google Tag Manager initialization
 * Now requires user consent before loading
 */
import { getGTMId } from '@/config/env';

let gtmInitialized = false;

/**
 * Initialize Google Tag Manager
 * Only loads if user has consented to cookies
 */
export function initGTM() {
  // Skip if GTM is already initialized
  if (gtmInitialized) {
    return;
  }

  // Check if user has consented to cookies
  const consentData = localStorage.getItem('cookie_consent_status');
  if (!consentData) {
    // No consent yet, wait for user decision
    return;
  }

  try {
    const consent = JSON.parse(consentData);
    const expiryDate = new Date(consent.expiry);
    
    // Check if consent is valid and accepted
    if (expiryDate <= new Date() || consent.status !== 'accepted') {
      return;
    }
  } catch {
    // Invalid consent data
    return;
  }

  // User has consented, initialize GTM
  const gtmId = getGTMId() || 'GTM-THXQ6Q9V';
  
  // Initialize dataLayer if not already done
  window.dataLayer = window.dataLayer || [];
  
  // Check if GTM script is already loaded
  if (document.querySelector('script[src*="googletagmanager.com/gtm.js"]')) {
    gtmInitialized = true;
    return;
  }
  
  // Load GTM script
  (function(w: Window & { dataLayer?: unknown[] }, d: Document, s: string, l: string, i: string) {
    w[l] = w[l] || [];
    (w[l] as unknown[]).push({'gtm.start': new Date().getTime(), event: 'gtm.js'});
    const f = d.getElementsByTagName(s)[0];
    const j = d.createElement(s) as HTMLScriptElement;
    const dl = l !== 'dataLayer' ? '&l=' + l : '';
    j.async = true;
    j.src = 'https://www.googletagmanager.com/gtm.js?id=' + i + dl;
    if (f && f.parentNode) {
      f.parentNode.insertBefore(j, f);
    }
  })(window, document, 'script', 'dataLayer', gtmId);
  
  // Add noscript iframe (only if not already present)
  if (!document.querySelector('noscript iframe[src*="googletagmanager.com"]')) {
    const noscript = document.createElement('noscript');
    const iframe = document.createElement('iframe');
    iframe.src = `https://www.googletagmanager.com/ns.html?id=${gtmId}`;
    iframe.height = '0';
    iframe.width = '0';
    iframe.style.display = 'none';
    iframe.style.visibility = 'hidden';
    noscript.appendChild(iframe);
    document.body.insertBefore(noscript, document.body.firstChild);
  }
  
  gtmInitialized = true;
}

/**
 * Listen for cookie consent events
 */
if (typeof window !== 'undefined') {
  window.addEventListener('cookieConsentAccepted', () => {
    initGTM();
  });
  
  // Also try to initialize on page load if consent already exists
  if (document.readyState === 'complete') {
    initGTM();
  } else {
    window.addEventListener('load', () => {
      initGTM();
    });
  }
}

// Extend Window interface
declare global {
  interface Window {
    dataLayer?: unknown[];
  }
}

