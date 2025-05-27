import { useTranslations } from 'next-intl';
import { useContext } from 'react';

import { locales } from './locales';
import { LocaleContext } from './provider';

// Key untuk menyimpan preferensi bahasa di localStorage
const _LANGUAGE_KEY = 'preferred_language';

// Hook untuk menggunakan terjemahan dan fungsi i18n lainnya
export const useAppTranslations = () => {
  // Gunakan context untuk mengakses bahasa dan fungsi changeLocale
  const { locale, changeLocale } = useContext(LocaleContext);

  // Gunakan hook useTranslations dari next-intl untuk mendapatkan fungsi terjemahan
  const t = useTranslations();

  return {
    t,
    locale,
    changeLocale,
    locales,
    isReady: true,
  };
};

// Fungsi untuk kompatibilitas dengan kode lama
export function useTranslation() {
  return useAppTranslations();
}
