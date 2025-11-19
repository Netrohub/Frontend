import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // React core
          if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) {
            return 'react-vendor';
          }
          // Radix UI components
          if (id.includes('@radix-ui')) {
            return 'ui-vendor';
          }
          // React Query
          if (id.includes('@tanstack/react-query')) {
            return 'query-vendor';
          }
          // Lucide icons (large library, split separately)
          if (id.includes('lucide-react')) {
            return 'icons-vendor';
          }
          // React Helmet
          if (id.includes('react-helmet')) {
            return 'helmet-vendor';
          }
          // Recharts (only used in admin charts, large library)
          if (id.includes('recharts')) {
            return 'charts-vendor';
          }
          // Sonner (toast library, can be deferred)
          if (id.includes('sonner')) {
            return 'toast-vendor';
          }
          // Admin pages (large, rarely accessed)
          if (id.includes('/admin/')) {
            return 'admin-pages';
          }
          // Sell pages (large forms)
          if (id.includes('/sell/')) {
            return 'sell-pages';
          }
        },
      },
    },
    // Use esbuild minification (default, faster than terser)
    // esbuild automatically removes console.log in production
    minify: 'esbuild',
    // Chunk size warning limit (moved to correct location)
    chunkSizeWarningLimit: 1000,
    // CSS code splitting - separate CSS for better caching
    cssCodeSplit: true,
  },
  // Ensure environment variables are available during build
  envPrefix: 'VITE_',
  // Development server configuration
  server: {
    headers: {
      // Apply CSP in development (matches production)
      'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://challenges.cloudflare.com https://www.googletagmanager.com https://www.google-analytics.com https://cdn.withpersona.com https://static.cloudflareinsights.com https://studio.plasmic.app https://*.plasmic.app https://js.stripe.com https://widget.intercom.io; frame-src https://challenges.cloudflare.com https://www.googletagmanager.com https://withpersona.com https://docs.plasmic.app https://studio.plasmic.app; worker-src 'self' https://challenges.cloudflare.com blob:; child-src 'self' https://challenges.cloudflare.com; connect-src 'self' http://localhost:* https://backend-piz0.onrender.com https://www.google-analytics.com https://www.googletagmanager.com https://withpersona.com https://challenges.cloudflare.com https://api.plasmic.app https://*.plasmic.app https://*.sentry.io https://api2.amplitude.com https://*.intercom.io https://api.stripe.com; img-src 'self' data: blob: https://imagedelivery.net https:; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://studio.plasmic.app https://*.plasmic.app; font-src 'self' data: https://fonts.gstatic.com; base-uri 'self' https://studio.plasmic.app https://*.plasmic.app; object-src 'none'; frame-ancestors 'self' https://studio.plasmic.app https://docs.plasmic.app;",
    },
  },
});
