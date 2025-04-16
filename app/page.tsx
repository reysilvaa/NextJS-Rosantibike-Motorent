"use client"

import Hero from "@/components/home/hero"
import FeaturedMotorcycles from "@/components/home/featured-motorcycles"
import HowItWorks from "@/components/home/how-it-works"
import Testimonials from "@/components/home/testimonials"
import BlogPreview from "@/components/home/blog-preview"
import ContactSection from "@/components/home/contact-section"
import AvailabilityPreview from "@/components/home/availability-preview"
import { VideoContextProvider } from "@/contexts/video-context"

export default function Home() {
  return (
    <div className="flex flex-col w-full">
      <h1 className="sr-only">Rosantibike Motorent - Rental Motor Terbaik di Malang</h1>
      <VideoContextProvider>
        <Hero />
      </VideoContextProvider>
      <h2 className="sr-only">Layanan Rental Motor Premium di Malang dengan Harga Terjangkau</h2>
      <FeaturedMotorcycles />
      <HowItWorks />
      <AvailabilityPreview />
      <Testimonials />
      <BlogPreview />
      <ContactSection />
    </div>
  )
}

