import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { isEnvConfigured } from "./config/env";
// Import GTM utility to set up consent-based initialization
import "@/utils/gtm";

// Import CSS normally - Vite will handle it during build
// For production, CSS is extracted and can be deferred via HTML
import "./index.css";

// Handle chunk loading errors (happens when new deployment invalidates old chunks)
window.addEventListener('error', (event) => {
  const errorMessage = event.message || '';
  const errorSource = (event.target as HTMLScriptElement)?.src || '';
  const errorFilename = (event.filename || '').toLowerCase();
  
  // Check for chunk loading errors
  const isChunkError = 
    errorMessage.includes('Failed to fetch dynamically imported module') || 
    errorMessage.includes('Importing a module script failed') ||
    (errorMessage.includes('SyntaxError') && errorMessage.includes('Unexpected token')) ||
    (errorFilename.includes('.js') && errorMessage.includes('Unexpected token')) ||
    (errorSource.includes('.js') && event.target && !(event.target as HTMLScriptElement).type);
  
  if (isChunkError) {
    console.warn('Chunk load error detected, reloading page...', { errorMessage, errorSource, errorFilename });
    // Small delay to prevent infinite reload loops
    setTimeout(() => {
      window.location.reload();
    }, 100);
    event.preventDefault(); // Prevent error from propagating
  }
}, true);

// Also catch unhandled promise rejections that might be chunk loading errors
window.addEventListener('unhandledrejection', (event) => {
  const errorMessage = String(event.reason?.message || event.reason || '');
  
  if (errorMessage.includes('Failed to fetch dynamically imported module') || 
      errorMessage.includes('Importing a module script failed') ||
      (errorMessage.includes('SyntaxError') && errorMessage.includes('Unexpected token'))) {
    console.warn('Chunk load error detected in promise rejection, reloading page...', { errorMessage });
    setTimeout(() => {
      window.location.reload();
    }, 100);
    event.preventDefault(); // Prevent error from propagating
  }
});

// SECURITY: Sanitize error messages to prevent XSS
function escapeHtml(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Check environment configuration before loading app
try {
  if (!isEnvConfigured()) {
    const rootElement = document.getElementById("root");
    if (rootElement) {
      // SECURITY: Use textContent instead of innerHTML to prevent XSS
      // Create elements safely instead of using innerHTML with user-controlled content
      rootElement.innerHTML = ''; // Clear first
      const container = document.createElement('div');
      container.style.cssText = 'display: flex; align-items: center; justify-content: center; min-height: 100vh; padding: 20px; font-family: system-ui, sans-serif; background: #1a1a1a; color: #fff; direction: rtl;';
      
      const innerDiv = document.createElement('div');
      innerDiv.style.cssText = 'max-width: 600px; text-align: center;';
      
      const h1 = document.createElement('h1');
      h1.style.cssText = 'color: #ef4444; margin-bottom: 16px;';
      h1.textContent = 'خطأ في الإعدادات';
      
      const p1 = document.createElement('p');
      p1.style.cssText = 'margin-bottom: 8px; font-size: 18px;';
      p1.textContent = 'المتغير البيئي VITE_API_BASE_URL غير محدد';
      
      const configDiv = document.createElement('div');
      configDiv.style.cssText = 'background: #2a2a2a; padding: 20px; border-radius: 8px; margin-top: 20px; text-align: right;';
      
      const p2 = document.createElement('p');
      p2.style.cssText = 'margin-bottom: 12px; color: #9ca3af;';
      p2.textContent = 'يرجى إضافة المتغيرات التالية في Cloudflare Pages:';
      
      const codeP = document.createElement('p');
      codeP.style.cssText = 'margin-bottom: 8px; font-family: monospace; color: #60a5fa; padding: 8px; background: #1a1a1a; border-radius: 4px;';
      codeP.textContent = 'VITE_API_BASE_URL=https://backend-piz0.onrender.com/api/v1';
      
      const p3 = document.createElement('p');
      p3.style.cssText = 'margin-top: 16px; color: #9ca3af; font-size: 14px;';
      p3.textContent = 'Cloudflare Dashboard → Pages → Settings → Environment Variables';
      
      configDiv.appendChild(p2);
      configDiv.appendChild(codeP);
      configDiv.appendChild(p3);
      
      innerDiv.appendChild(h1);
      innerDiv.appendChild(p1);
      innerDiv.appendChild(configDiv);
      container.appendChild(innerDiv);
      rootElement.appendChild(container);
    }
  } else {
    // GTM utility is imported above and will handle consent-based initialization
    // GTM will only load after user accepts cookies

    const rootElement = document.getElementById("root");
    if (!rootElement) {
      throw new Error("Root element not found");
    }

    createRoot(rootElement).render(<App />);
  }
} catch (error) {
  // Fallback error display if something goes wrong
  // SECURITY: Use textContent instead of innerHTML to prevent XSS
  const rootElement = document.getElementById("root");
  if (rootElement) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    // SECURITY: Create elements safely instead of using innerHTML with error message
    rootElement.innerHTML = ''; // Clear first
    const container = document.createElement('div');
    container.style.cssText = 'display: flex; align-items: center; justify-content: center; min-height: 100vh; padding: 20px; font-family: system-ui, sans-serif; background: #1a1a1a; color: #fff; direction: rtl;';
    
    const innerDiv = document.createElement('div');
    innerDiv.style.cssText = 'max-width: 600px; text-align: center;';
    
    const h1 = document.createElement('h1');
    h1.style.cssText = 'color: #ef4444; margin-bottom: 16px;';
    h1.textContent = 'خطأ في التهيئة';
    
    const p1 = document.createElement('p');
    p1.style.cssText = 'margin-bottom: 8px; font-size: 18px;';
    p1.textContent = escapeHtml(errorMessage); // Escape to prevent XSS
    
    const p2 = document.createElement('p');
    p2.style.cssText = 'margin-top: 16px; color: #9ca3af; font-size: 14px;';
    p2.textContent = 'يرجى التحقق من إعدادات البيئة في Cloudflare Pages';
    
    innerDiv.appendChild(h1);
    innerDiv.appendChild(p1);
    innerDiv.appendChild(p2);
    container.appendChild(innerDiv);
    rootElement.appendChild(container);
  }
}
