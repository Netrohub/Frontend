/**
 * Google Tag Manager initialization
 */
export function initGTM() {
  const gtmId = import.meta.env.VITE_GTM_ID || 'GTM-THXQ6Q9V';
  
  // Skip if already initialized
  if (window.dataLayer) {
    return;
  }
  
  // Initialize dataLayer
  window.dataLayer = window.dataLayer || [];
  
  // GTM script
  (function(w: any, d: Document, s: string, l: string, i: string) {
    w[l] = w[l] || [];
    w[l].push({'gtm.start': new Date().getTime(), event: 'gtm.js'});
    const f = d.getElementsByTagName(s)[0];
    const j = d.createElement(s) as HTMLScriptElement;
    const dl = l != 'dataLayer' ? '&l=' + l : '';
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
    dataLayer?: any[];
  }
}

