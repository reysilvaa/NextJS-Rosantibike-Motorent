import type React from "react"
import type { Metadata, Viewport } from "next/types"
import { Inter } from "next/font/google"
import "./globals.css"
import Navbar from "@/components/layout/navbar"
import Footer from "@/components/layout/footer"
import { Providers } from "./providers"
import { VideoContextProvider } from "@/contexts/video-context"
import { ThemeProvider } from "@/components/shared/theme/theme-provider"
import { DefaultSeo } from "next-seo"
import { DEFAULT_SEO_CONFIG, getDefaultMetadata, getDefaultViewport } from "@/lib/shared/seo"

const inter = Inter({ subsets: ["latin"] })

export const viewport: Viewport = getDefaultViewport();
export const metadata: Metadata = getDefaultMetadata();

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