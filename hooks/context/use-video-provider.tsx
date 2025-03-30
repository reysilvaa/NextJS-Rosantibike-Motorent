"use client";

import React, { createContext, useContext, useEffect, useState, useRef, ReactNode } from 'react';
import { useSocket } from './use-socket-provider';

// Interface untuk nilai context
interface VideoContextValue {
  registerVideo: (videoElement: HTMLVideoElement) => void;
  unregisterVideo: (videoElement: HTMLVideoElement) => void;
  isPageVisible: boolean;
}

// Props untuk provider
interface VideoProviderProps {
  children: ReactNode;
}

// Buat context dengan nilai default
const VideoContext = createContext<VideoContextValue>({
  registerVideo: () => {},
  unregisterVideo: () => {},
  isPageVisible: true,
});

/**
 * Provider untuk manajemen video player
 * @param children - React children nodes
 * @returns VideoProvider component
 */
export const VideoProvider: React.FC<VideoProviderProps> = ({ children }) => {
  const [isPageVisible, setIsPageVisible] = useState<boolean>(true);
  const registeredVideosRef = useRef<HTMLVideoElement[]>([]);
  const { isConnected } = useSocket();
  
  // Handler untuk visibilitas halaman - optimasi dengan useRef
  useEffect(() => {
    const handleVisibilityChange = () => {
      const isVisible = document.visibilityState === 'visible';
      setIsPageVisible(isVisible);
      
      // Berhenti jika tidak ada video yang terdaftar
      if (registeredVideosRef.current.length === 0) return;
      
      // Pause atau play video berdasarkan visibilitas
      if (isVisible) {
        // Play video hanya jika halaman visible
        setTimeout(() => {
          registeredVideosRef.current.forEach(video => {
            try {
              if (video.paused && video.currentTime > 0) {
                video.muted = true;
                video.play().catch(() => {
                  // Gagal memutar dalam diam, tidak perlu handling lebih lanjut
                });
              }
            } catch (error) {
              // Tangkap error tanpa logging untuk mengurangi noise di console
            }
          });
        }, 300); // Delay kecil untuk mengurangi beban pada saat halaman kembali terlihat
      } else {
        // Pause video langsung saat halaman tidak terlihat
        registeredVideosRef.current.forEach(video => {
          try {
            if (!video.paused) {
              video.pause();
            }
          } catch (error) {
            // Tangkap error tanpa logging
          }
        });
      }
    };

    // Inisialisasi state visibilitas
    setIsPageVisible(document.visibilityState === 'visible');
    
    // Tambahkan event listener
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // Efek untuk menangani perubahan status koneksi socket - batasi dampak performa
  useEffect(() => {
    // Hanya berlaku jika socket terhubung dan halaman terlihat
    if (!isConnected || !isPageVisible) return;
    
    // Berhenti jika tidak ada video yang terdaftar
    if (registeredVideosRef.current.length === 0) return;
    
    // Delay untuk mengurangi dampak pada performa load awal
    const timer = setTimeout(() => {
      registeredVideosRef.current.forEach(video => {
        try {
          video.muted = true;
          if (video.paused) {
            video.play().catch(() => {
              // Gagal memutar, tidak perlu handling lebih lanjut
            });
          }
        } catch (error) {
          // Tangkap error tanpa logging
        }
      });
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [isConnected, isPageVisible]);

  // Fungsi untuk mendaftarkan video
  const registerVideo = (videoElement: HTMLVideoElement) => {
    // Tambahkan attributes yang diperlukan untuk menghindari error penghematan daya
    videoElement.setAttribute('playsinline', ''); // Penting untuk iOS
    videoElement.muted = true; // Mute video untuk memastikan autoplay bisa bekerja
    
    // Gunakan ref untuk mengurangi re-render
    if (!registeredVideosRef.current.includes(videoElement)) {
      registeredVideosRef.current.push(videoElement);
    }
  };

  // Fungsi untuk menghapus video dari daftar
  const unregisterVideo = (videoElement: HTMLVideoElement) => {
    // Gunakan ref untuk mengurangi re-render
    registeredVideosRef.current = registeredVideosRef.current.filter(v => v !== videoElement);
  };

  // Nilai untuk context
  const value: VideoContextValue = {
    registerVideo,
    unregisterVideo,
    isPageVisible,
  };

  return (
    <VideoContext.Provider value={value}>
      {children}
    </VideoContext.Provider>
  );
};

/**
 * Hook untuk menggunakan VideoContext
 * @returns Video context values
 * @throws Error jika digunakan di luar VideoProvider
 */
export function useVideo() {
  const context = useContext(VideoContext);
  if (context === undefined) {
    throw new Error("useVideo must be used within a VideoProvider");
  }
  return context;
} 