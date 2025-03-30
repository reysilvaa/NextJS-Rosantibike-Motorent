"use client";

import React, { createContext, useContext, useEffect, ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';
import { useSocket } from '@/hooks/context/use-socket-provider';

// Reexport socket hooks dari lokasi baru
export { useSocket } from '@/hooks/context/use-socket-provider';

// Context untuk kompatibilitas dengan komponen lama
const SocketContext = createContext<Socket | null>(null);

// Provider untuk kompatibilitas dengan komponen lama
export const SocketProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { socket } = useSocket();

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};

// Hook untuk kompatibilitas dengan komponen lama
export const useSocketContext = () => {
  const socket = useContext(SocketContext);
  
  if (!socket) {
    console.warn("useSocketContext: Socket tidak tersedia, menggunakan useSocket dari hooks/context/use-socket-provider sebagai gantinya");
    return useSocket().socket;
  }
  
  return socket;
}; 