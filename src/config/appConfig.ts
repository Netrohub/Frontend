/**
 * Application configuration
 * Centralized configuration for app-wide settings
 */

/**
 * Discord community configuration
 */
export const DISCORD_CONFIG = {
  /**
   * Discord server invite URL
   * Set via environment variable VITE_DISCORD_INVITE_URL
   * Falls back to default if not set
   */
  inviteUrl: import.meta.env.VITE_DISCORD_INVITE_URL || 'https://discord.gg/wMnKRSCUVz',
  
  /**
   * Enable/disable Discord CTA features
   * Set via environment variable VITE_ENABLE_DISCORD_CTA
   * Defaults to true if not set
   */
  enabled: import.meta.env.VITE_ENABLE_DISCORD_CTA !== 'false',
} as const;

/**
 * Get Discord invite URL
 * Returns null if Discord is disabled
 */
export function getDiscordInviteUrl(): string | null {
  if (!DISCORD_CONFIG.enabled) {
    return null;
  }
  return DISCORD_CONFIG.inviteUrl;
}

/**
 * Check if Discord CTA is enabled
 */
export function isDiscordCtaEnabled(): boolean {
  return DISCORD_CONFIG.enabled;
}

