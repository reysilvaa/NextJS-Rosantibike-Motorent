'use client';

import { ThemeProvider } from 'next-themes';
import { Toaster } from 'sonner';

import NotificationHandler from '../components/shared/notifications/notification-handler';
import { MotorcycleFilterProvider } from '../contexts/motorcycle-filter-context';
import { SocketProvider } from '../contexts/socket-context';
import { VideoContextProvider } from '../contexts/video-context';
import { I18nProvider } from '../i18n/provider';

// Definisikan default rooms untuk socket.io
const defaultRooms = ['system', 'motorcycles', 'transactions'];

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      <I18nProvider>
        <ThemeProvider attribute="class" defaultTheme="dark">
          <SocketProvider enableNotifications={true} defaultRooms={defaultRooms}>
            <MotorcycleFilterProvider>
              <VideoContextProvider>
                {children}
                <NotificationHandler />
                <Toaster richColors closeButton />
              </VideoContextProvider>
            </MotorcycleFilterProvider>
          </SocketProvider>
        </ThemeProvider>
      </I18nProvider>
    </>
  );
}
