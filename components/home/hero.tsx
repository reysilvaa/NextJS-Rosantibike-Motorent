"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Calendar, ChevronRight, ArrowRight, BikeIcon, Search } from 'lucide-react'
import { useTranslation } from "@/i18n/hooks"
import { useTheme } from "next-themes"
import { useVideoContext } from "@/contexts/video-context"
import { Badge } from "@/components/ui/badge"
import { MotorcycleType } from "@/lib/types/motorcycle"
import { fetchMotorcycleTypes } from "@/lib/network/api"

interface SlideType {
  videoUrl: string;
  imageUrl: string;
  title: string;
  subtitle: string;
  badge?: string;
}

interface SearchFormType {
  motorcycleTypeId: string;
  pickupDate: string;
  returnDate: string;
}

export default function Hero() {
  const { t, language } = useTranslation()
  const { theme } = useTheme()
  const { videoRefs, currentSlide, isPlaying, setCurrentSlide, isPageVisible, useVideoFallback, setUseVideoFallback } =
    useVideoContext()
  
  const [loadedVideos, setLoadedVideos] = useState<number[]>([0])
  const [showSearch, setShowSearch] = useState(false)
  const [motorcycleTypes, setMotorcycleTypes] = useState<MotorcycleType[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchForm, setSearchForm] = useState<SearchFormType>({
    motorcycleTypeId: "",
    pickupDate: "",
    returnDate: ""
  })

  // Fetch motorcycle types from API
  useEffect(() => {
    const getMotorcycleTypes = async () => {
      try {
        setIsLoading(true)
        const data = await fetchMotorcycleTypes()
        if (data && Array.isArray(data) && data.length > 0) {
          setMotorcycleTypes(data)
        }
        setIsLoading(false)
      } catch (err) {
        console.error("Error loading motorcycle types:", err)
        // Fallback data jika API error
        setMotorcycleTypes([
          { id: "1", merk: "Honda", model: "Vario 125", slug: "honda-vario-125", cc: 125, gambar: null, createdAt: "", updatedAt: "" },
          { id: "2", merk: "Yamaha", model: "NMAX", slug: "yamaha-nmax", cc: 155, gambar: null, createdAt: "", updatedAt: "" }
        ])
        setIsLoading(false)
      }
    }
    
    getMotorcycleTypes()
  }, [])

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setSearchForm(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // Handle form submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Redirect to motorcycles page with search params
    window.location.href = `/motorcycles?typeId=${searchForm.motorcycleTypeId}&pickup=${searchForm.pickupDate}&return=${searchForm.returnDate}`
  }

  useEffect(() => {
    const nextSlideIndex = (currentSlide + 1) % slides.length
    setLoadedVideos((prev) => {
      if (!prev.includes(currentSlide)) {
        return [...prev, currentSlide]
      }
      if (!prev.includes(nextSlideIndex)) {
        return [...prev, nextSlideIndex]
      }
      return prev
    })
  }, [currentSlide])

  const slides: SlideType[] = [
    {
      videoUrl:
        "https://res.cloudinary.com/dxuxgut2c/video/upload/q_auto:low,f_auto/rental-motor/video/q0gtp8z72bayzdwqo7cp.mp4",
      imageUrl: "/placeholder.svg?height=1080&width=1920",
      title: t("heroSlide1Title") || "Jelajahi Keindahan dengan Motor Matic",
      subtitle: t("heroSlide1Subtitle") || "Pengalaman wisata nyaman dengan motor matic berkualitas",
      badge: "Popular",
    },
    {
      videoUrl:
        "https://res.cloudinary.com/dxuxgut2c/video/upload/q_auto:low,f_auto/rental-motor/video/qst0cbu2au5l9qyks1xr.mp4",
      imageUrl: "/placeholder.svg?height=1080&width=1920",
      title: t("heroSlide2Title") || "Liburan Lebih Fleksibel dengan Motor Sewaan",
      subtitle: t("heroSlide2Subtitle") || "Jangkau tempat wisata tersembunyi dengan bebas dan praktis",
      badge: "New",
    },
    {
      videoUrl:
        "https://res.cloudinary.com/dxuxgut2c/video/upload/q_auto:low,f_auto/rental-motor/video/bykdq8mjfivukkfkujtw.mp4",
      imageUrl: "/placeholder.svg?height=1080&width=1920",
      title: t("heroSlide3Title") || "Harga Terjangkau, Kualitas Terjamin",
      subtitle: t("heroSlide3Subtitle") || "Nikmati tarif sewa kompetitif dengan pelayanan premium",
      badge: "Best Value",
    },
    {
      videoUrl:
        "https://res.cloudinary.com/dxuxgut2c/video/upload/q_auto:low,f_auto/rental-motor/video/lyg6nonp8jj1ywzjqggh.mp4",
      imageUrl: "/placeholder.svg?height=1080&width=1920",
      title: t("heroSlide4Title") || "Paket Wisata Motor Matic Hemat",
      subtitle: t("heroSlide4Subtitle") || "Kombinasi sewa motor dan panduan wisata untuk pengalaman terbaik",
      badge: "Featured",
    },
    {
      videoUrl:
        "https://res.cloudinary.com/dxuxgut2c/video/upload/q_auto:low,f_auto/rental-motor/video/cljiyl0dbkokzax2pecf.mp4",
      imageUrl: "/placeholder.svg?height=1080&width=1920",
      title: t("heroSlide5Title") || "Berkeliling Kota dengan Nyaman",
      subtitle: t("heroSlide5Subtitle") || "Motor matic irit dan mudah dikendarai untuk wisata perkotaan",
      badge: "Trending",
    },
  ]


  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Video/Image Slides */}
      {slides.map((slide, index) => {
        if (!loadedVideos.includes(index) && index !== currentSlide) {
          return null
        }

        return (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          >
            {useVideoFallback ? (
              <div className="absolute inset-0">
                <Image
                  src={slide.imageUrl || "/placeholder.svg"}
                  alt={slide.title}
                  fill
                  priority={index === currentSlide}
                  loading={index === currentSlide ? "eager" : "lazy"}
                  className="object-cover"
                />
                <div className={`absolute inset-0 ${theme === "light" ? "bg-black/65" : "bg-black/50"}`} />
              </div>
            ) : (
              <div className="absolute inset-0 w-full h-full">
                <video
                  ref={(el) => {
                    videoRefs.current[index] = el
                  }}
                  src={slide.videoUrl}
                  className="absolute inset-0 w-full h-full object-cover"
                  muted
                  playsInline
                  loop
                  preload={index === currentSlide ? "auto" : "metadata"}
                  disablePictureInPicture
                  disableRemotePlayback
                />
                <div className={`absolute inset-0 ${theme === "light" ? "bg-black/65" : "bg-black/50"}`} />
              </div>
            )}
          </div>
        )
      })}

      {/* Content */}
      <div className="absolute inset-0 flex items-center justify-center px-4 sm:px-6 lg:px-8 z-20">
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
                      {t("findMotorcycle") || "Find a Motorcycle"}
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
                        {t("browseMotorcycles") || "Browse Motorcycles"}
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </motion.div>
                </motion.div>
              </motion.div>
            </AnimatePresence>

            {/* Right side - Quick search form */}
            {showSearch && (
              <motion.form
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="bg-white/10 backdrop-blur-md p-6 rounded-xl border border-white/20 shadow-2xl"
                onSubmit={handleSearch}
              >
                <h3 className="text-white text-xl font-bold mb-4">{t("quickSearch") || "Quick Search"}</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-1">
                      {t("jenisMotor") || "Jenis Motor"}
                    </label>
                    <div className="relative">
                      <BikeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 h-5 w-5" />
                      <select 
                        className="w-full bg-white/20 border border-white/30 rounded-lg py-2 pl-10 pr-3 text-white appearance-none focus:outline-none focus:ring-2 focus:ring-primary"
                        name="motorcycleTypeId"
                        value={searchForm.motorcycleTypeId}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="" disabled className="bg-gray-800 text-white">Pilih Motor</option>
                        {isLoading ? (
                          <option value="" disabled className="bg-gray-800 text-white">Loading...</option>
                        ) : (
                          motorcycleTypes.map((motor) => (
                            <option key={motor.id} value={motor.id} className="bg-gray-800 text-white">
                              {motor.merk} {motor.model} - {motor.cc}cc
                            </option>
                          ))
                        )}
                      </select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white/80 text-sm font-medium mb-1">
                        {t("pickupDate") || "Pickup Date"}
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 h-5 w-5" />
                        <input 
                          type="date" 
                          className="w-full bg-white/20 border border-white/30 rounded-lg py-2 pl-10 pr-3 text-white appearance-none focus:outline-none focus:ring-2 focus:ring-primary"
                          name="pickupDate"
                          value={searchForm.pickupDate}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-white/80 text-sm font-medium mb-1">
                        {t("returnDate") || "Return Date"}
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 h-5 w-5" />
                        <input 
                          type="date" 
                          className="w-full bg-white/20 border border-white/30 rounded-lg py-2 pl-10 pr-3 text-white appearance-none focus:outline-none focus:ring-2 focus:ring-primary"
                          name="returnDate"
                          value={searchForm.returnDate}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>
                  </div>
                  
                  <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white">
                    <Search className="mr-2 h-4 w-4" />
                    {t("search") || "Search"}
                  </Button>
                </div>
              </motion.form>
            )}
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
              index === currentSlide ? "bg-primary w-8" : "bg-white/50 hover:bg-white/80"
            }`}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.8 }}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  )
}
