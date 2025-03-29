"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useSocketContext } from './socket-context';

// Interface untuk nilai context
interface VideoContextValue {
  registerVideo: (videoElement: HTMLVideoElement) => void;
  unregisterVideo: (videoElement: HTMLVideoElement) => void;
  isPageVisible: boolean;
}

// Buat context dengan nilai default
const VideoContext = createContext<VideoContextValue>({
  registerVideo: () => {},
  unregisterVideo: () => {},
  isPageVisible: true,
});

// Props untuk provider
interface VideoContextProviderProps {
  children: ReactNode;
}

export const VideoContextProvider: React.FC<VideoContextProviderProps> = ({ children }) => {
  const [isPageVisible, setIsPageVisible] = useState<boolean>(true);
  const [registeredVideos, setRegisteredVideos] = useState<HTMLVideoElement[]>([]);
  const { isConnected } = useSocketContext();

  // Handler untuk visibilitas halaman
  useEffect(() => {
    const handleVisibilityChange = () => {
      const isVisible = document.visibilityState === 'visible';
      setIsPageVisible(isVisible);
      
      // Pause atau play video berdasarkan visibilitas
      registeredVideos.forEach(video => {
        if (isVisible) {
          // Tambahkan try-catch untuk menangani error saat memanggil play()
          try {
            // Hanya play jika video sebelumnya sudah dimulai dan sekarang dijeda
            if (video.paused && video.currentTime > 0) {
              // Gunakan atribut muted untuk memastikan video bisa diputar
              video.muted = true;
              const playPromise = video.play();
              
              if (playPromise !== undefined) {
                playPromise.catch(error => {
                  console.warn('Error saat mencoba play video:', error);
                });
              }
            }
          } catch (error) {
            console.error('Error saat memanipulasi video:', error);
          }
        } else {
          // Pause video saat halaman tidak terlihat
          video.pause();
        }
      });
    };

    // Inisialisasi state visibilitas
    setIsPageVisible(document.visibilityState === 'visible');
    
    // Tambahkan event listener
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [registeredVideos]);

  // Efek untuk menangani perubahan status koneksi socket
  useEffect(() => {
    if (isConnected && isPageVisible) {
      // Coba play video jika socket terhubung dan halaman terlihat
      registeredVideos.forEach(video => {
        try {
          // Gunakan atribut muted untuk memastikan video bisa diputar
          video.muted = true;
          const playPromise = video.play();
          
          if (playPromise !== undefined) {
            playPromise.catch(error => {
              console.warn('Error saat mencoba play video setelah socket terhubung:', error);
            });
          }
        } catch (error) {
          console.error('Error saat memanipulasi video setelah socket terhubung:', error);
        }
      });
    }
  }, [isConnected, isPageVisible, registeredVideos]);

  // Fungsi untuk mendaftarkan video
  const registerVideo = (videoElement: HTMLVideoElement) => {
    // Tambahkan attributes yang diperlukan untuk menghindari error penghematan daya
    videoElement.setAttribute('playsinline', ''); // Penting untuk iOS
    videoElement.muted = true; // Mute video untuk memastikan autoplay bisa bekerja
    
    // Tambahkan video ke daftar jika belum ada
    setRegisteredVideos(prev => {
      if (!prev.includes(videoElement)) {
        return [...prev, videoElement];
      }
      return prev;
    });
  };

  // Fungsi untuk menghapus video dari daftar
  const unregisterVideo = (videoElement: HTMLVideoElement) => {
    setRegisteredVideos(prev => prev.filter(v => v !== videoElement));
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

// Hook untuk menggunakan video context
export const useVideoContext = () => useContext(VideoContext); 