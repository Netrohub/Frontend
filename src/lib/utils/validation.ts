/**
 * Input validation and sanitization utilities
 * Provides client-side validation before API submission
 */

/**
 * Sanitizes string input by removing potentially dangerous characters
 * Basic XSS prevention for text inputs
 */
export function sanitizeString(input: string): string {
  if (typeof input !== 'string') {
    return '';
  }

  // Remove HTML tags
  return input
    .replace(/<[^>]*>/g, '')
    .replace(/&[^;]+;/g, '')
    .trim();
}

/**
 * Validates email format
 */
export function isValidEmail(email: string): boolean {
  if (!email || typeof email !== 'string') {
    return false;
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}

/**
 * Validates phone number (Saudi format)
 */
export function isValidPhone(phone: string): boolean {
  if (!phone || typeof phone !== 'string') {
    return false;
  }
  // Saudi phone: starts with +966 or 05, followed by 8 digits
  const phoneRegex = /^(\+966|0)?5\d{8}$/;
  return phoneRegex.test(phone.replace(/\s+/g, ''));
}

/**
 * Validates password strength
 */
export function isValidPassword(password: string): boolean {
  if (!password || typeof password !== 'string') {
    return false;
  }
  // At least 8 characters
  return password.length >= 8;
}

/**
 * Sanitizes form data object
 */
export function sanitizeFormData<T extends Record<string, unknown>>(
  data: T
): T {
  const sanitized = { ...data };

  for (const key in sanitized) {
    if (typeof sanitized[key] === 'string') {
      sanitized[key] = sanitizeString(sanitized[key] as string) as T[Extract<keyof T, string>];
    } else if (Array.isArray(sanitized[key])) {
      sanitized[key] = (sanitized[key] as unknown[]).map((item) =>
        typeof item === 'string' ? sanitizeString(item) : item
      ) as T[Extract<keyof T, string>];
    }
  }

  return sanitized;
}

/**
 * Validates numeric input
 */
export function isValidNumber(value: string | number, min?: number, max?: number): boolean {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  
  if (isNaN(num)) {
    return false;
  }

  if (min !== undefined && num < min) {
    return false;
  }

  if (max !== undefined && num > max) {
    return false;
  }

  return true;
}

