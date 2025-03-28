"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Calendar, ChevronRight } from "lucide-react"
import { useTranslation } from "@/i18n/hooks"

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const { t, language } = useTranslation()

  const slides = [
    {
      image: "/placeholder.svg?height=1080&width=1920",
      title: t("heroSlide1Title") || "Experience the Thrill of the Road",
      subtitle: t("heroSlide1Subtitle") || "Premium motorcycles for your adventures",
    },
    {
      image: "/placeholder.svg?height=1080&width=1920",
      title: t("heroSlide2Title") || "Ride in Style",
      subtitle: t("heroSlide2Subtitle") || "Choose from our wide range of motorcycles",
    },
    {
      image: "/placeholder.svg?height=1080&width=1920",
      title: t("heroSlide3Title") || "Affordable Luxury",
      subtitle: t("heroSlide3Subtitle") || "Quality rides at competitive prices",
    },
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [slides.length])

  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Background Slides */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? "opacity-100" : "opacity-0"
          }`}
        >
          <Image src={slide.image || "/placeholder.svg"} alt={slide.title} fill priority className="object-cover" />
          <div className="absolute inset-0 bg-background/50" />
        </div>
      ))}

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 h-full flex flex-col justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-4">{slides[currentSlide].title}</h1>
          <p className="text-xl md:text-2xl text-foreground/80 mb-8">{slides[currentSlide].subtitle}</p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/motorcycles">
              <Button
                size="lg"
                className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground"
              >
                {t("motorcycles")}
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/availability">
              <Button size="lg" variant="outline" className="border-border/20 hover:bg-background/10">
                <Calendar className="mr-2 h-4 w-4" />
                {t("availability")}
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Slide Indicators */}
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

