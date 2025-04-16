import type React from "react"
import type { Metadata, Viewport } from "next/types"
import "./globals.css"
import Navbar from "@/components/layout/navbar"
import Footer from "@/components/layout/footer"
import { Providers } from "./providers"
import { inter } from "./fonts"
import { metadata as seoMetadata } from './metadata'

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" }
  ],
}

export const metadata: Metadata = {
  ...seoMetadata,
  title: "Rosantibike Motorent",
  description: "Rental motor terpercaya dengan harga terjangkau dan layanan terbaik di Malang",
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png' }
    ],
    apple: { url: '/apple-touch-icon.png', sizes: '180x180' },
    other: [
      { rel: 'manifest', url: '/site.webmanifest' }
    ]
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
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
        <meta name="description" content="Rental motor terpercaya dengan harga terjangkau dan layanan terbaik di Malang" />
        
        {/* Preconnect dan DNS prefetch untuk optimasi */}
        <link rel="preconnect" href={process.env.NEXT_PUBLIC_WS_URL || ''} crossOrigin="anonymous" />
        <link rel="dns-prefetch" href={process.env.NEXT_PUBLIC_WS_URL || ''} />
        <link rel="preconnect" href="https://res.cloudinary.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
        
        {/* Preload critical resources */}
        <link rel="preload" href="/logo/logo1.svg" as="image" type="image/svg+xml" />
        <link rel="preload" href="/logo/logo2.svg" as="image" type="image/svg+xml" />
        
        {/* Service Worker Registration - Menggunakan event listener untuk tidak blocking */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').then(
                    function(registration) {
                      console.log('ServiceWorker registration successful with scope: ', registration.scope);
                    },
                    function(err) {
                      console.log('ServiceWorker registration failed: ', err);
                    }
                  );
                });
              }
            `,
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col antialiased font-sans">
        <Providers>
          <Navbar />
          <main className="flex-grow">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  )
}