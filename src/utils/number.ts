/**
 * The user's locale detected from the browser's DateTimeFormat settings.
 * Used as the default locale for number formatting operations.
 */
const locale = Intl.DateTimeFormat().resolvedOptions().locale;

/**
 * Formats a number according to the user's locale settings.
 *
 * @param num - The number to format
 * @returns The formatted number as a string with locale-appropriate separators
 *
 * @example
 * ```typescript
 * intlNumberFormat(1234.56); // "1,234.56" (en-US) or "1.234,56" (de-DE)
 * ```
 */
export const intlNumberFormat = (num: number) => new Intl.NumberFormat(locale).format(num);
