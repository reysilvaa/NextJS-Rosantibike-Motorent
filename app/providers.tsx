'use client';

import { useParams } from 'next/navigation';
import { ThemeProvider } from 'next-themes';
import { Toaster } from 'sonner';

import NotificationHandler from '../components/shared/notifications/notification-handler';
import { MotorcycleFilterProvider } from '../contexts/motorcycle-filter-context';
import { SocketProvider } from '../contexts/socket-context';
import { VideoContextProvider } from '../contexts/video-context';
import { defaultLocale, isValidLocale, type Locale } from '../i18n/locales';
import { I18nProvider } from '../i18n/provider';

// Definisikan default rooms untuk socket.io
const defaultRooms = ['system', 'motorcycles', 'transactions'];

// Komponen provider utama untuk client-side
export function Providers({
  children,
  locale: initialLocaleFromProps,
}: {
  children: React.ReactNode;
  locale?: string;
}) {
  // Selalu panggil useParams di awal, tidak secara kondisional
  const params = useParams();

  // Tentukan locale berdasarkan prioritas
  let initialLocale = defaultLocale;

  // 1. Gunakan locale dari props jika ada dan valid
  if (initialLocaleFromProps && isValidLocale(initialLocaleFromProps as Locale)) {
    initialLocale = initialLocaleFromProps as Locale;
  }
  // 2. Gunakan locale dari URL params jika ada dan valid
  else if (
    params?.locale &&
    typeof params.locale === 'string' &&
    isValidLocale(params.locale as Locale)
  ) {
    initialLocale = params.locale as Locale;
  }

  return (
    <>
      <I18nProvider initialLocale={initialLocale}>
        <ThemeProvider attribute="class" defaultTheme="dark">
          <SocketProvider enableNotifications={true} defaultRooms={defaultRooms}>
            <MotorcycleFilterProvider>
              <VideoContextProvider>
                {children}
                <NotificationHandler />
                <Toaster richColors closeButton />
              </VideoContextProvider>
            </MotorcycleFilterProvider>
          </SocketProvider>
        </ThemeProvider>
      </I18nProvider>
    </>
  );
}
