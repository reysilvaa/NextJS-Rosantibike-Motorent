"use client"

import { useState } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0)

  const testimonials = [
    {
      id: 1,
      name: "Alex Johnson",
      location: "California",
      image: "/placeholder.svg?height=200&width=200",
      rating: 5,
      text: "The motorcycle was in perfect condition and the rental process was incredibly smooth. I had an amazing weekend exploring the coastal roads. Will definitely rent again!",
    },
    {
      id: 2,
      name: "Sarah Williams",
      location: "New York",
      image: "/placeholder.svg?height=200&width=200",
      rating: 5,
      text: "Exceptional service from start to finish. The staff was knowledgeable and helped me choose the perfect bike for my skill level. The online booking system was also very convenient.",
    },
    {
      id: 3,
      name: "Michael Chen",
      location: "Texas",
      image: "/placeholder.svg?height=200&width=200",
      rating: 4,
      text: "Great experience overall. The motorcycle was well-maintained and performed flawlessly during my trip. The only minor issue was a slight delay during pickup, but the staff was apologetic and professional.",
    },
    {
      id: 4,
      name: "Emily Rodriguez",
      location: "Florida",
      image: "/placeholder.svg?height=200&width=200",
      rating: 5,
      text: "As a first-time renter, I was a bit nervous, but the team made me feel comfortable and provided all the information I needed. The bike was amazing and made my vacation unforgettable!",
    },
  ]

  const nextTestimonial = () => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  return (
    <section className="py-20 bg-gradient-to-b from-gray-900 to-black">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Customers Say</h2>
          <p className="text-gray-400">
            Don't just take our word for it. Here's what our customers have to say about their rental experiences.
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${activeIndex * 100}%)` }}
            >
              {testimonials.map((testimonial) => (
                <div key={testimonial.id} className="w-full flex-shrink-0 px-4">
                  <Card className="bg-gray-900/50 border-gray-800">
                    <CardContent className="p-8">
                      <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
                        <div className="relative w-20 h-20 rounded-full overflow-hidden flex-shrink-0">
                          <Image
                            src={testimonial.image || "/placeholder.svg"}
                            alt={testimonial.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 text-center md:text-left">
                          <div className="flex justify-center md:justify-start mb-2">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-5 w-5 ${
                                  i < testimonial.rating ? "text-yellow-500 fill-yellow-500" : "text-gray-600"
                                }`}
                              />
                            ))}
                          </div>
                          <p className="text-gray-300 mb-4 italic">"{testimonial.text}"</p>
                          <div>
                            <h4 className="font-semibold">{testimonial.name}</h4>
                            <p className="text-gray-400 text-sm">{testimonial.location}</p>
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
            <span className="sr-only">Previous testimonial</span>
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-1/2 z-10"
            onClick={nextTestimonial}
          >
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Next testimonial</span>
          </Button>

          <div className="flex justify-center mt-6 gap-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === activeIndex ? "bg-primary w-6" : "bg-gray-600"
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

