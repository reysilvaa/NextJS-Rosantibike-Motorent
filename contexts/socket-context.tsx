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
}

// Buat context dengan nilai default
const SocketContext = createContext<SocketContextValue>({
  socket: null,
  isConnected: false,
  joinRoom: () => {},
  leaveRoom: () => {},
  emit: () => {},
  listen: () => () => {},
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
  const socket = getSocket();

  // Handler untuk koneksi socket
  useEffect(() => {
    const handleConnect = () => {
      setIsConnected(true);
      
      // Join ke default rooms jika ada
      if (defaultRooms.length > 0) {
        defaultRooms.forEach(room => joinRoom(room));
      }
    };

    const handleDisconnect = () => {
      setIsConnected(false);
    };

    // Tambahkan listener
    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);

    // Inisialisasi status koneksi
    setIsConnected(socket.connected);

    // Cleanup listener ketika component unmount
    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      
      // Leave default rooms
      if (defaultRooms.length > 0) {
        defaultRooms.forEach(room => leaveRoom(room));
      }
    };
  }, [socket, defaultRooms]);

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