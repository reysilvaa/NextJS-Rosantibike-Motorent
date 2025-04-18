import { Inter } from 'next/font/google';
import localFont from 'next/font/local';

// Konfigurasi font Inter dari Google Fonts
export const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

// Alternatif: Menggunakan font lokal untuk menghindari network request ke Google Fonts
// Gunakan ini jika inter-var.woff2 sudah didownload
export const interLocal = localFont({
  src: '../public/fonts/inter-var.woff2',
  display: 'swap',
  variable: '--font-inter-local',
  preload: true,
});
