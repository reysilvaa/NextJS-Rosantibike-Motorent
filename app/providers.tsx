"use client"

import { ThemeProvider } from "next-themes"
import { SocketProvider } from "../contexts/socket-context"
import { AuthProvider } from "../hooks/use-auth"
import NotificationHandler from "../components/shared/notification-handler"
import { Toaster } from "sonner"
import { I18nProvider } from "../i18n/provider"
import { VideoContextProvider } from "../contexts/video-context"

export function Providers({ children }: { children: React.ReactNode }) {
  // Definisikan default rooms untuk socket.io
  const defaultRooms = ['public'];
  
  return (
    <>
      <I18nProvider>
        <ThemeProvider attribute="class" defaultTheme="dark">
          <AuthProvider>
            <SocketProvider enableNotifications={true} defaultRooms={defaultRooms}>
              <VideoContextProvider>
                {children}
                <NotificationHandler />
                <Toaster richColors closeButton />
              </VideoContextProvider>
            </SocketProvider>
          </AuthProvider>
        </ThemeProvider>
      </I18nProvider>
    </>
  )
}

