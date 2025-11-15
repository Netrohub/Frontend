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
      // Optimize chunk size
      chunkSizeWarningLimit: 1000,
    },
    // Enable minification with terser
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.log in production
        drop_debugger: true,
      },
    },
  },
  // Ensure environment variables are available during build
  envPrefix: 'VITE_',
  // Development server configuration
  server: {
    headers: {
      // Apply CSP in development (matches production)
      'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://challenges.cloudflare.com https://www.googletagmanager.com https://www.google-analytics.com https://cdn.withpersona.com https://static.cloudflareinsights.com; frame-src https://challenges.cloudflare.com https://www.googletagmanager.com https://withpersona.com; worker-src 'self' https://challenges.cloudflare.com blob:; child-src 'self' https://challenges.cloudflare.com; connect-src 'self' http://localhost:* https://backend-piz0.onrender.com https://www.google-analytics.com https://www.googletagmanager.com https://withpersona.com https://challenges.cloudflare.com; img-src 'self' data: blob: https://imagedelivery.net https:; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' data: https://fonts.gstatic.com; base-uri 'self'; object-src 'none'; frame-ancestors 'none';",
    },
  },
});
