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
  const [isConnected, setIsConnected] = useState(false);
  const [connectionAttempts, setConnectionAttempts] = useState(0);
  const socket = getSocket();

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
    if (socket && !socket.connected) {
      console.log('Menginisialisasi koneksi socket.io...');
      socket.connect();
    }
  }, []);

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

  // Handler untuk koneksi socket
  useEffect(() => {
    const handleConnect = () => {
      console.log('Socket berhasil terhubung!');
      setIsConnected(true);
      
      // Join ke default rooms jika ada
      if (defaultRooms.length > 0) {
        defaultRooms.forEach(room => joinRoom(room));
      }
    };

    const handleDisconnect = () => {
      console.log('Socket terputus!');
      setIsConnected(false);
      
      if (enableNotifications) {
        // Tambahkan notifikasi ketika socket terputus
        toast.warning('Koneksi Terputus', {
          description: 'Mendeteksi socket tidak terhubung, mencoba menghubungkan kembali...',
        });
      }
    };

    // Tambahkan listener
    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);

    // Tambahkan handler untuk connect_error
    socket.on('connect_error', (error) => {
      console.error('Socket connect error:', error.message);
      
      if (enableNotifications) {
        if (error.message.includes('timeout')) {
          toast.error('Koneksi Timeout', {
            description: 'Koneksi ke server timeout. Beralih ke mode alternatif...',
          });
        } else {
          toast.error('Kesalahan Koneksi', {
            description: `Error: ${error.message}. Mencoba menghubungkan kembali...`,
          });
        }
      }
    });

    // Inisialisasi status koneksi
    setIsConnected(socket.connected);

    // Listener untuk upaya menghubungkan kembali
    socket.io.on('reconnect_attempt', (attempt) => {
      console.log(`Mencoba reconnect ke socket (percobaan ke-${attempt})`);
      if (enableNotifications && attempt === 1) {
        toast.info('Reconnecting', {
          description: `Mencoba menghubungkan kembali ke server...`,
        });
      }
    });

    socket.io.on('reconnect', (attempt) => {
      console.log(`Berhasil reconnect ke socket setelah ${attempt} percobaan`);
      if (enableNotifications) {
        toast.success('Terhubung Kembali', {
          description: `Berhasil terhubung kembali ke server setelah ${attempt} percobaan`,
        });
      }
    });

    // Coba hubungkan jika belum terhubung
    if (!socket.connected) {
      socket.connect();
    }

    // Cleanup listener ketika component unmount
    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      
      // Leave default rooms
      if (defaultRooms.length > 0) {
        defaultRooms.forEach(room => leaveRoom(room));
      }
    };
  }, [socket, defaultRooms, enableNotifications]);

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