'use client';

import React, { useEffect, useRef } from 'react';

import { useVideoContext } from '@/contexts/video-context';

interface VideoPlayerProps {
  src: string;
  poster?: string;
  className?: string;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  controls?: boolean;
  width?: string | number;
  height?: string | number;
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  src,
  poster,
  className = '',
  autoPlay = false,
  loop = false,
  muted = true, // Default ke muted untuk menghindari error penghematan daya
  controls = true,
  width = '100%',
  height = 'auto',
  objectFit = 'contain',
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { registerVideo, unregisterVideo, isPageVisible } = useVideoContext();

  // Daftarkan video ke VideoContext
  useEffect(() => {
    const videoElement = videoRef.current;

    if (videoElement) {
      // Tambahkan audio track kosong untuk menghindari pause otomatis oleh browser
      if (!videoElement.muted) {
        // Jika video tidak di-mute, pastikan ada audio track
        addSilentAudioTrack(videoElement);
      }

      // Daftarkan video ke context
      registerVideo(videoElement);

      // Cleanup saat komponen unmount
      return () => {
        unregisterVideo(videoElement);
      };
    }
  }, [registerVideo, unregisterVideo]);

  // Pantau perubahan visibilitas halaman
  useEffect(() => {
    const videoElement = videoRef.current;

    if (videoElement && autoPlay) {
      if (isPageVisible) {
        try {
          // Gunakan muted untuk memastikan video bisa autoplay
          videoElement.muted = true;

          const playPromise = videoElement.play();

          if (playPromise !== undefined) {
            playPromise.catch(error => {
              console.warn('Error saat mencoba autoplay video:', error);

              // Jika error terkait interaksi user, tambahkan pesan atau UI untuk interaksi
              if (error.name === 'NotAllowedError') {
                // Tambahkan overlay atau pesan di sini jika diperlukan
                console.info('Pemutaran video memerlukan interaksi pengguna');
              }
            });
          }
        } catch (error) {
          console.error('Error saat menangani autoplay:', error);
        }
      } else {
        videoElement.pause();
      }
    }
  }, [isPageVisible, autoPlay]);

  // Fungsi untuk menambahkan silent audio track
  const addSilentAudioTrack = (_video: HTMLVideoElement) => {
    try {
      // Buat audio context
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;

      const audioCtx = new AudioContext();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      // Set gain ke hampir 0 (silent)
      gainNode.gain.value = 0.001;

      // Hubungkan oscillator ke gain node dan ke destination
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      // Mulai oscillator dengan frekuensi sangat rendah
      oscillator.frequency.value = 1; // 1Hz, hampir tidak terdengar
      oscillator.start(0);

      // Stop setelah 1 detik
      setTimeout(() => {
        oscillator.stop();
      }, 1000);
    } catch (error) {
      console.warn('Tidak bisa menambahkan silent audio track:', error);
    }
  };

  return (
    <video
      ref={videoRef}
      src={src}
      poster={poster}
      className={className}
      autoPlay={autoPlay}
      loop={loop}
      muted={muted}
      controls={controls}
      playsInline // Penting untuk iOS
      style={{
        width,
        height,
        objectFit,
      }}
      onError={e => console.error('Video error:', e)}
    />
  );
};

export default VideoPlayer;
