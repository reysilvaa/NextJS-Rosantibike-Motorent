"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react'
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useTranslation } from "@/i18n/hooks"
import reviewsData from "@/lib/data/reviews.json"

interface Review {
  "nama pengulas": string
  profil: string | number
  "tgl ulasan": string
  "isi ulasan": string
  rating: number
}

export default function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [autoplay, setAutoplay] = useState(true)
  const { t } = useTranslation()
  const [reviews, setReviews] = useState<Review[]>([])
  const autoplayRef = useRef<NodeJS.Timeout | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Mengambil 8 ulasan acak dari reviewsData
    const shuffled = [...reviewsData].sort(() => 0.5 - Math.random())
    const selectedReviews = shuffled.slice(0, 8)
    setReviews(selectedReviews)
  }, [])

  useEffect(() => {
    if (autoplay && reviews.length > 0) {
      autoplayRef.current = setInterval(() => {
        setActiveIndex((prev) => (prev + 1) % reviews.length)
      }, 5000)
    }
    
    return () => {
      if (autoplayRef.current) {
        clearInterval(autoplayRef.current)
      }
    }
  }, [autoplay, reviews.length])

  const nextTestimonial = () => {
    if (autoplayRef.current) {
      clearInterval(autoplayRef.current)
      setAutoplay(false)
    }
    setActiveIndex((prev) => (prev + 1) % reviews.length)
  }

  const prevTestimonial = () => {
    if (autoplayRef.current) {
      clearInterval(autoplayRef.current)
      setAutoplay(false)
    }
    setActiveIndex((prev) => (prev - 1 + reviews.length) % reviews.length)
  }

  // Mendapatkan inisial dari nama pengulas
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  // Jika belum ada data yang dimuat
  if (reviews.length === 0) {
    return null
  }

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/80 to-background -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(var(--primary),0.05),transparent_70%)]"></div>
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4" ref={containerRef}>
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2
            className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            {t("testimonialsTitle")}
          </motion.h2>
          <motion.p
            className="text-muted-foreground text-lg"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {t("testimonialsDescription")}
          </motion.p>
        </div>

        <div className="relative max-w-5xl mx-auto">
          {/* Large quote icon */}
          <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 text-primary/10">
            <Quote className="w-24 h-24" />
          </div>

          <div className="overflow-hidden">
            <AnimatePresence initial={false} mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="w-full"
              >
                <Card className="bg-card/50 backdrop-blur-sm border-primary/10 shadow-xl shadow-primary/5 overflow-hidden">
                  <CardContent className="p-0">
                    <div className="grid grid-cols-1 md:grid-cols-5">
                      {/* Reviewer image/profile - takes up 2/5 on desktop */}
                      <div className="md:col-span-2 bg-gradient-to-br from-primary/10 to-primary/5 p-8 flex flex-col items-center justify-center text-center">
                        {reviews[activeIndex].profil && reviews[activeIndex].profil !== "" ? (
                          <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg mb-4">
                            <Image
                              src={(reviews[activeIndex].profil as string) || "/placeholder.svg"}
                              alt={reviews[activeIndex]["nama pengulas"]}
                              fill
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-white font-bold text-3xl shadow-lg mb-4">
                            {getInitials(reviews[activeIndex]["nama pengulas"])}
                          </div>
                        )}
                        <h3 className="text-xl font-bold">{reviews[activeIndex]["nama pengulas"]}</h3>
                        <p className="text-muted-foreground text-sm mt-1">{reviews[activeIndex]["tgl ulasan"]}</p>
                        
                        <div className="flex mt-4">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-5 w-5 ${
                                i < reviews[activeIndex].rating ? "text-yellow-500 fill-yellow-500" : "text-muted"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      
                      {/* Review content - takes up 3/5 on desktop */}
                      <div className="md:col-span-3 p-8 md:p-12 flex items-center">
                        <blockquote className="text-lg md:text-xl italic text-foreground/90 leading-relaxed">
                          &ldquo;{reviews[activeIndex]["isi ulasan"]}&rdquo;
                        </blockquote>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex justify-between items-center mt-8">
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Button
                variant="outline"
                size="icon"
                className="rounded-full border-primary/20 hover:border-primary hover:bg-primary/5"
                onClick={prevTestimonial}
              >
                <ChevronLeft className="h-5 w-5" />
                <span className="sr-only">{t("previousTestimonial")}</span>
              </Button>
            </motion.div>

            <div className="flex gap-2">
              {reviews.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setActiveIndex(index)
                    if (autoplayRef.current) {
                      clearInterval(autoplayRef.current)
                      setAutoplay(false)
                    }
                  }}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === activeIndex ? "bg-primary w-8" : "bg-muted hover:bg-primary/50"
                  }`}
                  aria-label={t("goToTestimonial", { number: index + 1 })}
                />
              ))}
            </div>

            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Button
                variant="outline"
                size="icon"
                className="rounded-full border-primary/20 hover:border-primary hover:bg-primary/5"
                onClick={nextTestimonial}
              >
                <ChevronRight className="h-5 w-5" />
                <span className="sr-only">{t("nextTestimonial")}</span>
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
