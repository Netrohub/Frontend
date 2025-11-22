/**
 * Translates Laravel validation error messages to user-friendly messages
 * Maps Laravel validation keys to our translation keys
 */

export const translateValidationError = (
  errorMessage: string,
  t: (key: string, params?: Record<string, string | number>) => string
): string => {
  // Map Laravel validation keys to our translation keys
  const validationMap: Record<string, string> = {
    'validation.password.symbols': 'auth.passwordSymbols',
    'validation.password.mixed': 'auth.passwordMixed',
    'validation.password.numbers': 'auth.passwordNumbers',
    'validation.password.uncompromised': 'auth.passwordUncompromised',
    'validation.password.min': 'auth.passwordMin',
    'validation.password.confirmed': 'auth.passwordMismatch',
    'validation.email.unique': 'auth.emailExists',
    'validation.email.email': 'auth.invalidEmail',
    'validation.name.required': 'auth.nameRequired',
    'validation.email.required': 'auth.emailRequired',
    'validation.password.required': 'auth.passwordRequired',
  };

  // Handle multiple errors separated by commas
  if (errorMessage.includes(',')) {
    const errors = errorMessage.split(',').map(err => err.trim());
    return errors.map(err => translateSingleError(err, t, validationMap)).join(', ');
  }

  return translateSingleError(errorMessage, t, validationMap);
};

const translateSingleError = (
  errorMessage: string,
  t: (key: string, params?: Record<string, string | number>) => string,
  validationMap: Record<string, string>
): string => {
  // Check if the error message matches any validation key
  for (const [laravelKey, translationKey] of Object.entries(validationMap)) {
    // Check for exact match or if the error message contains the Laravel key
    if (errorMessage === laravelKey || errorMessage.includes(laravelKey)) {
      // Extract count parameter if present (e.g., "validation.password.min:8" or "The password must be at least 8 characters")
      const countMatch = errorMessage.match(/min[:\s]+(\d+)/i) || errorMessage.match(/(\d+)\s+characters?/i);
      if (countMatch && translationKey === 'auth.passwordMin') {
        return t(translationKey, { count: parseInt(countMatch[1]) });
      }
      return t(translationKey);
    }
  }

  // If no mapping found, return the original message
  return errorMessage;
};

