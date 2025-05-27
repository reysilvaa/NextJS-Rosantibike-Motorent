'use client';

import { useParams } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';
import { createContext, useEffect, useState } from 'react';

import { defaultLocale, isValidLocale, type Locale } from './locales';
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

export function I18nProvider({
  children,
  initialLocale,
}: {
  children: React.ReactNode;
  initialLocale?: Locale;
}) {
  // Selalu panggil useParams unconditionally, untuk mengikuti aturan React Hooks
  const params = useParams();
  const [locale, setLocale] = useState<Locale>(initialLocale || defaultLocale);
  const [messages, setMessages] = useState<Record<string, any>>({});
  const [isLoaded, setIsLoaded] = useState(false);

  // Inisialisasi bahasa dan terjemahan
  useEffect(() => {
    const initLocale = async () => {
      try {
        // Selalu prioritaskan locale dari URL path terlebih dahulu
        let urlLocale: string | undefined;
        if (params?.locale && typeof params.locale === 'string') {
          urlLocale = params.locale;
        }

        // Gunakan nilai locale dari URL jika valid, atau fallback ke localStorage
        let selectedLocale = initialLocale || defaultLocale;
        if (urlLocale && isValidLocale(urlLocale)) {
          selectedLocale = urlLocale as Locale;

          // Jika locale dari URL berbeda dengan yang di localStorage, perbarui localStorage
          if (typeof window !== 'undefined') {
            const storedLocale = localStorage.getItem(LOCALE_STORAGE_KEY);
            if (storedLocale !== selectedLocale) {
              localStorage.setItem(LOCALE_STORAGE_KEY, selectedLocale);
            }
          }
        } else if (typeof window !== 'undefined') {
          // Hanya gunakan localStorage jika tidak ada URL locale yang valid
          const storedLocale = localStorage.getItem(LOCALE_STORAGE_KEY) as Locale;
          if (storedLocale && isValidLocale(storedLocale)) {
            selectedLocale = storedLocale;
          }
        }

        console.log('Selected locale:', selectedLocale, 'URL locale:', urlLocale);

        // Atur locale dan muat pesan
        setLocale(selectedLocale);

        // Muat semua terjemahan
        const allMessages = await loadAllMessages();
        setMessages(allMessages[selectedLocale] || {});
        setIsLoaded(true);
      } catch (error) {
        console.error('Gagal menginisialisasi locale:', error);
        // Default ke id jika terjadi kesalahan
        setMessages({});
        setIsLoaded(true); // Tetap atur loaded untuk menghindari loading infinite
      }
    };

    initLocale();
  }, [params, initialLocale]);

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
    // Hanya log ke console di development
    if (process.env.NODE_ENV === 'development') {
      console.error('Next-intl error:', error);
    }

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
