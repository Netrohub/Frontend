/**
 * Application-wide constants
 * Centralized location for magic numbers and strings
 */

// API Configuration
export const API_TIMEOUT = 30000; // 30 seconds in milliseconds

// Price Filter Thresholds (SAR)
export const PRICE_THRESHOLDS = {
  LOW_MAX: 500,
  MID_MIN: 500,
  MID_MAX: 1500,
  HIGH_MIN: 1500,
} as const;

// Animation Configuration
export const ANIMATION_CONFIG = {
  SNOW_PARTICLES_COUNT: 50,
  SNOW_FALL_DURATION_MIN: 10, // seconds
  SNOW_FALL_DURATION_MAX: 30, // seconds
  SNOW_DELAY_MAX: 5, // seconds
} as const;

// Pagination
export const DEFAULT_PAGE_SIZE = 20;

// Escrow Hold Duration (hours)
export const ESCROW_HOLD_HOURS = 12;

// Validation Rules
export const VALIDATION_RULES = {
  PASSWORD_MIN_LENGTH: 8,
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 100,
  EMAIL_MAX_LENGTH: 255,
  PHONE_MAX_LENGTH: 20,
} as const;

// React Query Cache Times (milliseconds)
export const CACHE_TIMES = {
  STALE_TIME: 5 * 60 * 1000, // 5 minutes
  CACHE_TIME: 10 * 60 * 1000, // 10 minutes
} as const;

