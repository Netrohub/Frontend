/**
 * Generate a CSP nonce for Content Security Policy compliance
 * This nonce should be unique per page load
 */
export function generateNonce(): string {
  // Generate a random base64 string (16 bytes = 24 base64 characters)
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return btoa(String.fromCharCode(...array))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

/**
 * Get or create a nonce for the current page
 * Stores it in sessionStorage to persist across navigation
 */
export function getNonce(): string {
  const storageKey = '__csp_nonce__';
  
  // Try to get existing nonce from sessionStorage
  const existing = sessionStorage.getItem(storageKey);
  if (existing) {
    return existing;
  }
  
  // Generate new nonce
  const nonce = generateNonce();
  sessionStorage.setItem(storageKey, nonce);
  
  return nonce;
}

