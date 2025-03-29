"use client";
import { useEffect } from 'react';
import { toast } from 'sonner';
import { useSocketContext, SocketEvents } from '../../contexts/socket-context';
import { initializeSocket } from "@/lib/socket";

// Tipe data untuk notifikasi
type NotificationType = 'success' | 'error' | 'info' | 'warning';

// Interface untuk Props
interface NotificationHandlerProps {
  userId?: string;
  role?: 'admin' | 'user';
}

/**
 * Komponen untuk menangani notifikasi dan memastikan socket terhubung saat aplikasi dimuat
 */
const NotificationHandler = () => {
  const { socket, isConnected } = useSocketContext();
  
  // Pastikan socket terhubung saat aplikasi dimuat
  useEffect(() => {
    // Inisialisasi socket saat komponen dimuat
    if (typeof window !== 'undefined') {
      initializeSocket();
    }
    
    // Periksa koneksi setiap 30 detik
    const intervalId = setInterval(() => {
      if (socket && !socket.connected) {
        console.log('Mendeteksi socket tidak terhubung, mencoba menghubungkan kembali...');
        socket.connect();
      }
    }, 30000);
    
    return () => {
      clearInterval(intervalId);
    };
  }, [socket]);
  
  // Tampilkan indikator koneksi hanya dalam development mode
  if (process.env.NODE_ENV === 'development') {
    return (
      <div className="fixed bottom-2 right-2 z-50">
        <div className={`h-3 w-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} 
             title={isConnected ? 'Socket terhubung' : 'Socket terputus'} />
      </div>
    );
  }
  
  // Komponen ini tidak merender apapun di production
  return null;
};

export default NotificationHandler; 