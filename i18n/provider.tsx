'use client';

import i18next from 'i18next';
import { createContext, useEffect, useState } from 'react';
import { I18nextProvider, initReactI18next } from 'react-i18next';

import { defaultLanguage, Language, languages } from './index';

// Context untuk penyedia bahasa
export const LanguageContext = createContext<{
  language: Language;
  changeLanguage: (lang: Language) => void;
}>({
  language: defaultLanguage,
  changeLanguage: () => {},
});

// Inisialisasi i18next di luar komponen untuk menghindari reinisialisasi
const i18n = i18next.createInstance();

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>(defaultLanguage);
  const [isInitialized, setIsInitialized] = useState(false);

  // Fungsi untuk memuat terjemahan
  const loadTranslations = async () => {
    try {
      const idModule = await import('./locales/id.json');
      const enModule = await import('./locales/en.json');

      await i18n.use(initReactI18next).init({
        lng: language,
        fallbackLng: defaultLanguage,
        resources: {
          id: { translation: idModule.default || idModule },
          en: { translation: enModule.default || enModule },
        },
        interpolation: {
          escapeValue: false,
        },
        react: {
          useSuspense: false,
        },
      });

      setIsInitialized(true);
    } catch (error) {
      console.error('Gagal menginisialisasi i18n:', error);
    }
  };

  // Inisialisasi bahasa dari localStorage dan i18n instance
  useEffect(() => {
    // Dapatkan bahasa dari localStorage jika tersedia
    if (typeof window !== 'undefined') {
      const savedLanguage = localStorage.getItem('preferred_language') as Language;
      if (savedLanguage && languages.includes(savedLanguage as any)) {
        setLanguage(savedLanguage);
      }
    }

    // Muat terjemahan
    loadTranslations();
  }, []);

  // Effect untuk mengubah bahasa saat state language berubah (setelah inisialisasi)
  useEffect(() => {
    if (isInitialized && i18n.language !== language) {
      i18n.changeLanguage(language);
    }
  }, [language, isInitialized]);

  // Fungsi untuk mengganti bahasa
  const changeLanguage = (lang: Language) => {
    // Hanya proses jika berbeda dari bahasa saat ini
    if (lang !== language) {
      // Simpan preferensi bahasa di localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('preferred_language', lang);
      }

      // Perbarui state
      setLanguage(lang);
    }
  };

  if (!isInitialized) {
    return null; // Atau tampilkan loading state
  }

  return (
    <LanguageContext.Provider value={{ language, changeLanguage }}>
      <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
    </LanguageContext.Provider>
  );
}
