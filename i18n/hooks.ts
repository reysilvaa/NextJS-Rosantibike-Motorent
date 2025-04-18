import { useContext } from 'react';
import { useTranslation as useReactI18nTranslation } from 'react-i18next';

import { languages } from './index';
import { LanguageContext } from './provider';

// Key untuk menyimpan preferensi bahasa di localStorage
const _LANGUAGE_KEY = 'preferred_language';

// Hook untuk menggunakan terjemahan dan fungsi i18n lainnya
export const useTranslation = () => {
  // Gunakan context untuk mengakses bahasa dan fungsi changeLanguage
  const { language, changeLanguage } = useContext(LanguageContext);

  // Gunakan hook useTranslation dari react-i18next untuk mendapatkan fungsi terjemahan
  const { t, i18n } = useReactI18nTranslation();

  return {
    t,
    language,
    changeLanguage,
    languages,
    i18n,
    isReady: true,
  };
};
