'use client';
import { io, Socket } from 'socket.io-client';

import { API_CONFIG } from '@/lib/network/api-config';

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
  TEST_FASILITAS = 'test-fasilitas',
}

// Singleton pattern untuk koneksi socket
let socketInstance: Socket | null = null;
let reconnectAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 10;

/**
 * Fungsi untuk menginisialisasi socket.io secara otomatis
 * Dipanggil di awal aplikasi untuk memastikan socket tersedia
 */
export const initializeSocket = (): Socket | null => {
  if (typeof window === 'undefined') return null; // guard untuk SSR

  try {
    // Jika sudah ada instance, gunakan instance tersebut
    if (socketInstance) {
      // Pastikan socket terhubung
      if (!socketInstance.connected) {
        socketInstance.connect();
      }
      return socketInstance;
    }

    // Buat socket baru jika belum ada
    // Gunakan URL relatif untuk backend dan port yang sesuai
    const wsUrl = process.env.NEXT_PUBLIC_WS_URL;

    console.log(`Mencoba connect ke socket: ${wsUrl} dengan namespace /realtime`);

    // Inisialisasi socket dengan namespace yang benar dan tambahan opsi
    socketInstance = io(`${wsUrl}/realtime`, {
      transports: ['polling', 'websocket'], // Mulai dengan polling untuk koneksi lebih stabil
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      timeout: 60000, // Timeout yang lebih pendek
      forceNew: true, // Force new connection
      withCredentials: false, // Ubah ke false untuk mengatasi masalah CORS
    });

    // Setup default handlers
    socketInstance.on('connect', () => {
      console.log('Socket terhubung dengan ID:', socketInstance?.id);
      reconnectAttempts = 0; // Reset counter saat berhasil terhubung

      // Kirim identifikasi pada koneksi berhasil
      socketInstance?.emit('identify', { clientType: 'web', timestamp: new Date().toISOString() });
    });

    socketInstance.on('disconnect', reason => {
      console.log('Socket terputus karena:', reason);

      // Untuk semua jenis disconnect, coba reconnect secara manual
      if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
        reconnectAttempts++;
        console.log(`Mencoba reconnect (${reconnectAttempts}/${MAX_RECONNECT_ATTEMPTS})...`);

        // Gunakan timeout untuk menghindari reconnect terlalu cepat
        setTimeout(() => {
          if (socketInstance && !socketInstance.connected) {
            socketInstance.connect();
          }
        }, 1000 * reconnectAttempts); // Backoff eksponensial
      }
    });

    socketInstance.on('connect_error', error => {
      console.error('Error koneksi socket:', error.message);

      // Fallback ke polling jika terjadi error
      if (socketInstance && socketInstance.io) {
        // Update konfigurasi transport
        console.log('Beralih ke polling untuk stabilitas...');
        socketInstance.io.opts.transports = ['polling'];

        // Tingkatkan timeout untuk polling
        socketInstance.io.opts.timeout = 60000;

        // Coba reconnect setelah delay singkat
        setTimeout(() => {
          if (socketInstance && !socketInstance.connected) {
            socketInstance.connect();
          }
        }, 2000);
      }
    });

    socketInstance.io.on('reconnect_attempt', attempt => {
      console.log(`Mencoba reconnect ke socket (percobaan ke-${attempt})`);

      // Pada percobaan reconnect, pastikan konfigurasi optimal
      if (socketInstance && socketInstance.io) {
        socketInstance.io.opts.transports = ['polling', 'websocket'];
        console.log('Mencoba dengan polling dan websocket...');
      }
    });

    socketInstance.io.on('reconnect_failed', () => {
      console.error('Gagal melakukan reconnect setelah beberapa percobaan');

      // Notifikasi user atau refresh halaman
      if (typeof window !== 'undefined') {
        console.log('Menyarankan refresh halaman...');
      }
    });

    // Handler untuk error umum
    socketInstance.on('error', error => {
      console.error('Socket error:', error);
    });

    return socketInstance;
  } catch (error) {
    console.error('Gagal menginisialisasi socket:', error);
    return null;
  }
};

/**
 * Mendapatkan instance socket.io yang sudah dikonfigurasi
 * Jika belum ada, fungsi ini akan membuat instance baru
 */
export const getSocket = (): Socket => {
  if (typeof window === 'undefined') return null as any; // guard untuk SSR

  if (!socketInstance) {
    try {
      const wsUrl =
        typeof window !== 'undefined'
          ? window.location.hostname === 'localhost'
            ? 'http://localhost:8000' // URL absolut untuk server backend lokal
            : process.env.NEXT_PUBLIC_WS_URL || API_CONFIG.BASE_URL
          : process.env.NEXT_PUBLIC_WS_URL || API_CONFIG.BASE_URL;

      console.log(`getSocket: Mencoba connect ke socket: ${wsUrl} dengan path /socket.io/`);

      socketInstance = io(wsUrl, {
        transports: ['polling'], // Use only polling for better mobile compatibility
        path: '/socket.io/',
        autoConnect: true,
        reconnection: true,
        reconnectionAttempts: 5, // Reduce reconnection attempts
        reconnectionDelay: 2000, // Increase delay between attempts
        timeout: 30000, // Shorter timeout
        forceNew: true,
        withCredentials: false,
        // Add mobile-specific options
        upgrade: false, // Disable transport upgrade
        rememberUpgrade: false,
        // Add better error handling
        rejectUnauthorized: false,
        // Add mobile-specific transport options
        extraHeaders: {
          'Access-Control-Allow-Origin': '*',
        },
      });

      // Setup default handlers
      socketInstance.on('connect', () => {
        console.log('Socket terhubung dengan ID:', socketInstance?.id);
        reconnectAttempts = 0; // Reset counter saat berhasil terhubung
      });

      socketInstance.on('disconnect', reason => {
        console.log('Socket terputus karena:', reason);
        // Jika terputus karena error, coba reconnect secara manual
        if (
          reason === 'io server disconnect' ||
          reason === 'transport close' ||
          reason === 'transport error'
        ) {
          if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
            reconnectAttempts++;
            socketInstance?.connect();
          }
        }
      });

      socketInstance.on('connect_error', error => {
        console.error('Error koneksi socket:', error.message);

        // Automatiskan fallback ke polling jika mengalami timeout atau error koneksi
        if (
          error.message.includes('timeout') ||
          error.message.includes('CORS') ||
          error.message.includes('websocket error') ||
          error.message.includes('xhr poll error') ||
          error.message.includes('Invalid namespace')
        ) {
          console.log('Terjadi error koneksi, beralih ke polling...');
          if (socketInstance && socketInstance.io && socketInstance.io.opts) {
            // Ubah transport hanya menggunakan polling
            socketInstance.io.opts.transports = ['polling'];

            // Set timeout lebih lama untuk polling
            socketInstance.io.opts.timeout = 120000;

            // Coba hubungkan ulang
            setTimeout(() => {
              if (socketInstance && !socketInstance.connected) {
                console.log('Mencoba menghubungkan kembali dengan polling...');
                socketInstance.connect();
              }
            }, 1000);
          }
        }
      });

      socketInstance.io.on('reconnect_attempt', attempt => {
        console.log(`Mencoba reconnect ke socket (percobaan ke-${attempt})`);
        if (attempt === 1) {
          console.log('Mendeteksi socket tidak terhubung, mencoba menghubungkan kembali...');
        }
      });

      socketInstance.io.on('reconnect_failed', () => {
        console.error('Gagal melakukan reconnect setelah beberapa percobaan');
      });

      socketInstance.io.on('reconnect', attempt => {
        console.log(`Berhasil reconnect ke socket setelah ${attempt} percobaan`);
      });

      // Pastikan socket terhubung
      if (!socketInstance.connected) {
        socketInstance.connect();
      }
    } catch (error) {
      console.error('Error saat membuat instance socket:', error);
      // Kembalikan dummy socket supaya aplikasi tidak crash
      return {
        on: () => {},
        off: () => {},
        emit: () => {},
        connect: () => {},
        disconnect: () => {},
        connected: false,
      } as any;
    }
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
export const listenEvent = (event: string, callback: (data: any) => void): (() => void) => {
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

// Inisialisasi socket saat modul dimuat jika bukan di server side
if (typeof window !== 'undefined') {
  initializeSocket();
}
