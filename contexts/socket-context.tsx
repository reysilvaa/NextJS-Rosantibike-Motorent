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
  SocketEvents 
} from '../lib/socket';

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
  const [connectionAttempts, setConnectionAttempts] = useState(0);

  // Fungsi untuk mencoba koneksi ulang secara manual
  const manualReconnect = () => {
    if (socket) {
      if (enableNotifications) {
        toast.info('Menghubungkan Kembali', {
          description: 'Mencoba menghubungkan kembali ke server...',
        });
      }
      
      // Periksa koneksi internet terlebih dahulu
      if (!navigator.onLine) {
        if (enableNotifications) {
          toast.error('Tidak Ada Koneksi Internet', {
            description: 'Periksa koneksi internet Anda dan coba lagi.',
          });
        }
        return;
      }
      
      // Reset koneksi socket dan coba hubungkan kembali
      socket.connect();
      setConnectionAttempts(prev => prev + 1);
    }
  };

  // Segera hubungkan socket saat komponen dimuat
  useEffect(() => {
    // Initialize socket
    const socketInstance = getSocket();
    setSocket(socketInstance);
    
    // Setup handlers
    const handleConnect = () => {
      setIsConnected(true);
      toast.success('Koneksi server berhasil', {
        id: 'socket-connected',
        duration: 2000,
      });
      
      // Join ke default rooms jika ada
      if (defaultRooms.length > 0) {
        defaultRooms.forEach(room => joinRoom(room));
      }
    };
    
    const handleDisconnect = (reason: string) => {
      setIsConnected(false);
      
      // Tampilkan pesan toast yang lebih informatif
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
    };
    
    const handleError = (error: Error) => {
      console.error('Socket error:', error);
      toast.error(`Error koneksi: ${error.message}`, {
        id: 'socket-error',
        duration: 5000,
      });
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
      
      // Handle backend connection confirmation
      socketInstance.on('connected', (data) => {
        console.log('Server confirmed connection:', data);
      });
      
      // Set initial state
      setIsConnected(socketInstance.connected);
    }
    
    // Cleanup
    return () => {
      if (socketInstance) {
        socketInstance.off('connect', handleConnect);
        socketInstance.off('disconnect', handleDisconnect);
        socketInstance.off('error', handleError);
        socketInstance.off('connect_error', handleError);
        socketInstance.off('ping');
        socketInstance.off('connected');
        
        // Leave default rooms
        if (defaultRooms.length > 0) {
          defaultRooms.forEach(room => leaveRoom(room));
        }
      }
    };
  }, [defaultRooms, enableNotifications]);

  // Pemantauan status koneksi internet
  useEffect(() => {
    const handleOnline = () => {
      console.log('Koneksi internet kembali tersedia, mencoba menghubungkan socket...');
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
      console.log('Koneksi internet terputus');
      if (enableNotifications) {
        toast.warning('Koneksi Internet Terputus', {
          description: 'Tidak dapat terhubung ke server karena tidak ada koneksi internet.',
        });
      }
    };

    // Tambahkan event listener untuk online/offline status
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Cleanup event listener
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [socket, enableNotifications]);

  // Setup notification handlers
  useEffect(() => {
    if (!enableNotifications) return;

    // Handler untuk notifikasi transaksi baru
    const handleNewTransaction = (data: any) => {
      toast.success('Transaksi Baru', {
        description: `Transaksi baru telah dibuat: ${data.id || 'No ID'}`,
        action: {
          label: 'Lihat',
          onClick: () => window.location.href = `/dashboard/transaksi/${data.id}`,
        },
      });
    };

    // Handler untuk notifikasi transaksi jatuh tempo
    const handleOverdueTransaction = (data: any) => {
      toast.error('Transaksi Jatuh Tempo', {
        description: `Transaksi #${data.id || 'No ID'} telah jatuh tempo!`,
        action: {
          label: 'Lihat',
          onClick: () => window.location.href = `/dashboard/transaksi/${data.id}`,
        },
      });
    };

    // Handler untuk notifikasi perubahan status motor
    const handleMotorStatusUpdate = (data: any) => {
      toast.info('Status Motor Berubah', {
        description: `Motor ${data.plat_nomor || 'No Plate'} status: ${data.status || 'updated'}`,
        action: {
          label: 'Lihat',
          onClick: () => window.location.href = `/dashboard/unit-motor/${data.id}`,
        },
      });
    };

    // Subscribe ke event
    const unsubNewTrans = listenEvent(SocketEvents.NEW_TRANSACTION, handleNewTransaction);
    const unsubOverdue = listenEvent(SocketEvents.OVERDUE_TRANSACTION, handleOverdueTransaction);
    const unsubMotorStatus = listenEvent(SocketEvents.MOTOR_STATUS_UPDATE, handleMotorStatusUpdate);

    // Cleanup ketika component unmount
    return () => {
      unsubNewTrans();
      unsubOverdue();
      unsubMotorStatus();
    };
  }, [enableNotifications]);

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
export { SocketEvents }; 