import './globals.css';

import type { Metadata, Viewport } from 'next/types';
import type React from 'react';

import Footer from '@/components/layout/footer';
import Navbar from '@/components/layout/navbar';
import PWAInstallPrompt from '@/components/shared/pwa/pwa-install-prompt';
import SchemaOrg from '@/components/shared/seo/schema-org';

import { inter } from './fonts';
import { Providers } from './providers';

// Viewport untuk Next.js
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#F97316' },
    { media: '(prefers-color-scheme: dark)', color: '#F97316' },
  ],
};

export const metadata: Metadata = {
  title: 'Rosantibike Motorent | Rental Motor Berkualitas di Malang',
  description: 'Rental motor terpercaya dengan harga terjangkau dan layanan terbaik di Malang',
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
    ],
    apple: { url: '/apple-touch-icon.png', sizes: '180x180' },
    other: [{ rel: 'manifest', url: '/site.webmanifest' }],
  },
  appleWebApp: {
    capable: true,
    title: 'Rosantibike Motorent',
    statusBarStyle: 'default',
  },
  applicationName: 'Rosantibike Motorent',
  formatDetection: {
    telephone: false,
  },
  manifest: '/site.webmanifest',
};

export default function RootLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode;
  params?: { locale?: string };
}>) {
  // Dynamically set the language based on the route or default to 'id'
  const lang = params?.locale || 'id';

  return (
    <html lang={lang} suppressHydrationWarning className={inter.variable}>
      <head>
        {/* Meta tags dasar untuk mobile */}
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Rosantibike Motorent" />
        <meta name="apple-touch-fullscreen" content="yes" />

        {/* Meta tags untuk SEO dan performa */}
        <meta name="theme-color" content="#F97316" />
        <meta name="application-name" content="Rosantibike Motorent" />
        <meta name="msapplication-TileColor" content="#F97316" />
        <meta name="msapplication-tap-highlight" content="no" />
        <meta name="HandheldFriendly" content="true" />

        {/* Canonical URL */}
        <link rel="canonical" href="https://rosantibikemotorent.com" />

        {/* Preconnect untuk meningkatkan performa */}
        <link rel="preconnect" href="https://res.cloudinary.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />

        {/* PWA icons */}
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />

        {/* iOS splash screens yang dioptimalkan, fokus pada device populer */}
        {/* iPhone 5, SE (1st gen) */}
        <link
          rel="apple-touch-startup-image"
          media="(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2)"
          href="/web-app-manifest-512x512.png"
        />
        {/* iPhone 6, 6s, 7, 8, SE (2nd gen) */}
        <link
          rel="apple-touch-startup-image"
          media="(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2)"
          href="/web-app-manifest-512x512.png"
        />
        {/* iPhone X, XS, 11 Pro, 12 mini, 13 mini */}
        <link
          rel="apple-touch-startup-image"
          media="(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3)"
          href="/web-app-manifest-512x512.png"
        />
        {/* iPhone 11, XR */}
        <link
          rel="apple-touch-startup-image"
          media="(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2)"
          href="/web-app-manifest-512x512.png"
        />
        {/* iPhone 11 Pro Max, XS Max */}
        <link
          rel="apple-touch-startup-image"
          media="(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3)"
          href="/web-app-manifest-512x512.png"
        />
        {/* iPhone 12, 12 Pro, 13, 13 Pro, 14 */}
        <link
          rel="apple-touch-startup-image"
          media="(device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3)"
          href="/web-app-manifest-512x512.png"
        />
        {/* iPhone 12 Pro Max, 13 Pro Max, 14 Plus */}
        <link
          rel="apple-touch-startup-image"
          media="(device-width: 428px) and (device-height: 926px) and (-webkit-device-pixel-ratio: 3)"
          href="/web-app-manifest-512x512.png"
        />

        {/* Service Worker Registration yang disederhanakan */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', async function() {
                  try {
                    const registration = await navigator.serviceWorker.register('/sw.js');
                    console.log('SW berhasil terdaftar dengan scope: ', registration.scope);
                    
                    // Deteksi pembaruan
                    registration.addEventListener('updatefound', () => {
                      const newWorker = registration.installing;
                      newWorker.addEventListener('statechange', () => {
                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                          // Hanya tampilkan notifikasi saat tidak di mode seluler/lambat
                          const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
                          if (!connection || (connection.effectiveType !== 'slow-2g' && connection.effectiveType !== '2g')) {
                            if (confirm('Pembaruan baru tersedia! Muat ulang sekarang?')) {
                              window.location.reload();
                            }
                          }
                        }
                      });
                    });
                  } catch (err) {
                    console.log('Pendaftaran SW gagal:', err);
                  }
                  
                  // Deteksi kondisi offline sesuai realcase
                  window.addEventListener('online', () => {
                    // Hanya perbarui UI jika pengguna benar-benar melihat halaman
                    if (document.visibilityState === 'visible') {
                      // Tambahkan toast notifikasi jika tersedia
                      if (window.showToast) {
                        window.showToast('Anda kembali online', 'success');
                      }
                    }
                  });
                  
                  window.addEventListener('offline', () => {
                    if (document.visibilityState === 'visible') {
                      if (window.showToast) {
                        window.showToast('Anda offline, beberapa fitur mungkin tidak tersedia', 'warning');
                      }
                    }
                  });
                });
              }
            `,
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col antialiased font-sans">
        <Providers locale={lang}>
          <SchemaOrg />
          <Navbar />
          <main className="flex-grow">{children}</main>
          <Footer />
          <PWAInstallPrompt />
        </Providers>
      </body>
    </html>
  );
}
