"use client";

import React, { createContext, useContext, useEffect, useRef, useState, ReactNode } from 'react';
import { useSocketContext } from './socket-context';

// Interface untuk nilai context
interface VideoContextValue {
  videoRefs: React.MutableRefObject<(HTMLVideoElement | null)[]>;
  currentSlide: number;
  isPlaying: boolean;
  isLoaded: boolean;
  error: Error | null;
  setCurrentSlide: (index: number) => void;
  play: (index: number) => void;
  pause: (index: number) => void;
  togglePlay: (index: number) => void;
  isPageVisible: boolean;
  useVideoFallback: boolean;
  setUseVideoFallback: (value: boolean) => void;
}

// Buat context dengan nilai default
const VideoContext = createContext<VideoContextValue>({
  videoRefs: { current: [] },
  currentSlide: 0,
  isPlaying: false,
  isLoaded: false,
  error: null,
  setCurrentSlide: () => {},
  play: () => {},
  pause: () => {},
  togglePlay: () => {},
  isPageVisible: true,
  useVideoFallback: false,
  setUseVideoFallback: () => {},
});

// Props untuk provider
interface VideoContextProviderProps {
  children: ReactNode;
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
  playWhenVisible?: boolean;
  playWhenSocketConnected?: boolean;
  slideDuration?: number;
}

export const VideoContextProvider: React.FC<VideoContextProviderProps> = ({ 
  children,
  autoPlay = false,
  muted = true,
  loop = false,
  playWhenVisible = true,
  playWhenSocketConnected = true,
  slideDuration = 5000
}) => {
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [isPageVisible, setIsPageVisible] = useState(true);
  const [useVideoFallback, setUseVideoFallback] = useState(false);
  const playPromiseRefs = useRef<Array<Promise<void> | null>>([]);
  
  const { isConnected: isSocketConnected } = useSocketContext();

  // Handle page visibility
  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsPageVisible(document.visibilityState === 'visible');
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // Setup video elements
  useEffect(() => {
    videoRefs.current.forEach((video, index) => {
      if (!video) return;

      // Event listeners
      const handlePlay = () => {
        if (index === currentSlide) {
          setIsPlaying(true);
        }
      };
      const handlePause = () => {
        if (index === currentSlide) {
          setIsPlaying(false);
          playPromiseRefs.current[index] = null;
        }
      };
      const handleLoadedData = () => {
        if (index === currentSlide) {
          setIsLoaded(true);
        }
      };
      const handleError = (e: any) => {
        if (index === currentSlide) {
          setError(new Error(`Video error: ${e.target.error?.message || 'unknown'}`));
        }
      };

      video.addEventListener('play', handlePlay);
      video.addEventListener('pause', handlePause);
      video.addEventListener('loadeddata', handleLoadedData);
      video.addEventListener('error', handleError);

      // Apply options
      video.autoplay = autoPlay;
      video.muted = muted;
      video.loop = loop;
      video.setAttribute('playsinline', '');

      return () => {
        video.removeEventListener('play', handlePlay);
        video.removeEventListener('pause', handlePause);
        video.removeEventListener('loadeddata', handleLoadedData);
        video.removeEventListener('error', handleError);
      };
    });
  }, [autoPlay, muted, loop, currentSlide]);

  // Handle slideshow
  useEffect(() => {
    if (useVideoFallback) return;

    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % videoRefs.current.length);
    }, slideDuration);

    return () => clearInterval(interval);
  }, [slideDuration, useVideoFallback]);

  // Handle play/pause based on visibility and socket connection
  useEffect(() => {
    if (useVideoFallback) return;

    const currentVideo = videoRefs.current[currentSlide];
    if (!currentVideo || !isLoaded) return;

    const shouldPlay = 
      (playWhenVisible && isPageVisible) &&
      (playWhenSocketConnected ? isSocketConnected : true);

    if (shouldPlay && !isPlaying) {
      try {
        if (playPromiseRefs.current[currentSlide]) {
          playPromiseRefs.current[currentSlide] = null;
        }
        
        playPromiseRefs.current[currentSlide] = currentVideo.play();
        if (playPromiseRefs.current[currentSlide] !== undefined) {
          playPromiseRefs.current[currentSlide]?.catch(err => {
            console.warn('Tidak bisa memutar video:', err);
            
            if (err.name === 'NotAllowedError' && !currentVideo.muted) {
              console.info('Mencoba putar video dengan muted');
              currentVideo.muted = true;
              playPromiseRefs.current[currentSlide] = currentVideo.play();
              playPromiseRefs.current[currentSlide]?.catch(e => {
                console.error('Masih tidak bisa memutar video:', e);
                setUseVideoFallback(true);
              });
            } else {
              setUseVideoFallback(true);
            }
          });
        }
      } catch (err) {
        console.error('Error saat memutar video:', err);
        setUseVideoFallback(true);
      }
    } else if (!shouldPlay && isPlaying) {
      if (playPromiseRefs.current[currentSlide]) {
        playPromiseRefs.current[currentSlide]?.then(() => {
          currentVideo.pause();
        }).catch(() => {
          currentVideo.pause();
        });
      } else {
        currentVideo.pause();
      }
    }

    // Pause all other videos
    videoRefs.current.forEach((video, index) => {
      if (video && index !== currentSlide && !video.paused) {
        video.pause();
      }
    });
  }, [isPageVisible, isSocketConnected, playWhenVisible, playWhenSocketConnected, isPlaying, isLoaded, currentSlide, useVideoFallback]);

  const play = (index: number) => {
    const video = videoRefs.current[index];
    if (video) {
      if (playPromiseRefs.current[index]) {
        playPromiseRefs.current[index] = null;
      }
      playPromiseRefs.current[index] = video.play();
      playPromiseRefs.current[index]?.catch(err => console.warn('Error play:', err));
    }
  };

  const pause = (index: number) => {
    const video = videoRefs.current[index];
    if (video) {
      if (playPromiseRefs.current[index]) {
        playPromiseRefs.current[index]?.then(() => {
          video.pause();
        }).catch(() => {
          video.pause();
        });
      } else {
        video.pause();
      }
    }
  };

  const togglePlay = (index: number) => {
    const video = videoRefs.current[index];
    if (video) {
      if (video.paused) {
        play(index);
      } else {
        pause(index);
      }
    }
  };

  const value: VideoContextValue = {
    videoRefs,
    currentSlide,
    isPlaying,
    isLoaded,
    error,
    setCurrentSlide,
    play,
    pause,
    togglePlay,
    isPageVisible,
    useVideoFallback,
    setUseVideoFallback
  };

  return (
    <VideoContext.Provider value={value}>
      {children}
    </VideoContext.Provider>
  );
};

// Hook untuk menggunakan video context
export const useVideoContext = () => useContext(VideoContext); 