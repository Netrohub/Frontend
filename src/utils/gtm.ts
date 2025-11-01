/**
 * Google Tag Manager initialization
 */
import { getGTMId } from '@/config/env';

export function initGTM() {
  // Skip if GTM ID is not configured
  const gtmId = getGTMId();
  if (!gtmId) {
    if (import.meta.env.DEV) {
      console.warn('GTM_ID not configured. Google Tag Manager will not be initialized.');
    }
    return;
  }
  
  // Skip if already initialized
  if (window.dataLayer) {
    return;
  }
  
  // Initialize dataLayer
  window.dataLayer = window.dataLayer || [];
  
  // GTM script
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
  
  // Add noscript iframe
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

// Extend Window interface
declare global {
  interface Window {
    dataLayer?: unknown[];
  }
}

