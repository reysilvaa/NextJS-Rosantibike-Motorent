"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useTranslation } from "@/i18n/hooks"
import reviewsData from "@/lib/data/reviews.json"

interface Review {
  "nama pengulas": string;
  profil: string | number;
  "tgl ulasan": string;
  "isi ulasan": string;
  rating: number;
}

export default function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0)
  const { t } = useTranslation()
  const [reviews, setReviews] = useState<Review[]>([])

  useEffect(() => {
    // Mengambil 8 ulasan acak dari reviewsData
    const shuffled = [...reviewsData].sort(() => 0.5 - Math.random());
    const selectedReviews = shuffled.slice(0, 8);
    setReviews(selectedReviews);
  }, []);

  const nextTestimonial = () => {
    setActiveIndex((prev) => (prev + 1) % reviews.length)
  }

  const prevTestimonial = () => {
    setActiveIndex((prev) => (prev - 1 + reviews.length) % reviews.length)
  }

  // Mendapatkan inisial dari nama pengulas
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  }

  // Jika belum ada data yang dimuat
  if (reviews.length === 0) {
    return null;
  }

  return (
    <section className="py-20 bg-gradient-to-b from-background/80 to-background">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{t("testimonialsTitle")}</h2>
          <p className="text-muted-foreground">
            {t("testimonialsDescription")}
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${activeIndex * 100}%)` }}
            >
              {reviews.map((review, index) => (
                <div key={index} className="w-full flex-shrink-0 px-4">
                  <Card className="bg-card/50 border-border h-full">
                    <CardContent className="p-8 h-full flex flex-col">
                      <div className="flex flex-col md:flex-row gap-6 items-center md:items-start h-full">
                        {review.profil && review.profil !== "" ? (
                          <div className="relative w-20 h-20 rounded-full overflow-hidden flex-shrink-0">
                            <Image
                              src={review.profil as string}
                              alt={review["nama pengulas"]}
                              fill
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-20 h-20 rounded-full flex-shrink-0 bg-primary flex items-center justify-center text-white font-bold text-xl">
                            {getInitials(review["nama pengulas"])}
                          </div>
                        )}
                        <div className="flex-1 text-center md:text-left flex flex-col h-full">
                          <div className="flex justify-center md:justify-start mb-2">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-5 w-5 ${
                                  i < review.rating ? "text-yellow-500 fill-yellow-500" : "text-muted"
                                }`}
                              />
                            ))}
                          </div>
                          <p className="text-foreground/80 mb-4 italic flex-grow min-h-[100px] overflow-y-auto">&ldquo;{review["isi ulasan"]}&rdquo;</p>
                          <div>
                            <h4 className="font-semibold">{review["nama pengulas"]}</h4>
                            <p className="text-muted-foreground text-sm">{review["tgl ulasan"]}</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>

          <Button
            variant="outline"
            size="icon"
            className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1/2 z-10"
            onClick={prevTestimonial}
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">{t("previousTestimonial")}</span>
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-1/2 z-10"
            onClick={nextTestimonial}
          >
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">{t("nextTestimonial")}</span>
          </Button>

          <div className="flex justify-center mt-6 gap-2">
            {reviews.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === activeIndex ? "bg-primary w-6" : "bg-muted"
                }`}
                aria-label={t("goToTestimonial", { number: index + 1 })}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

