/**
 * Helpers for parsing and formatting large numeric values with optional suffixes.
 * Supports compact notations like 1K, 2.5M, 3B and converts Arabic numerals.
 */

const ARABIC_TO_LATIN_DIGITS: Record<string, string> = {
  '٠': '0',
  '١': '1',
  '٢': '2',
  '٣': '3',
  '٤': '4',
  '٥': '5',
  '٦': '6',
  '٧': '7',
  '٨': '8',
  '٩': '9',
};

const SUFFIXES: Array<{ value: number; suffix: 'K' | 'M' | 'B' }> = [
  { value: 1_000_000_000, suffix: 'B' },
  { value: 1_000_000, suffix: 'M' },
  { value: 1_000, suffix: 'K' },
];

const LATIN_DIGITS_REGEX = /[^\d.,]/g;

const normalizeDigits = (value: string): string =>
  value.replace(/[٠-٩]/g, (char) => ARABIC_TO_LATIN_DIGITS[char] ?? char);

const formatWithSuffix = (num: number): string => {
  const absolute = Math.abs(num);

  for (const { value, suffix } of SUFFIXES) {
    if (absolute >= value) {
      const normalized = num / value;
      const formatted =
        Number.isInteger(normalized) || Math.abs(normalized) >= 10
          ? Math.round(normalized).toString()
          : parseFloat(normalized.toFixed(1)).toString();
      return `${formatted}${suffix}`;
    }
  }

  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 0,
  }).format(num);
};

/**
 * Parse a numeric string that may contain a compact suffix (K, M, B) into a number.
 * Returns null if parsing failed.
 */
export const parseNumericWithSuffix = (input: string): number | null => {
  if (!input) return null;

  const normalized = normalizeDigits(input).trim().toUpperCase();
  if (!normalized) return null;

  const suffixMatch = normalized.match(/([+-]?[0-9,.]+)\s*([KMB])$/);
  let multiplier = 1;
  let numericPortion = normalized;

  if (suffixMatch) {
    numericPortion = suffixMatch[1];
    const suffix = suffixMatch[2];
    if (suffix === 'K') multiplier = 1_000;
    if (suffix === 'M') multiplier = 1_000_000;
    if (suffix === 'B') multiplier = 1_000_000_000;
  }

  const cleaned = numericPortion.replace(LATIN_DIGITS_REGEX, '').replace(/,/g, '');
  if (!cleaned) return null;

  const parsed = Number.parseFloat(cleaned);
  if (Number.isNaN(parsed)) return null;

  return parsed * multiplier;
};

/**
 * Format a numeric value or string into a compact representation (e.g. 15M, 2.5K).
 * If the value cannot be parsed, the original trimmed value is returned.
 */
export const formatCompactNumber = (input: number | string): string => {
  if (input === null || input === undefined) return '';

  if (typeof input === 'number' && !Number.isNaN(input)) {
    return formatWithSuffix(input);
  }

  const normalized = normalizeDigits(String(input)).trim();
  if (!normalized) return '';

  const parsed = parseNumericWithSuffix(normalized);
  if (parsed !== null) {
    return formatWithSuffix(parsed);
  }

  // Already compact? Ensure uppercase suffix without trailing spaces.
  if (/^[+-]?\d+(\.\d+)?\s*[KMB]$/i.test(normalized)) {
    return normalized.replace(/\s+/g, '').toUpperCase();
  }

  return normalized;
};

/**
 * Convert a numeric string with optional suffix into a plain number suitable for storage.
 * Returns null when parsing fails.
 */
export const toNumericValue = (input: string): number | null => parseNumericWithSuffix(input);

