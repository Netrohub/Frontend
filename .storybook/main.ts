import type { StorybookConfig } from '@storybook/react-vite';
import { mergeConfig } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';

// ES modules don't have __dirname, so we need to create it from import.meta.url
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const config: StorybookConfig = {
  "stories": [
    // Temporarily exclude onboarding MDX to fix loading issue
    // "../src/stories/Configure.mdx", // Excluded temporarily
    "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)",
    "../src/**/*.mdx"
  ],
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
      },
      // Set unique cache directory to prevent conflicts
      cacheDir: path.resolve(__dirname, '../node_modules/.vite-storybook'),
      // Optimize dependencies to handle path resolution better
      optimizeDeps: {
        include: ['@storybook/addon-docs', 'react', 'react-dom'],
        exclude: [],
        // Force re-optimization if needed
        force: false,
      },
      // Better handling of MDX imports
      assetsInclude: ['**/*.mdx'],
    });
  },
};
export default config;