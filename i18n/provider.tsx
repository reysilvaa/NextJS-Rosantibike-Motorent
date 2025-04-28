'use client';

import { NextIntlClientProvider } from 'next-intl';
import { createContext, useEffect, useState } from 'react';

import { defaultLocale, type Locale } from './locales';
import { loadAllMessages, messagesCache } from './messages';

// Context untuk penyedia bahasa
export const LocaleContext = createContext<{
  locale: Locale;
  changeLocale: (lang: Locale) => void;
}>({
  locale: defaultLocale,
  changeLocale: () => {},
});

// Kunci untuk menyimpan preferensi bahasa di localStorage
const LOCALE_STORAGE_KEY = 'preferred_language';

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState<Locale>(defaultLocale);
  const [messages, setMessages] = useState<Record<string, any>>({});
  const [isLoaded, setIsLoaded] = useState(false);

  // Inisialisasi bahasa dan terjemahan
  useEffect(() => {
    const initLocale = async () => {
      try {
        // Dapatkan bahasa dari localStorage jika tersedia
        let savedLocale = defaultLocale;
        if (typeof window !== 'undefined') {
          const storedLocale = localStorage.getItem(LOCALE_STORAGE_KEY) as Locale;
          if (storedLocale && (storedLocale === 'id' || storedLocale === 'en')) {
            savedLocale = storedLocale;
          }
        }

        // Atur locale
        setLocale(savedLocale);

        // Muat semua terjemahan
        const allMessages = await loadAllMessages();
        setMessages(allMessages[savedLocale] || {});
        setIsLoaded(true);
      } catch (error) {
        console.error('Gagal menginisialisasi locale:', error);
        // Default ke id jika terjadi kesalahan
        setMessages({}); 
        setIsLoaded(true); // Tetap atur loaded untuk menghindari loading infinite
      }
    };

    initLocale();
  }, []);

  // Fungsi untuk mengganti bahasa
  const changeLocale = async (newLocale: Locale) => {
    try {
      // Hanya proses jika berbeda dari bahasa saat ini
      if (newLocale !== locale) {
        // Simpan preferensi bahasa di localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem(LOCALE_STORAGE_KEY, newLocale);
        }

        // Periksa apakah pesan sudah di-cache
        if (Object.keys(messagesCache[newLocale]).length === 0) {
          try {
            // Jika belum ada di cache, muat pesan untuk locale tersebut
            const newMessages = await import(`./locales/${newLocale}.json`);
            messagesCache[newLocale] = newMessages.default || newMessages;
          } catch (error) {
            console.error(`Gagal memuat pesan untuk bahasa ${newLocale}:`, error);
            messagesCache[newLocale] = {}; // Fallback ke objek kosong
          }
        }

        // Perbarui state
        setMessages(messagesCache[newLocale] || {});
        setLocale(newLocale);
      }
    } catch (error) {
      console.error(`Gagal mengubah bahasa ke ${newLocale}:`, error);
      // Jangan ubah state jika terjadi kesalahan
    }
  };

  // Tambahkan error handler untuk next-intl
  const handleError = (error: Error) => {
    console.error('Next-intl error:', error);
    // Biarkan aplikasi tetap berjalan meskipun ada error
    return null;
  };

  if (!isLoaded) {
    return null; // Atau tampilkan loading state
  }

  return (
    <LocaleContext.Provider value={{ locale, changeLocale }}>
      <NextIntlClientProvider 
        locale={locale} 
        messages={messages}
        onError={handleError}
        timeZone="Asia/Jakarta"
      >
        {children}
      </NextIntlClientProvider>
    </LocaleContext.Provider>
  );
}
