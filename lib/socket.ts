"use client";
import { io, Socket } from 'socket.io-client';
import { API_CONFIG } from './api-config';

// Enum untuk event yang tersedia dalam sistem
export enum SocketEvents {
  // Transaksi
  NEW_TRANSACTION = 'new-transaction',
  UPDATE_TRANSACTION = 'update-transaction',
  CANCEL_TRANSACTION = 'cancel-transaction',
  OVERDUE_TRANSACTION = 'overdue-transaction',
  DENDA_NOTIFICATION = 'denda-notification',
  FASILITAS_NOTIFICATION = 'fasilitas-notification',
  
  // Motor
  MOTOR_STATUS_UPDATE = 'motor-status-update',
  MOTOR_LOCATION_UPDATE = 'motor-location-update',
  
  // Admin
  ADMIN_NOTIFICATION = 'admin-notification',
  
  // User
  USER_NOTIFICATION = 'user-notification',
  
  // Rooms
  JOIN_ROOM = 'joinRoom',
  LEAVE_ROOM = 'leaveRoom',
  
  // Test
  TEST_NEW_TRANSACTION = 'test-new-transaction',
  TEST_OVERDUE = 'test-overdue',
  TEST_MOTOR_STATUS = 'test-motor-status',
  TEST_DENDA = 'test-denda',
  TEST_FASILITAS = 'test-fasilitas'
}

// Singleton pattern untuk koneksi socket
let socketInstance: Socket | null = null;

/**
 * Mendapatkan instance socket.io yang sudah dikonfigurasi
 * Jika belum ada, fungsi ini akan membuat instance baru
 */
export const getSocket = (): Socket => {
  if (typeof window === 'undefined') return null as any; // guard untuk SSR
  
  if (!socketInstance) {
    socketInstance = io(API_CONFIG.BASE_URL, {
      transports: ['websocket', 'polling'],
      path: '/socket.io/',
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    // Setup default handlers
    socketInstance.on('connect', () => {
      console.log('Socket terhubung dengan ID:', socketInstance?.id);
    });

    socketInstance.on('disconnect', (reason) => {
      console.log('Socket terputus karena:', reason);
    });

    socketInstance.on('connect_error', (error) => {
      console.error('Error koneksi socket:', error.message);
    });
  }

  return socketInstance;
};

/**
 * Fungsi untuk bergabung dengan room
 * @param room Nama room yang ingin diikuti
 */
export const joinRoom = (room: string): void => {
  const socket = getSocket();
  if (socket && socket.connected) {
    socket.emit(SocketEvents.JOIN_ROOM, room);
  }
};

/**
 * Fungsi untuk meninggalkan room
 * @param room Nama room yang ingin ditinggalkan
 */
export const leaveRoom = (room: string): void => {
  const socket = getSocket();
  if (socket && socket.connected) {
    socket.emit(SocketEvents.LEAVE_ROOM, room);
  }
};

/**
 * Fungsi untuk mengirim event ke server
 * @param event Nama event yang ingin dikirim
 * @param data Data yang ingin dikirim
 */
export const emitEvent = (event: string, data: any): void => {
  const socket = getSocket();
  if (socket && socket.connected) {
    socket.emit(event, data);
  } else {
    console.warn('Socket tidak terhubung, tidak bisa mengirim event:', event);
  }
};

/**
 * Fungsi untuk mendengarkan event dari server
 * @param event Nama event yang ingin didengarkan
 * @param callback Fungsi yang akan dipanggil ketika event terjadi
 * @returns Fungsi untuk berhenti mendengarkan event
 */
export const listenEvent = (event: string, callback: (data: any) => void): () => void => {
  const socket = getSocket();
  if (socket) {
    socket.on(event, callback);
    return () => socket.off(event, callback);
  }
  return () => {}; // No-op jika socket tidak ada
};

/**
 * Memutus koneksi socket.io
 */
export const disconnect = (): void => {
  if (socketInstance) {
    socketInstance.disconnect();
    socketInstance = null;
  }
}; 