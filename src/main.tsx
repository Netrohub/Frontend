import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { initGTM } from "./utils/gtm";
import { isEnvConfigured } from "./config/env";

// Check environment configuration
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
  // Initialize Google Tag Manager
  initGTM();

  const rootElement = document.getElementById("root");
  if (!rootElement) {
    throw new Error("Root element not found");
  }

  createRoot(rootElement).render(<App />);
}
