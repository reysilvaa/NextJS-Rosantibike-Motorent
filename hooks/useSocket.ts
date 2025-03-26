import { useEffect, useState } from 'react';
import { 
  getSocket, 
  joinRoom, 
  leaveRoom, 
  listenEvent,
  SocketEvents 
} from '../lib/socket';

interface UseSocketOptions {
  room?: string;
  events?: {
    [key: string]: (data: any) => void;
  };
}

export const useSocket = (options?: UseSocketOptions) => {
  const [isConnected, setIsConnected] = useState(false);
  const socket = getSocket();

  useEffect(() => {
    // Handle connection state
    const handleConnect = () => {
      setIsConnected(true);
    };

    const handleDisconnect = () => {
      setIsConnected(false);
    };

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);

    // Set initial state
    setIsConnected(socket.connected);

    // Cleanup
    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
    };
  }, [socket]);

  // Join room if specified
  useEffect(() => {
    if (options?.room) {
      joinRoom(options.room);
      
      return () => {
        leaveRoom(options.room!);
      };
    }
  }, [options?.room]);

  // Subscribe to events
  useEffect(() => {
    const cleanupFunctions: Array<() => void> = [];
    
    if (options?.events) {
      Object.entries(options.events).forEach(([event, callback]) => {
        const unsubscribe = listenEvent(event, callback);
        cleanupFunctions.push(unsubscribe);
      });
    }
    
    return () => {
      cleanupFunctions.forEach(cleanup => cleanup());
    };
  }, [options?.events]);
  
  // Return socket instance and connection state
  return {
    socket,
    isConnected,
    // Methods
    subscribe: listenEvent,
    joinRoom,
    leaveRoom
  };
};

// Export enums for convenience
export { SocketEvents };

// Contoh penggunaan:
// 
// const { isConnected, socket } = useSocket({
//   room: 'admin',
//   events: {
//     [SocketEvents.NEW_TRANSACTION]: (data) => {
//       console.log('Transaksi baru:', data);
//     },
//     [SocketEvents.OVERDUE_TRANSACTION]: (data) => {
//       console.log('Transaksi jatuh tempo:', data);
//     },
//   }
// }); 