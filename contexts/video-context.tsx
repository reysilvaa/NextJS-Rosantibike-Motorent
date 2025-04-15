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
  registerVideo: (video: HTMLVideoElement) => void;
  unregisterVideo: (video: HTMLVideoElement) => void;
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
  registerVideo: () => {},
  unregisterVideo: () => {},
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
  autoPlay = true,
  muted = true,
  loop = true,
  playWhenVisible = true,
  playWhenSocketConnected = false,
  slideDuration = 8000
}) => {
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [isPageVisible, setIsPageVisible] = useState(true);
  const [useVideoFallback, setUseVideoFallback] = useState(() => {
    if (typeof window !== 'undefined') {
      // Enhanced mobile detection with better fallback logic
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      const isLowEndDevice = /(Android|iPhone|iPad).*?AppleWebKit(?!.*Safari)/i.test(navigator.userAgent);
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
      const isAndroid = /Android/.test(navigator.userAgent);
      
      // Always use fallback for iOS devices
      if (isIOS) return true;
      
      // For Android, check if it's a low-end device
      if (isAndroid && isLowEndDevice) return true;
      
      return false;
    }
    return false;
  });
  const playPromiseRefs = useRef<Array<Promise<void> | null>>([]);
  const slideIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  const { isConnected: isSocketConnected } = useSocketContext();

  // Handle page visibility
  useEffect(() => {
    const handleVisibilityChange = () => {
      const visible = document.visibilityState === 'visible';
      setIsPageVisible(visible);
      
      // If page becomes visible again and slideshow is paused, restart it
      if (visible && slideIntervalRef.current === null && !useVideoFallback) {
        startSlideshow();
      } else if (!visible && slideIntervalRef.current !== null) {
        stopSlideshow();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      stopSlideshow();
    };
  }, [useVideoFallback]);

  const startSlideshow = () => {
    if (slideIntervalRef.current !== null) return;
    
    slideIntervalRef.current = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % videoRefs.current.length);
    }, slideDuration);
  };

  const stopSlideshow = () => {
    if (slideIntervalRef.current !== null) {
      clearInterval(slideIntervalRef.current);
      slideIntervalRef.current = null;
    }
  };

  // Optimize video setup for mobile
  useEffect(() => {
    const currentVideo = videoRefs.current[currentSlide];
    if (!currentVideo) return;

    const setupVideo = () => {
      try {
        // Set mobile-specific attributes
        currentVideo.muted = muted;
        currentVideo.loop = loop;
        currentVideo.setAttribute('playsinline', '');
        currentVideo.setAttribute('webkit-playsinline', '');
        currentVideo.setAttribute('x5-playsinline', '');
        currentVideo.setAttribute('x5-video-player-type', 'h5');
        currentVideo.setAttribute('x5-video-player-fullscreen', 'false');
        currentVideo.setAttribute('x5-video-orientation', 'portraint');
        
        // Add preload attribute for better mobile performance
        currentVideo.setAttribute('preload', 'auto');
        
        // Set mobile-specific styles
        currentVideo.style.width = '100%';
        currentVideo.style.height = 'auto';
        currentVideo.style.objectFit = 'cover';
        
        if (autoPlay && isPageVisible && !useVideoFallback) {
          // For mobile, always start muted
          currentVideo.muted = true;
          
          const playPromise = currentVideo.play();
          if (playPromise !== undefined) {
            playPromiseRefs.current[currentSlide] = playPromise;
            playPromise.then(() => {
              setIsPlaying(true);
              setIsLoaded(true);
            }).catch(err => {
              console.warn('Video autoplay failed:', err);
              // Try with muted if autoplay failed
              if (!currentVideo.muted) {
                currentVideo.muted = true;
                const mutedPlayPromise = currentVideo.play();
                if (mutedPlayPromise !== undefined) {
                  mutedPlayPromise.catch(() => {
                    setUseVideoFallback(true);
                  });
                }
              } else {
                setUseVideoFallback(true);
              }
            });
          }
        }
      } catch (err) {
        console.error('Error during video setup:', err);
        setUseVideoFallback(true);
      }
    };

    // Add event listeners
    const handleLoadedData = () => {
      if (currentSlide === parseInt(currentVideo.dataset.index || '0')) {
        setIsLoaded(true);
        setupVideo();
      }
    };

    const handleError = (e: Event) => {
      console.error('Video error:', e);
      setError(new Error(`Video loading error`));
      setUseVideoFallback(true);
    };

    // Set data attribute for identification
    currentVideo.dataset.index = currentSlide.toString();
    
    // Add event listeners
    currentVideo.addEventListener('loadeddata', handleLoadedData);
    currentVideo.addEventListener('error', handleError);
    currentVideo.addEventListener('play', () => setIsPlaying(true));
    currentVideo.addEventListener('pause', () => setIsPlaying(false));

    // Initialize slideshow if not already running
    if (isPageVisible && !useVideoFallback && slideIntervalRef.current === null) {
      startSlideshow();
    }

    // Initial setup
    if (currentVideo.readyState >= 3) { // HAVE_FUTURE_DATA or higher
      setupVideo();
    }

    return () => {
      currentVideo.removeEventListener('loadeddata', handleLoadedData);
      currentVideo.removeEventListener('error', handleError);
      currentVideo.removeEventListener('play', () => setIsPlaying(true));
      currentVideo.removeEventListener('pause', () => setIsPlaying(false));
    };
  }, [currentSlide, autoPlay, muted, loop, isPageVisible, useVideoFallback]);

  // Handle slideshow
  useEffect(() => {
    if (useVideoFallback) {
      // Simple slideshow for image fallback
      startSlideshow();
    } else if (isPageVisible) {
      startSlideshow();
    }

    return () => {
      stopSlideshow();
    };
  }, [slideDuration, useVideoFallback, isPageVisible]);

  // Pause all other videos when changing slides
  useEffect(() => {
    videoRefs.current.forEach((video, index) => {
      if (!video) return;
      
      if (index === currentSlide) {
        // Current slide - try to play if conditions are right
        if (isPageVisible && !useVideoFallback) {
          try {
            const playPromise = video.play();
            if (playPromise !== undefined) {
              playPromiseRefs.current[index] = playPromise;
            }
          } catch (err) {
            console.warn('Cannot play current slide video:', err);
          }
        }
      } else {
        // Not current slide - pause if playing
        if (!video.paused) {
          try {
            video.pause();
            // Reset to beginning for smoother transition when it becomes active
            video.currentTime = 0;
          } catch (err) {
            console.warn('Error pausing video:', err);
          }
        }
      }
    });
  }, [currentSlide, isPageVisible, useVideoFallback]);

  const play = (index: number) => {
    const video = videoRefs.current[index];
    if (!video) return;
    
    try {
      playPromiseRefs.current[index] = video.play();
    } catch (err) {
      console.warn('Error playing video:', err);
    }
  };

  const pause = (index: number) => {
    const video = videoRefs.current[index];
    if (!video) return;
    
    try {
      if (playPromiseRefs.current[index]) {
        playPromiseRefs.current[index]?.then(() => {
          video.pause();
        }).catch(() => {
          try {
            video.pause();
          } catch (err) {
            console.warn('Error pausing video:', err);
          }
        });
      } else {
        video.pause();
      }
    } catch (err) {
      console.warn('Error pausing video:', err);
    }
  };

  const togglePlay = (index: number) => {
    const video = videoRefs.current[index];
    if (!video) return;
    
    if (video.paused) {
      play(index);
    } else {
      pause(index);
    }
  };

  const registerVideo = (video: HTMLVideoElement) => {
    videoRefs.current.push(video);
  };

  const unregisterVideo = (video: HTMLVideoElement) => {
    videoRefs.current = videoRefs.current.filter(v => v !== video);
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
    setUseVideoFallback,
    registerVideo,
    unregisterVideo
  };

  return (
    <VideoContext.Provider value={value}>
      {children}
    </VideoContext.Provider>
  );
};

export const useVideoContext = () => useContext(VideoContext);

export default VideoContext; 