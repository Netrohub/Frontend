export type SupportedLanguage = 'ar' | 'en';

const DEFAULT_OPTIONS: Intl.DateTimeFormatOptions = {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
};

export const formatLocalizedDate = (
  dateInput: string | number | Date,
  language: SupportedLanguage,
  options: Intl.DateTimeFormatOptions = DEFAULT_OPTIONS
): string => {
  if (!dateInput) return '';

  const date = dateInput instanceof Date ? dateInput : new Date(dateInput);
  if (Number.isNaN(date.getTime())) return '';

  const locale = language === 'ar' ? 'ar-EG' : 'en-US';

  return new Intl.DateTimeFormat(locale, {
    calendar: 'gregory',
    ...options,
  }).format(date);
};

export const formatLocalizedDateTime = (
  dateInput: string | number | Date,
  language: SupportedLanguage,
  options: Intl.DateTimeFormatOptions = {}
): string => {
  const defaults: Intl.DateTimeFormatOptions = {
    ...DEFAULT_OPTIONS,
    hour: '2-digit',
    minute: '2-digit',
  };

  return formatLocalizedDate(dateInput, language, { ...defaults, ...options });
};

