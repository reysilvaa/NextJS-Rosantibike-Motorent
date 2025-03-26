import { createInstance } from 'i18next';
import { initReactI18next } from 'react-i18next';

// Daftar bahasa yang didukung
export const languages = ['id', 'en'] as const;
export type Language = typeof languages[number];

// Konfigurasi i18n default
export const defaultLanguage: Language = 'id';

// Cache untuk menyimpan terjemahan
const translationCache: Record<string, Record<string, any>> = {
  id: {},
  en: {}
};

// Memuat resource dari file statis
const loadResources = async () => {
  try {
    // Muat semua terjemahan sekaligus
    const idModule = await import('./locales/id.json');
    const enModule = await import('./locales/en.json');
    
    translationCache.id = idModule.default || idModule;
    translationCache.en = enModule.default || enModule;
    
    return {
      id: translationCache.id,
      en: translationCache.en
    };
  } catch (error) {
    console.error(`Gagal memuat terjemahan:`, error);
    return {
      id: {},
      en: {}
    };
  }
};

// Fungsi untuk membuat instance i18n yang digunakan di server dan client
export const createI18nInstance = async (initialLanguage: Language) => {
  // Muat semua resource terjemahan
  const translations = await loadResources();
  
  // Buat instance i18n baru
  const i18nInstance = createInstance();
  
  // Konfigurasi resource dengan semua bahasa yang tersedia
  const resources = {
    id: {
      translation: translations.id
    },
    en: {
      translation: translations.en
    }
  };
  
  // Inisialisasi i18n instance
  await i18nInstance
    .use(initReactI18next)
    .init({
      // Bahasa saat ini
      lng: initialLanguage,
      // Bahasa fallback jika terjemahan tidak ditemukan
      fallbackLng: defaultLanguage,
      // Debug mode (dinonaktifkan di production)
      debug: false,
      // Resources yang sudah dimuat (semua bahasa)
      resources,
      interpolation: {
        // Hindari konflik dengan ekspresi JSX
        escapeValue: false,
      },
      // Menyederhanakan penggunaan tanpa namespace
      defaultNS: 'translation',
      fallbackNS: 'translation',
      react: {
        useSuspense: false, // Penting agar tidak ada loading state
      }
    });

  return i18nInstance;
};

// Mendapatkan terjemahan dari server side
export const getTranslation = async (language: Language) => {
  if (Object.keys(translationCache[language]).length === 0) {
    await loadResources();
  }
  return translationCache[language];
}; 