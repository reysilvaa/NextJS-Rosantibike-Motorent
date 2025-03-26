"use client";
import { useEffect } from 'react';
import { toast } from 'sonner';
import { useSocketContext, SocketEvents } from '../../contexts/socket-context';

// Tipe data untuk notifikasi
type NotificationType = 'success' | 'error' | 'info' | 'warning';

// Interface untuk Props
interface NotificationHandlerProps {
  userId?: string;
  role?: 'admin' | 'user';
}

/**
 * Komponen ini menangani semua notifikasi dari socket.io.
 * Tidak memiliki UI, hanya menampilkan toast notifications.
 */
export const NotificationHandler: React.FC<NotificationHandlerProps> = ({ 
  userId, 
  role = 'user' 
}) => {
  const { isConnected, joinRoom, leaveRoom, listen } = useSocketContext();
  
  // Default room berdasarkan role dan userId
  const room = userId ? `${role}:${userId}` : role;

  // Effect untuk join/leave room dan listen untuk events
  useEffect(() => {
    if (!isConnected) return;
    
    // Bergabung dengan room berdasarkan role dan ID
    joinRoom(room);
    
    // Tambahan room yang perlu dimasuki
    if (role === 'admin') {
      joinRoom('admin');
      joinRoom('transaksi');
      joinRoom('motor');
    } else {
      joinRoom('public');
    }
    
    // Cleanup function
    return () => {
      leaveRoom(room);
      
      if (role === 'admin') {
        leaveRoom('admin');
        leaveRoom('transaksi');
        leaveRoom('motor');
      } else {
        leaveRoom('public');
      }
    };
  }, [isConnected, room, role, joinRoom, leaveRoom]);

  // Effect untuk listen untuk notifikasi khusus user
  useEffect(() => {
    if (!isConnected || !userId) return;
    
    // Handler untuk notifikasi user
    const handleUserNotification = (data: any) => {
      showNotification(
        data.title || 'Notifikasi',
        data.message || 'Ada pemberitahuan baru untuk Anda.',
        data.type || 'info',
        data.action
      );
    };
    
    // Subscribe ke event
    const unsub = listen(SocketEvents.USER_NOTIFICATION, handleUserNotification);
    
    return unsub;
  }, [isConnected, userId, listen]);

  // Fungsi untuk menampilkan toast notification
  const showNotification = (
    title: string, 
    message: string, 
    type: NotificationType = 'info',
    action?: { label: string; href: string; }
  ) => {
    const toastConfig = {
      description: message,
      ...(action ? {
        action: {
          label: action.label,
          onClick: () => window.location.href = action.href,
        }
      } : {})
    };
    
    switch (type) {
      case 'success':
        toast.success(title, toastConfig);
        break;
      case 'error':
        toast.error(title, toastConfig);
        break;
      case 'warning':
        toast.warning(title, toastConfig);
        break;
      case 'info':
      default:
        toast.info(title, toastConfig);
        break;
    }
  };

  // Komponen ini tidak merender apa pun
  return null;
};

export default NotificationHandler; 