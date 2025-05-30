'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, ChevronRight, Search } from 'lucide-react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { useEffect, useRef, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useVideoContext } from '@/contexts/video-context';
import { useAppTranslations } from '@/i18n/hooks';
import { fetchMotorcycleTypes } from '@/lib/network/api';
import { MotorcycleType } from '@/lib/types/motorcycle';

// Memindahkan form pencarian ke komponen terpisah untuk mengurangi bundle size halaman utama
const SearchForm = dynamic(() => import('@/components/home/search-form'), {
  ssr: false,
  loading: () => (
    <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl border border-white/20 shadow-2xl animate-pulse">
      <div className="h-6 w-32 bg-white/20 rounded mb-4"></div>
      <div className="space-y-4">
        <div className="h-10 bg-white/20 rounded"></div>
        <div className="grid grid-cols-2 gap-4">
          <div className="h-10 bg-white/20 rounded"></div>
          <div className="h-10 bg-white/20 rounded"></div>
        </div>
        <div className="h-10 bg-primary/50 rounded"></div>
      </div>
    </div>
  ),
});

interface SlideType {
  videoUrl: string;
  title: string;
  subtitle: string;
  badge?: string;
  imageAlt?: string;
}

export default function Hero() {
  const { t } = useAppTranslations();
  const { theme } = useTheme();
  const {
    videoRefs,
    currentSlide,
    isPlaying: _isPlaying,
    setCurrentSlide,
    isPageVisible: _isPageVisible,
    useVideoFallback,
    setUseVideoFallback,
  } = useVideoContext();

  const [loadedVideos, setLoadedVideos] = useState<number[]>([0]);
  const [showSearch, setShowSearch] = useState(false);
  const [motorcycleTypes, setMotorcycleTypes] = useState<MotorcycleType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [_imagesLoaded, _setImagesLoaded] = useState(false);
  const [videoLoading, setVideoLoading] = useState<{ [key: number]: boolean }>({ 0: true });

  // Menyimpan promise pemutaran video yang sedang aktif
  const playPromisesRef = useRef<{ [key: number]: Promise<void> | null }>({});

  // Definisi slides
  const slides: SlideType[] = [
    {
      videoUrl:
        'https://res.cloudinary.com/dxuxgut2c/video/upload/q_auto:low,f_auto/rental-motor/video/q0gtp8z72bayzdwqo7cp.mp4',
      title: t('heroSlide1Title') || 'Jelajahi Keindahan dengan Motor Matic',
      subtitle:
        t('heroSlide1Subtitle') || 'Pengalaman wisata nyaman dengan motor matic berkualitas',
      badge: 'Popular',
      imageAlt: 'Motor matic untuk wisata di Malang - Honda Vario 125',
    },
    {
      videoUrl:
        'https://res.cloudinary.com/dxuxgut2c/video/upload/q_auto:low,f_auto/rental-motor/video/qst0cbu2au5l9qyks1xr.mp4',
      title: t('heroSlide2Title') || 'Liburan Lebih Fleksibel dengan Motor Sewaan',
      subtitle:
        t('heroSlide2Subtitle') || 'Jangkau tempat wisata tersembunyi dengan bebas dan praktis',
      badge: 'New',
      imageAlt: 'Liburan dengan motor sewaan di Malang - Yamaha NMAX',
    },
    {
      videoUrl:
        'https://res.cloudinary.com/dxuxgut2c/video/upload/q_auto:low,f_auto/rental-motor/video/bykdq8mjfivukkfkujtw.mp4',
      title: t('heroSlide3Title') || 'Harga Terjangkau, Kualitas Terjamin',
      subtitle: t('heroSlide3Subtitle') || 'Nikmati tarif sewa kompetitif dengan pelayanan premium',
      badge: 'Best Value',
      imageAlt: 'Rental motor berkualitas dengan harga terjangkau di Malang',
    },
    {
      videoUrl:
        'https://res.cloudinary.com/dxuxgut2c/video/upload/q_auto:low,f_auto/rental-motor/video/lyg6nonp8jj1ywzjqggh.mp4',
      title: t('heroSlide4Title') || 'Paket Wisata Motor Matic Hemat',
      subtitle:
        t('heroSlide4Subtitle') ||
        'Kombinasi sewa motor dan panduan wisata untuk pengalaman terbaik',
      badge: 'Featured',
      imageAlt: 'Paket wisata hemat dengan motor matic di Malang',
    },
    {
      videoUrl:
        'https://res.cloudinary.com/dxuxgut2c/video/upload/q_auto:low,f_auto/rental-motor/video/cljiyl0dbkokzax2pecf.mp4',
      title: t('heroSlide5Title') || 'Berkeliling Kota dengan Nyaman',
      subtitle:
        t('heroSlide5Subtitle') || 'Motor matic irit dan mudah dikendarai untuk wisata perkotaan',
      badge: 'Trending',
      imageAlt: 'Berkeliling kota Malang dengan motor matic yang nyaman dan irit',
    },
  ];

  // Force using image fallback on mobile to improve performance
  useEffect(() => {
    // Pastikan video diputar untuk semua perangkat
    if (useVideoFallback) {
      setUseVideoFallback(false);
    }
  }, [useVideoFallback, setUseVideoFallback]);

  // Fetch motorcycle types from API
  useEffect(() => {
    const getMotorcycleTypes = async () => {
      try {
        setIsLoading(true);
        const data = await fetchMotorcycleTypes();
        if (data && Array.isArray(data) && data.length > 0) {
          setMotorcycleTypes(data);
        }
        setIsLoading(false);
      } catch (err) {
        console.error('Error loading motorcycle types:', err);
      }
    };

    getMotorcycleTypes();
  }, []);

  // Preload hanya slide saat ini dan berikutnya
  useEffect(() => {
    const nextSlideIndex = (currentSlide + 1) % slides.length;
    setLoadedVideos(prev => {
      if (!prev.includes(currentSlide)) {
        return [...prev, currentSlide];
      }
      if (!prev.includes(nextSlideIndex)) {
        return [...prev, nextSlideIndex];
      }
      return prev;
    });
  }, [currentSlide, slides.length]);

  // Menangani perubahan slide dengan menjaga pemutaran video
  useEffect(() => {
    // Pertama, pastikan video current slide diputar
    const currentVideo = videoRefs.current[currentSlide];

    if (currentVideo && !useVideoFallback) {
      // Putar video dengan aman menggunakan Promise
      try {
        const playPromise = currentVideo.play();

        // Hanya jika browser mengembalikan Promise, simpan untuk referensi
        if (playPromise !== undefined) {
          playPromisesRef.current[currentSlide] = playPromise;

          // Handle jika pemutaran berhasil
          playPromise
            .then(() => {
              // Pemutaran berhasil
              playPromisesRef.current[currentSlide] = null;
            })
            .catch(error => {
              // Abaikan AbortError karena kita sudah menanganinya
              if (error.name !== 'AbortError') {
                console.error('Video playback error:', error);
              }
              playPromisesRef.current[currentSlide] = null;
            });
        }
      } catch (error) {
        console.error('Error playing video:', error);
      }
    }

    // Cleanup: Pause video yang tidak aktif
    return () => {
      // Untuk semua video, cek jika ada yang bukan current slide
      Object.keys(videoRefs.current).forEach(slideIndex => {
        const index = Number(slideIndex);
        if (index !== currentSlide) {
          const video = videoRefs.current[index];
          const playPromise = playPromisesRef.current[index];

          if (video) {
            if (playPromise) {
              // Jika masih ada Promise pemutaran yang aktif
              playPromise
                .then(() => {
                  // Tunggu pemutaran selesai, baru pause
                  video.pause();
                })
                .catch(() => {
                  // Abaikan error
                });
            } else {
              // Tidak ada Promise aktif, langsung pause
              video.pause();
            }
          }
        }
      });
    };
  }, [currentSlide, useVideoFallback, videoRefs]);

  // Cleanup ketika komponen unmount
  useEffect(() => {
    return () => {
      // Pause semua video saat unmount untuk mencegah memory leak
      Object.keys(videoRefs.current).forEach(slideIndex => {
        const index = Number(slideIndex);
        const video = videoRefs.current[index];
        const playPromise = playPromisesRef.current[index];

        if (video) {
          if (playPromise) {
            playPromise
              .then(() => {
                video.pause();
              })
              .catch(() => {
                // Abaikan error
              });
          } else {
            video.pause();
          }
        }
      });
    };
  }, [videoRefs]);

  // Handler video loaded
  const handleVideoLoadStart = (index: number) => {
    setVideoLoading(prev => ({
      ...prev,
      [index]: true,
    }));
  };

  const handleVideoCanPlay = (index: number) => {
    setVideoLoading(prev => ({
      ...prev,
      [index]: false,
    }));
  };

  // Set custom attributes for mobile video playback
  useEffect(() => {
    // Iterasi semua video yang sudah dimuat
    loadedVideos.forEach(index => {
      const video = videoRefs.current[index];
      if (video) {
        // Tambahkan atribut khusus untuk pemutaran di browser mobile
        video.setAttribute('webkit-playsinline', 'true');
        video.setAttribute('x5-playsinline', 'true');
        video.setAttribute('x5-video-player-type', 'h5');
        video.setAttribute('x5-video-player-fullscreen', 'false');
        video.setAttribute('x5-video-orientation', 'portraint');

        // Set playback rate untuk performa lebih baik
        video.playbackRate = 1.0;

        // Pastikan video dimuat dengan prioritas tinggi untuk slide saat ini
        if (index === currentSlide) {
          video.setAttribute('importance', 'high');
        }

        // Force restart video jika sudah dimuat
        if (video.readyState >= 2 && index === currentSlide) {
          video.currentTime = 0;
          try {
            const playPromise = video.play();
            if (playPromise !== undefined) {
              playPromise.catch(error => {
                console.info('Video playback error:', error);
              });
            }
          } catch (error) {
            console.warn('Error playing video:', error);
          }
        }
      }
    });
  }, [loadedVideos, videoRefs, currentSlide]);

  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Video Slides */}
      {slides.map((slide, index) => {
        if (!loadedVideos.includes(index) && index !== currentSlide) {
          return null;
        }

        return (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          >
            <div className="absolute inset-0 w-full h-full">
              {/* Background color sebagai pengganti placeholder */}
              <div
                className={`absolute inset-0 bg-gray-900 transition-opacity duration-500 ${
                  videoLoading[index] ? 'opacity-100' : 'opacity-0'
                }`}
              />

              <video
                ref={el => {
                  videoRefs.current[index] = el;
                }}
                src={slide.videoUrl}
                className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
                style={{
                  opacity: videoLoading[index] ? 0 : 1,
                }}
                muted
                playsInline
                loop
                autoPlay={index === currentSlide}
                preload={index === currentSlide ? 'auto' : 'none'} // Hanya preload video saat ini
                disablePictureInPicture
                disableRemotePlayback
                onLoadStart={() => handleVideoLoadStart(index)}
                onCanPlay={() => handleVideoCanPlay(index)}
                aria-label={slide.imageAlt || `Video slide ${index + 1}`}
              />
              <div
                className={`absolute inset-0 ${theme === 'light' ? 'bg-black/60' : 'bg-black/50'} bg-gradient-to-b from-black/70 via-black/40 to-transparent`}
              />
            </div>
          </div>
        );
      })}

      {/* Content */}
      <div className="absolute inset-0 flex items-center justify-center px-4 sm:px-6 lg:px-8 z-20 bg-gradient-to-b from-transparent via-primary/5 to-background/80 dark:to-background/60">
        <div className="max-w-7xl w-full mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left side - Hero text */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                {slides[currentSlide].badge && (
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="mb-6"
                  >
                    <Badge className="bg-primary/90 text-white px-4 py-1 text-sm rounded-full">
                      {slides[currentSlide].badge}
                    </Badge>
                  </motion.div>
                )}

                <motion.h1
                  className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 text-white leading-tight"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  {slides[currentSlide].title}
                </motion.h1>

                <motion.p
                  className="text-xl md:text-2xl text-white/90 mb-8 max-w-xl"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  {slides[currentSlide].subtitle}
                </motion.p>

                <motion.div
                  className="flex flex-wrap gap-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      size="lg"
                      className="bg-primary hover:bg-primary/90 text-white group"
                      onClick={() => setShowSearch(!showSearch)}
                    >
                      <Search className="mr-2 h-5 w-5" />
                      {t('findMotorcycle') || 'Find a Motorcycle'}
                      <ArrowRight className="ml-2 h-4 w-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    </Button>
                  </motion.div>

                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link href="/motorcycles">
                      <Button
                        size="lg"
                        variant="outline"
                        className="border-white border-2 bg-white/10 hover:bg-white/20 text-white"
                      >
                        {t('browseMotorcycles') || 'Browse Motorcycles'}
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </motion.div>
                </motion.div>
              </motion.div>
            </AnimatePresence>

            {/* Right side - Quick search form */}
            {showSearch && <SearchForm motorcycleTypes={motorcycleTypes} isLoading={isLoading} />}
          </div>
        </div>
      </div>

      {/* Slide indicators */}
      <div className="absolute bottom-8 left-0 right-0 z-20 flex justify-center gap-2">
        {slides.map((_, index) => (
          <motion.button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentSlide ? 'bg-primary w-8' : 'bg-white/50 hover:bg-white/80'
            }`}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.8 }}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
