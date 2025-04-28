import createMiddleware from 'next-intl/middleware';

import { defaultLocale, locales } from './i18n/locales';

// Membuat middleware untuk penanganan i18n
export default createMiddleware({
  // Daftar bahasa yang didukung
  locales,
  // Bahasa default
  defaultLocale,
  // Jika pengguna mengunjungi URL tanpa prefix bahasa, deteksi bahasa dari header Accept-Language
  localeDetection: true,
});

// Konfigurasi untuk middleware, menentukan path mana yang harus diproses
export const config = {
  // Cocokkan semua rute yang harus ditangani oleh middleware ini
  // Kecualikan path yang bukan bagian dari aplikasi (api, _next, file statis)
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)'],
}; 