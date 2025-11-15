import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { isEnvConfigured } from "./config/env";

// Import CSS normally - Vite will handle it during build
// For production, CSS is extracted and can be deferred via HTML
import "./index.css";

// Handle chunk loading errors (happens when new deployment invalidates old chunks)
window.addEventListener('error', (event) => {
  if (event.message.includes('Failed to fetch dynamically imported module') || 
      event.message.includes('Importing a module script failed')) {
    console.warn('Chunk load error detected, reloading page...');
    window.location.reload();
  }
});

// Check environment configuration before loading app
try {
  if (!isEnvConfigured()) {
    const rootElement = document.getElementById("root");
    if (rootElement) {
      rootElement.innerHTML = `
        <div style="display: flex; align-items: center; justify-content: center; min-height: 100vh; padding: 20px; font-family: system-ui, sans-serif; background: #1a1a1a; color: #fff; direction: rtl;">
          <div style="max-width: 600px; text-align: center;">
            <h1 style="color: #ef4444; margin-bottom: 16px;">خطأ في الإعدادات</h1>
            <p style="margin-bottom: 8px; font-size: 18px;">المتغير البيئي VITE_API_BASE_URL غير محدد</p>
            <div style="background: #2a2a2a; padding: 20px; border-radius: 8px; margin-top: 20px; text-align: right;">
              <p style="margin-bottom: 12px; color: #9ca3af;">يرجى إضافة المتغيرات التالية في Cloudflare Pages:</p>
              <p style="margin-bottom: 8px; font-family: monospace; color: #60a5fa; padding: 8px; background: #1a1a1a; border-radius: 4px;">
                VITE_API_BASE_URL=https://backend-piz0.onrender.com/api/v1
              </p>
              <p style="margin-top: 16px; color: #9ca3af; font-size: 14px;">
                Cloudflare Dashboard → Pages → Settings → Environment Variables
              </p>
            </div>
          </div>
        </div>
      `;
    }
  } else {
    // GTM is already loaded via index.html for Google Search Console verification
    // initGTM() is skipped to avoid duplicate loading and reduce main-thread tasks

    const rootElement = document.getElementById("root");
    if (!rootElement) {
      throw new Error("Root element not found");
    }

    createRoot(rootElement).render(<App />);
  }
} catch (error) {
  // Fallback error display if something goes wrong
  const rootElement = document.getElementById("root");
  if (rootElement) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    rootElement.innerHTML = `
      <div style="display: flex; align-items: center; justify-content: center; min-height: 100vh; padding: 20px; font-family: system-ui, sans-serif; background: #1a1a1a; color: #fff; direction: rtl;">
        <div style="max-width: 600px; text-align: center;">
          <h1 style="color: #ef4444; margin-bottom: 16px;">خطأ في التهيئة</h1>
          <p style="margin-bottom: 8px; font-size: 18px;">${errorMessage}</p>
          <p style="margin-top: 16px; color: #9ca3af; font-size: 14px;">
            يرجى التحقق من إعدادات البيئة في Cloudflare Pages
          </p>
        </div>
      </div>
    `;
  }
}
