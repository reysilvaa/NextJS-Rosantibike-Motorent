"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Calendar, ChevronRight } from "lucide-react"
import { useTranslation } from "@/i18n/hooks"
import { useTheme } from "next-themes"
import { useVideoContext } from "@/contexts/video-context"

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [useVideoFallback, setUseVideoFallback] = useState(false)
  const { t, language } = useTranslation()
  const { theme } = useTheme()
  const videoRefs = useRef<Array<HTMLVideoElement | null>>([])
  const { isPageVisible } = useVideoContext()
  const processedRef = useRef(false)

  const slides = [
    {
      videoUrl: "https://res.cloudinary.com/dxuxgut2c/video/upload/rental-motor/video/q0gtp8z72bayzdwqo7cp.mp4",
      imageUrl: "/placeholder.svg?height=1080&width=1920",
      title: t("heroSlide1Title") || "Jelajahi Keindahan dengan Motor Matic",
      subtitle: t("heroSlide1Subtitle") || "Pengalaman wisata nyaman dengan motor matic berkualitas",
    },
    {
      videoUrl: "https://res.cloudinary.com/dxuxgut2c/video/upload/rental-motor/video/qst0cbu2au5l9qyks1xr.mp4",
      imageUrl: "/placeholder.svg?height=1080&width=1920",
      title: t("heroSlide2Title") || "Liburan Lebih Fleksibel dengan Motor Sewaan",
      subtitle: t("heroSlide2Subtitle") || "Jangkau tempat wisata tersembunyi dengan bebas dan praktis",
    },
    {
      videoUrl: "https://res.cloudinary.com/dxuxgut2c/video/upload/rental-motor/video/bykdq8mjfivukkfkujtw.mp4",
      imageUrl: "/placeholder.svg?height=1080&width=1920",
      title: t("heroSlide3Title") || "Harga Terjangkau, Kualitas Terjamin",
      subtitle: t("heroSlide3Subtitle") || "Nikmati tarif sewa kompetitif dengan pelayanan premium",
    },
    {
      videoUrl: "https://res.cloudinary.com/dxuxgut2c/video/upload/rental-motor/video/lyg6nonp8jj1ywzjqggh.mp4",
      imageUrl: "/placeholder.svg?height=1080&width=1920",
      title: t("heroSlide4Title") || "Paket Wisata Motor Matic Hemat",
      subtitle: t("heroSlide4Subtitle") || "Kombinasi sewa motor dan panduan wisata untuk pengalaman terbaik",
    },
    {
      videoUrl: "https://res.cloudinary.com/dxuxgut2c/video/upload/rental-motor/video/cljiyl0dbkokzax2pecf.mp4",
      imageUrl: "/placeholder.svg?height=1080&width=1920",
      title: t("heroSlide5Title") || "Berkeliling Kota dengan Nyaman",
      subtitle: t("heroSlide5Subtitle") || "Motor matic irit dan mudah dikendarai untuk wisata perkotaan",
    },
    {
      videoUrl: "https://res.cloudinary.com/dxuxgut2c/video/upload/rental-motor/video/ojy4yh9urck1pszysvto.mp4",
      imageUrl: "/placeholder.svg?height=1080&width=1920",
      title: t("heroSlide6Title") || "Motor Matic untuk Segala Kebutuhan",
      subtitle: t("heroSlide6Subtitle") || "Tersedia berbagai jenis motor matic sesuai dengan rencana perjalanan Anda",
    },
    {
      videoUrl: "https://res.cloudinary.com/dxuxgut2c/video/upload/rental-motor/video/ysed7qkyskikc36yto80.mp4",
      imageUrl: "/placeholder.svg?height=1080&width=1920",
      title: t("heroSlide7Title") || "Bebas Bereksplorasi Tanpa Batas",
      subtitle: t("heroSlide7Subtitle") || "Temukan sudut-sudut wisata menarik dengan kebebasan berkendara sendiri",
    },
  ]

  function addSilentAudioTrack(video: HTMLVideoElement) {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      
      const audioCtx = new AudioContext();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      
      gainNode.gain.value = 0.001;
      
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      
      oscillator.frequency.value = 1;
      oscillator.start(0);
      
      setTimeout(() => {
        oscillator.stop();
      }, 1000);
    } catch (error) {
      console.warn('Tidak bisa menambahkan silent audio track:', error);
    }
  }

  useEffect(() => {
    if (processedRef.current) return;

    videoRefs.current.forEach(video => {
      if (video) {
        video.muted = true;
        video.setAttribute('playsinline', '');
        video.setAttribute('loop', '');
      }
    });

    processedRef.current = true;
  }, []);

  useEffect(() => {
    if (useVideoFallback) return;
    
    const currentVideo = videoRefs.current[currentSlide];
    
    if (currentVideo) {
      addSilentAudioTrack(currentVideo);
      
      if (isPageVisible) {
        try {
          const playPromise = currentVideo.play();
          
          if (playPromise !== undefined) {
            playPromise.catch(err => {
              console.error("Video play error:", err);
              
              if (err.name === 'NotAllowedError') {
                currentVideo.muted = true;
                currentVideo.play().catch(() => {
                  setUseVideoFallback(true);
                });
              } else {
                setUseVideoFallback(true);
              }
            });
          }
        } catch (error) {
          console.error("Error saat memutar video:", error);
          setUseVideoFallback(true);
        }
      }
    }
    
    videoRefs.current.forEach((video, index) => {
      if (video && index !== currentSlide && !video.paused) {
        video.pause();
      }
    });
    
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % slides.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [currentSlide, isPageVisible, useVideoFallback, slides.length]);

  useEffect(() => {
    if (useVideoFallback) return;

    const currentVideo = videoRefs.current[currentSlide];
    if (!currentVideo) return;

    if (isPageVisible) {
      try {
        currentVideo.play().catch(err => {
          console.warn('Error saat memutar video setelah halaman aktif:', err);
        });
      } catch (error) {
        console.warn('Gagal memutar video setelah halaman aktif:', error);
      }
    } else {
      currentVideo.pause();
    }
  }, [isPageVisible, currentSlide, useVideoFallback]);

  return (
    <section className="relative h-screen w-full overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? "opacity-100" : "opacity-0"
          }`}
        >
          {useVideoFallback ? (
            <div className="absolute inset-0">
              <Image 
                src={slide.imageUrl} 
                alt={slide.title} 
                fill 
                priority 
                className="object-cover" 
              />
              <div className={`absolute inset-0 ${theme === 'light' ? 'bg-black/65' : 'bg-black/50'}`} />
            </div>
          ) : (
            <div className="absolute inset-0">
              <video
                ref={el => { videoRefs.current[index] = el }}
                src={slide.videoUrl}
                className="w-full h-full object-cover"
                muted
                playsInline
                loop
                disablePictureInPicture
                disableRemotePlayback
              />
              <div className={`absolute inset-0 ${theme === 'light' ? 'bg-black/65' : 'bg-black/50'}`} />
            </div>
          )}
        </div>
      ))}

      <div className="relative z-10 container mx-auto px-4 h-full flex flex-col justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-4 text-white">{slides[currentSlide].title}</h1>
          <p className="text-xl md:text-2xl text-white/90 mb-8">{slides[currentSlide].subtitle}</p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/motorcycles">
              <Button
                size="lg"
                className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground"
              >
                {t("motorcycles") || "Pilih Motor Matic"}
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/availability">
              <Button size="lg" variant="outline" className="border-white border-2 bg-white hover:bg-white/90 text-black">
                <Calendar className="mr-2 h-4 w-4" />
                {t("availability") || "Cek Ketersediaan"}
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>

      <div className="absolute bottom-8 left-0 right-0 z-10 flex justify-center gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentSlide ? "bg-primary w-8" : "bg-foreground/50 hover:bg-foreground/80"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  )
}

