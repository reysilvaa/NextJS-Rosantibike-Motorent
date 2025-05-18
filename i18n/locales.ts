export const locales = ['id', 'en', 'jv'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'id';

// Nama bahasa dalam bahasa lokal mereka sendiri
export const localeNames: Record<Locale, string> = {
  id: 'Bahasa Indonesia',
  en: 'English',
  jv: 'Basa Jawa',
};

export function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale);
}
