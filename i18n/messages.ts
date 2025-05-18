import type { Locale } from './locales';

// Fungsi untuk memuat pesan terjemahan berdasarkan locale
export async function getMessages(locale: Locale) {
  try {
    // Muat file terjemahan sesuai dengan locale yang diminta
    const messages = (await import(`./locales/${locale}.json`)).default;
    return messages;
  } catch (error) {
    console.error(`Gagal memuat terjemahan untuk locale "${locale}":`, error);
    return {};
  }
}

// Cache terjemahan untuk penggunaan di sisi klien
export const messagesCache: Record<string, any> = {
  id: {},
  en: {},
  jv: {},
};

// Memuat semua terjemahan sekaligus (berguna untuk preloading)
export async function loadAllMessages() {
  try {
    const idModule = await import('./locales/id.json');
    const enModule = await import('./locales/en.json');
    const jvModule = await import('./locales/jv.json');

    messagesCache.id = idModule.default || idModule;
    messagesCache.en = enModule.default || enModule;
    messagesCache.jv = jvModule.default || jvModule;

    return {
      id: messagesCache.id,
      en: messagesCache.en,
      jv: messagesCache.jv,
    };
  } catch (error) {
    console.error('Gagal memuat semua terjemahan:', error);
    return {
      id: {},
      en: {},
      jv: {},
    };
  }
}
