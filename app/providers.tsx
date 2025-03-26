"use client"

import { ThemeProvider } from "next-themes"
import { SocketProvider } from "../contexts/socket-context"
import { AuthProvider } from "../hooks/use-auth"
import NotificationHandler from "../components/shared/notification-handler"
import { Toaster } from "sonner"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ThemeProvider attribute="class" defaultTheme="dark">
        <AuthProvider>
          <SocketProvider enableNotifications={true}>
            {children}
            <NotificationHandler />
            <Toaster richColors closeButton />
          </SocketProvider>
        </AuthProvider>
      </ThemeProvider>
    </>
  )
}

