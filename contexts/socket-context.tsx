"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Socket } from 'socket.io-client';
import { toast } from 'sonner';
import { 
  getSocket, 
  joinRoom, 
  leaveRoom, 
  emitEvent,
  listenEvent, 
  disconnect,
  SocketEvents as SocketEventsType
} from '../lib/sockets/socket';

// Interface untuk nilai context
interface SocketContextValue {
  socket: Socket | null;
  isConnected: boolean;
  joinRoom: (room: string) => void;
  leaveRoom: (room: string) => void;
  emit: (event: string, data: any) => void;
  listen: (event: string, callback: (data: any) => void) => () => void;
  reconnect: () => void;
}

// Buat context dengan nilai default
const SocketContext = createContext<SocketContextValue>({
  socket: null,
  isConnected: false,
  joinRoom: () => {},
  leaveRoom: () => {},
  emit: () => {},
  listen: () => () => {},
  reconnect: () => {},
});

// Props untuk provider
interface SocketProviderProps {
  children: ReactNode;
  enableNotifications?: boolean;
  defaultRooms?: string[];
}

// Provider component
export const SocketProvider: React.FC<SocketProviderProps> = ({ 
  children, 
  enableNotifications = true,
  defaultRooms = []
}) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  // Initialize socket connection
  useEffect(() => {
    const socketInstance = getSocket();
    setSocket(socketInstance);
    
    const handleConnect = () => {
      setIsConnected(true);
      if (enableNotifications) {
        toast.success('Koneksi server berhasil', {
          id: 'socket-connected',
          duration: 2000,
        });
      }
      
      // Join default rooms
      defaultRooms.forEach(room => joinRoom(room));
    };
    
    const handleDisconnect = (reason: string) => {
      setIsConnected(false);
      
      if (enableNotifications) {
        const messages: Record<string, string> = {
          'io server disconnect': 'Terputus oleh server, mencoba menghubungkan kembali...',
          'io client disconnect': 'Koneksi diputus',
          'ping timeout': 'Timeout koneksi server, mencoba menghubungkan kembali...',
          'transport close': 'Koneksi tertutup, mencoba menghubungkan kembali...',
          'transport error': 'Error jaringan, mencoba menghubungkan kembali...'
        };
        
        const message = messages[reason] || `Koneksi terputus: ${reason}`;
        toast.error(message, {
          id: 'socket-disconnected',
          duration: 5000,
        });
      }
    };
    
    const handleError = (error: Error) => {
      console.error('Socket error:', error);
      if (enableNotifications) {
        toast.error(`Error koneksi: ${error.message}`, {
          id: 'socket-error',
          duration: 5000,
        });
      }
    };
    
    if (socketInstance) {
      socketInstance.on('connect', handleConnect);
      socketInstance.on('disconnect', handleDisconnect);
      socketInstance.on('error', handleError);
      socketInstance.on('connect_error', handleError);
      
      // Setup ping/pong heartbeat
      socketInstance.on('ping', () => {
        socketInstance.emit('pong', { timestamp: new Date().toISOString() });
      });
      
      // Set initial state
      setIsConnected(socketInstance.connected);
    }
    
    return () => {
      if (socketInstance) {
        socketInstance.off('connect', handleConnect);
        socketInstance.off('disconnect', handleDisconnect);
        socketInstance.off('error', handleError);
        socketInstance.off('connect_error', handleError);
        socketInstance.off('ping');
        
        // Leave default rooms
        defaultRooms.forEach(room => leaveRoom(room));
      }
    };
  }, [defaultRooms, enableNotifications]);

  // Monitor internet connection
  useEffect(() => {
    const handleOnline = () => {
      if (socket && !socket.connected) {
        if (enableNotifications) {
          toast.info('Koneksi Internet Terhubung', {
            description: 'Mendeteksi koneksi internet, mencoba menghubungkan ke server...',
          });
        }
        socket.connect();
      }
    };

    const handleOffline = () => {
      if (enableNotifications) {
        toast.warning('Koneksi Internet Terputus', {
          description: 'Tidak dapat terhubung ke server karena tidak ada koneksi internet.',
        });
      }
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [socket, enableNotifications]);

  // Manual reconnect function
  const manualReconnect = () => {
    if (socket) {
      if (enableNotifications) {
        toast.info('Menghubungkan Kembali', {
          description: 'Mencoba menghubungkan kembali ke server...',
        });
      }
      
      if (!navigator.onLine) {
        if (enableNotifications) {
          toast.error('Tidak Ada Koneksi Internet', {
            description: 'Periksa koneksi internet Anda dan coba lagi.',
          });
        }
        return;
      }
      
      socket.connect();
    }
  };

  // Nilai untuk context
  const value: SocketContextValue = {
    socket,
    isConnected,
    joinRoom,
    leaveRoom,
    emit: emitEvent,
    listen: listenEvent,
    reconnect: manualReconnect,
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};

// Hook untuk menggunakan socket
export const useSocketContext = () => useContext(SocketContext);

// Export enum untuk kemudahan
export { SocketEventsType as SocketEvents }; 