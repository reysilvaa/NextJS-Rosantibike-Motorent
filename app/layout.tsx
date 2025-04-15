import type React from "react"
import type { Metadata, Viewport } from "next/types"
import { Inter } from "next/font/google"
import "./globals.css"
import Navbar from "@/components/layout/navbar"
import Footer from "@/components/layout/footer"
import { Providers } from "./providers"
import { VideoContextProvider } from "@/contexts/video-context"
import { ThemeProvider } from "@/components/shared/theme/theme-provider"

const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap',
  preload: true,
})

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
    <html lang="id" suppressHydrationWarning>
      <head>
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Rosantibike Motorent" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Rosantibike Motorent" />
        <meta name="apple-touch-fullscreen" content="yes" />
        <meta name="apple-mobile-web-app-orientations" content="portrait" />
        
        <link rel="preconnect" href={process.env.NEXT_PUBLIC_WS_URL || ''} />
        
        <link rel="preload" href="/logo/logo.svg" as="image" type="image/svg+xml" />
        
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
      <body className={`${inter.className} min-h-screen flex flex-col antialiased`}>
        <Providers>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <VideoContextProvider
              autoPlay={true}
              muted={true}
              loop={true}
              playWhenVisible={true}
              playWhenSocketConnected={false}
              slideDuration={5000}
            >
              <Navbar />
              <main className="flex-grow">{children}</main>
              <Footer />
            </VideoContextProvider>
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  )
}