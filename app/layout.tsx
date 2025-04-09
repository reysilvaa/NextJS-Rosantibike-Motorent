import type React from "react"
import type { Metadata } from "next/types"
import { Inter } from "next/font/google"
import "./globals.css"
import Navbar from "@/components/layout/navbar"
import Footer from "@/components/layout/footer"
import { Providers } from "./providers"
import { VideoContextProvider } from "@/contexts/video-context"
import { ThemeProvider } from "@/components/shared/theme/theme-provider"
import { DefaultSeo } from "next-seo"
import { DEFAULT_SEO_CONFIG } from "@/lib/seo"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Rosantibike Motorent",
  description: "Rental motor terpercaya dengan harga terjangkau dan layanan terbaik di Malang",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" }
  ],
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
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://rosantibike.com',
    languages: {
      'id-ID': 'https://rosantibike.com',
    },
  },
  verification: {
    google: 'your-google-site-verification-code', // Replace with your verification code
  },
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
      </head>
      <body className={`${inter.className} min-h-screen flex flex-col antialiased`}>
        <DefaultSeo {...DEFAULT_SEO_CONFIG} />
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