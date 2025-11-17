/**
 * Design Tokens
 * Centralized design system tokens for consistent styling across the application
 */

export const designTokens = {
  spacing: {
    xs: '0.5rem',   // 8px
    sm: '0.75rem',  // 12px
    md: '1rem',     // 16px
    lg: '1.5rem',   // 24px
    xl: '2rem',     // 32px
    '2xl': '3rem',  // 48px
    '3xl': '4rem',  // 64px
  },
  typography: {
    h1: 'text-4xl md:text-5xl lg:text-6xl',
    h2: 'text-3xl md:text-4xl lg:text-5xl',
    h3: 'text-2xl md:text-3xl',
    h4: 'text-xl md:text-2xl',
    body: 'text-base',
    small: 'text-sm',
  },
  breakpoints: {
    mobile: '< 768px',
    tablet: '768px - 1024px',
    desktop: '> 1024px',
  },
  touchTarget: {
    min: '44px',
    recommended: '48px',
  },
  card: {
    padding: 'p-4 md:p-6',
    border: 'border-white/10',
    background: 'bg-white/5',
    backdrop: 'backdrop-blur-sm',
  },
  focus: {
    ring: 'focus:ring-2 focus:ring-[hsl(195,80%,70%)] focus:ring-offset-2',
  },
} as const;

/**
 * Spacing Scale Documentation:
 * - Use gap-3 (12px) for small gaps between related items
 * - Use gap-4 (16px) for default gaps between elements
 * - Use gap-6 (24px) for larger gaps between sections
 * - Use py-8 (32px) for section padding
 * - Use py-12 (48px) for large section padding
 * - Use py-16 (64px) for hero sections
 */

