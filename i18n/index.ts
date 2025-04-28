// Re-export dari file locales
export { defaultLocale, localeNames, locales, type Locale } from './locales';

// Re-export dari file messages
export { getMessages, loadAllMessages } from './messages';

// Re-export dari file provider
export { I18nProvider, LocaleContext } from './provider';

// Re-export dari file hooks
export { useAppTranslations } from './hooks';

// Export fungsi utility
export function localizedPathname(
  pathname: string,
  locale: string
): string {
  // Jika pathname sudah dimulai dengan locale, ganti dengan locale baru
  const pathSegments = pathname.split('/');
  const currentLocaleSegment = pathSegments[1];

  // Periksa apakah segmen pertama adalah locale yang valid
  if (currentLocaleSegment === 'id' || currentLocaleSegment === 'en') {
    pathSegments[1] = locale;
    return pathSegments.join('/');
  }

  // Jika tidak dimulai dengan locale, tambahkan locale ke awal path
  return `/${locale}${pathname === '/' ? '' : pathname}`;
}
