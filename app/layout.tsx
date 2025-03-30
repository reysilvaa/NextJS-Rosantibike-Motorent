import type React from "react"
import type { Metadata } from "next/types"
import { Inter } from "next/font/google"
import "./_styles/globals.css"
import Navbar from "@/components/layout/navbar"
import Footer from "@/components/layout/footer"
import { Providers } from "./_lib/providers"

// Optimize font loading dengan display: swap
const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap', 
  preload: true
})

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

// Tambahkan optimasi dengan prefetch dan preload
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <head>
        {/* Preload critical CSS */}
        <link
          rel="preload"
          href="/_next/static/css/app/layout.css"
          as="style"
        />
        {/* Preconnect untuk domain eksternal */}
        <link rel="preconnect" href="https://res.cloudinary.com" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
      </head>
      <body className={inter.className}>
        <Providers>
          <Navbar />
          <main className="min-h-screen pt-16">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  )
}