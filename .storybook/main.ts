import type { StorybookConfig } from '@storybook/react-vite';
import { mergeConfig } from 'vite';
import path from 'path';

const config: StorybookConfig = {
  "stories": [
    "../src/**/*.mdx",
    "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"
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
      },
      // Optimize dependencies to handle path resolution better
      optimizeDeps: {
        include: ['@storybook/addon-docs'],
        exclude: [],
      },
    });
  },
};
export default config;