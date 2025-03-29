"use client";

import { useEffect, useRef, useState } from 'react';
import { useVideoContext } from '@/contexts/video-context';
import { useSocketContext } from '@/contexts/socket-context';

interface UseVideoPlayerOptions {
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
  playWhenVisible?: boolean;
  playWhenSocketConnected?: boolean;
}

export function useVideoPlayer(options: UseVideoPlayerOptions = {}) {
  const {
    autoPlay = false,
    muted = true,
    loop = false,
    playWhenVisible = true,
    playWhenSocketConnected = true
  } = options;
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  const { registerVideo, unregisterVideo, isPageVisible } = useVideoContext();
  const { isConnected: isSocketConnected } = useSocketContext();
  
  // Daftarkan video ke VideoContext
  useEffect(() => {
    const videoElement = videoRef.current;
    
    if (videoElement) {
      registerVideo(videoElement);
      
      // Event listeners untuk status video
      const handlePlay = () => setIsPlaying(true);
      const handlePause = () => setIsPlaying(false);
      const handleLoadedData = () => setIsLoaded(true);
      const handleError = (e: any) => setError(new Error(`Video error: ${e.target.error?.message || 'unknown'}`));
      
      videoElement.addEventListener('play', handlePlay);
      videoElement.addEventListener('pause', handlePause);
      videoElement.addEventListener('loadeddata', handleLoadedData);
      videoElement.addEventListener('error', handleError);
      
      // Apply options
      videoElement.autoplay = autoPlay;
      videoElement.muted = muted;
      videoElement.loop = loop;
      videoElement.setAttribute('playsinline', '');
      
      // Cleanup
      return () => {
        unregisterVideo(videoElement);
        videoElement.removeEventListener('play', handlePlay);
        videoElement.removeEventListener('pause', handlePause);
        videoElement.removeEventListener('loadeddata', handleLoadedData);
        videoElement.removeEventListener('error', handleError);
      };
    }
  }, [registerVideo, unregisterVideo, autoPlay, muted, loop]);
  
  // Pantau perubahan visibilitas halaman dan status socket
  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement || !isLoaded) return;
    
    const shouldPlay = 
      (playWhenVisible && isPageVisible) &&
      (playWhenSocketConnected ? isSocketConnected : true);
    
    if (shouldPlay && !isPlaying) {
      try {
        const playPromise = videoElement.play();
        if (playPromise !== undefined) {
          playPromise.catch(err => {
            console.warn('Tidak bisa memutar video:', err);
            
            // Jika autoplay diblokir, coba dengan muted
            if (err.name === 'NotAllowedError' && !videoElement.muted) {
              console.info('Mencoba putar video dengan muted');
              videoElement.muted = true;
              videoElement.play().catch(e => {
                console.error('Masih tidak bisa memutar video:', e);
              });
            }
          });
        }
      } catch (err) {
        console.error('Error saat memutar video:', err);
      }
    } else if (!shouldPlay && isPlaying) {
      videoElement.pause();
    }
  }, [isPageVisible, isSocketConnected, playWhenVisible, playWhenSocketConnected, isPlaying, isLoaded]);
  
  // Metode untuk mengontrol video
  const controls = {
    play: () => {
      const video = videoRef.current;
      if (video) {
        video.play().catch(err => console.warn('Error play:', err));
      }
    },
    pause: () => {
      const video = videoRef.current;
      if (video) {
        video.pause();
      }
    },
    toggle: () => {
      const video = videoRef.current;
      if (video) {
        if (video.paused) {
          video.play().catch(err => console.warn('Error toggle play:', err));
        } else {
          video.pause();
        }
      }
    },
    setMuted: (muted: boolean) => {
      const video = videoRef.current;
      if (video) {
        video.muted = muted;
      }
    }
  };
  
  return {
    videoRef,
    isPlaying,
    isLoaded,
    error,
    controls
  };
} 