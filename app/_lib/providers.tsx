"use client"

import { ThemeProvider } from "next-themes"
import { SocketProvider } from "@/hooks/context/use-socket-provider"
import { AuthProvider } from "@/hooks/context/use-auth-provider"
import NotificationHandler from "@/components/shared/notification-handler"
import { Toaster } from "sonner"
import { I18nProvider } from "@/i18n/provider"
import { VideoProvider } from "@/hooks/context/use-video-provider"
import { MotorcycleFilterProvider } from "@/hooks/context/use-motorcycle-filter-provider"

// Definisikan default rooms untuk socket.io
const defaultRooms = ['system', 'motorcycles', 'transactions'];

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      <I18nProvider>
        <ThemeProvider attribute="class" defaultTheme="dark">
          <AuthProvider>
            <SocketProvider defaultRooms={defaultRooms}>
              <MotorcycleFilterProvider>
                <VideoProvider>
                  {children}
                  <NotificationHandler />
                  <Toaster richColors closeButton />
                </VideoProvider>
              </MotorcycleFilterProvider>
            </SocketProvider>
          </AuthProvider>
        </ThemeProvider>
      </I18nProvider>
    </>
  )
}

