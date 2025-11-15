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
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu', '@radix-ui/react-toast'],
          'query-vendor': ['@tanstack/react-query'],
        },
      },
    },
  },
  // Ensure environment variables are available during build
  envPrefix: 'VITE_',
  // Development server configuration
  server: {
    headers: {
      // Apply CSP in development (matches production)
      'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://challenges.cloudflare.com https://www.googletagmanager.com https://www.google-analytics.com https://cdn.withpersona.com https://static.cloudflareinsights.com; frame-src https://challenges.cloudflare.com https://www.googletagmanager.com https://withpersona.com; connect-src 'self' http://localhost:* https://backend-piz0.onrender.com https://www.google-analytics.com https://www.googletagmanager.com https://withpersona.com; img-src 'self' data: blob: https://imagedelivery.net https:; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' data: https://fonts.gstatic.com; base-uri 'self'; object-src 'none'; frame-ancestors 'none';",
    },
  },
});
