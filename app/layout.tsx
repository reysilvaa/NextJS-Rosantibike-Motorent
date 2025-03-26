import type React from "react"
import type { Metadata } from "next/types"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Providers } from "./providers"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "MotoCruise - Premium Motorcycle Rental",
  description: "Rent premium motorcycles for your adventures",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-black text-white min-h-screen flex flex-col`}>
        <Providers>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
            <Navbar />
            <main className="flex-grow">{children}</main>
            <Footer />
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  )
}



import './globals.css'