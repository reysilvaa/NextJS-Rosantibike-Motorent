"use client"

import { Suspense, lazy, useEffect, useState } from "react"
import { ThemeProvider } from "next-themes"
import { SocketProvider } from "@/hooks/context/use-socket-provider"
import { AuthProvider } from "@/hooks/context/use-auth-provider"
import { Toaster } from "sonner"
import { I18nProvider } from "@/i18n/provider"
import { MotorcycleFilterProvider } from "@/hooks/context/use-motorcycle-filter-provider"
import ErrorBoundary from "@/components/shared/error-boundary"

// Lazy load komponen yang kurang kritis
const VideoProvider = lazy(() => import("@/hooks/context/use-video-provider").then((mod) => ({ default: mod.VideoProvider })))
const NotificationHandler = lazy(() => import("@/components/shared/notification-handler"))

// Definisikan default rooms untuk socket.io
const defaultRooms = ['system', 'motorcycles', 'transactions'];

// Fallback sederhana untuk lazy-loaded components
const SimpleFallback = () => null;

export function Providers({ children }: { children: React.ReactNode }) {
  // State untuk mengontrol pemuatan komponen berat
  const [loadDelayedComponents, setLoadDelayedComponents] = useState(false);
  
  useEffect(() => {
    // Delay pemuatan komponen berat setelah halaman utama dimuat
    const timer = setTimeout(() => {
      setLoadDelayedComponents(true);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <ErrorBoundary>
      <I18nProvider>
        <ThemeProvider attribute="class" defaultTheme="dark">
          <ErrorBoundary>
            <AuthProvider>
              <ErrorBoundary>
                <SocketProvider defaultRooms={defaultRooms}>
                  <ErrorBoundary>
                    <MotorcycleFilterProvider>
                      <ErrorBoundary>
                        <Suspense fallback={<SimpleFallback />}>
                          {loadDelayedComponents ? (
                            <VideoProvider>
                              {children}
                              <Suspense fallback={<SimpleFallback />}>
                                <NotificationHandler />
                              </Suspense>
                              <Toaster richColors closeButton />
                            </VideoProvider>
                          ) : (
                            <>
                              {children}
                              <Toaster richColors closeButton />
                            </>
                          )}
                        </Suspense>
                      </ErrorBoundary>
                    </MotorcycleFilterProvider>
                  </ErrorBoundary>
                </SocketProvider>
              </ErrorBoundary>
            </AuthProvider>
          </ErrorBoundary>
        </ThemeProvider>
      </I18nProvider>
    </ErrorBoundary>
  )
}

