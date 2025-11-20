import type { StorybookConfig } from '@storybook/react-vite';
import { mergeConfig } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';

// ES modules don't have __dirname, so we need to create it from import.meta.url
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const config: StorybookConfig = {
  "stories": [
    // Load story files first
    "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)",
    // Temporarily exclude all MDX files to avoid onboarding issues
    // "../src/**/*.mdx",
  ],
  // Feature flags for better MDX handling
  features: {
    buildStoriesJson: false,
  },
  "addons": [
    "@chromatic-com/storybook",
    {
      name: "@storybook/addon-docs",
      options: {
        // Fix Windows path issues with MDX compilation
        mdxPluginOptions: {
          mdxCompileOptions: {
            remarkPlugins: [],
            rehypePlugins: [],
          },
        },
      },
    },
    "@storybook/addon-onboarding",
    "@storybook/addon-a11y",
    "@storybook/addon-vitest"
  ],
  "framework": {
    "name": "@storybook/react-vite",
    "options": {}
  },
  async viteFinal(config, { configType }) {
    // Fix Windows path issues with spaces in directory names
    // This ensures proper path resolution for MDX files
    return mergeConfig(config, {
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '../src'),
        },
        // Fix file:// protocol imports for Windows paths with spaces
        dedupe: ['react', 'react-dom'],
      },
      // Ensure proper handling of file:// protocol imports
      server: {
        fs: {
          // Allow serving files from project root and node_modules
          allow: ['..', path.resolve(__dirname, '../node_modules')],
        },
        // Fix Windows path issues with spaces in directory names
        host: true,
        port: 6006,
        // Disable strict mode for better virtual module resolution
        strictPort: false,
      },
      // Set unique cache directory to prevent conflicts
      cacheDir: path.resolve(__dirname, '../node_modules/.vite-storybook'),
      // Ensure React runs in development mode in Storybook (always use development for dev server)
      define: {
        ...config.define,
        'process.env.NODE_ENV': JSON.stringify('development'),
        __DEV__: true,
      },
      // Optimize dependencies to handle path resolution better
      optimizeDeps: {
        include: ['@storybook/addon-docs', 'react', 'react-dom'],
        exclude: [],
        // Force re-optimization if needed
        force: false,
        // Include MDX related dependencies
        esbuildOptions: {
          loader: {
            '.mdx': 'jsx',
          },
        },
      },
      // Better handling of MDX imports
      assetsInclude: ['**/*.mdx'],
      // Plugin configuration for MDX
      plugins: config.plugins || [],
    });
  },
};
export default config;