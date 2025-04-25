import './globals.css';

import type { Metadata, Viewport } from 'next/types';
import type React from 'react';

import Footer from '@/components/layout/footer';
import Navbar from '@/components/layout/navbar';
import SchemaOrg from '@/components/shared/seo/schema-org';
import PWAInstallPrompt from '@/components/shared/pwa/pwa-install-prompt';

import { inter } from './fonts';
import { metadata as seoMetadata } from './metadata';
import { Providers } from './providers';

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
  ...seoMetadata,
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
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning className={inter.variable}>
      <head>
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Rosantibike Motorent" />
        <meta name="apple-touch-fullscreen" content="yes" />
        <meta name="apple-mobile-web-app-orientations" content="portrait" />
        <meta
          name="description"
          content="Rosantibike Motorent menyediakan layanan rental motor premium di Malang dengan harga terjangkau. Motor berkualitas untuk petualangan Anda di seluruh kota Malang."
        />


        <link
          rel="canonical"
          href="https://rosantibikemotorent.com"
        />

        {/* Preconnect dan DNS prefetch untuk optimasi */}
        <link
          rel="preconnect"
          href={process.env.NEXT_PUBLIC_WS_URL || ''}
          crossOrigin="anonymous"
        />
        <link rel="dns-prefetch" href={process.env.NEXT_PUBLIC_WS_URL || ''} />
        <link rel="preconnect" href="https://res.cloudinary.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />

        {/* PWA Apple touch icons */}
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="apple-touch-startup-image" href="/apple-touch-icon.png" />
        
        {/* Service Worker Registration - Menggunakan event listener untuk tidak blocking */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').then(
                    function(registration) {
                      console.log('ServiceWorker registration successful with scope: ', registration.scope);
                      
                      // Cek pembaruan Service Worker
                      registration.addEventListener('updatefound', () => {
                        const newWorker = registration.installing;
                        newWorker.addEventListener('statechange', () => {
                          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            // Beritahu pengguna bahwa ada update baru
                            if (confirm('Pembaruan baru tersedia! Muat ulang sekarang?')) {
                              window.location.reload();
                            }
                          }
                        });
                      });
                    },
                    function(err) {
                      console.log('ServiceWorker registration failed: ', err);
                    }
                  );
                  
                  // Penanganan Service Worker jika sudah teregistrasi
                  navigator.serviceWorker.ready.then(registration => {
                    console.log('Service Worker ready');
                  });
                });
                
                // Terima pesan dari Service Worker
                navigator.serviceWorker.addEventListener('message', event => {
                  if (event.data && event.data.type === 'RELOAD_PAGE') {
                    window.location.reload();
                  }
                });
                
                // Deteksi kendala koneksi
                window.addEventListener('online', () => {
                  console.log('Aplikasi kembali online');
                  // Tambahkan notifikasi bahwa aplikasi kembali online jika diperlukan
                });
                
                window.addEventListener('offline', () => {
                  console.log('Aplikasi offline');
                  // Tambahkan notifikasi bahwa aplikasi offline jika diperlukan
                });
              }
            `,
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col antialiased font-sans">
        <Providers>
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
