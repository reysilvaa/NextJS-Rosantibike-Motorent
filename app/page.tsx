import Hero from "@/components/home/hero"
import FeaturedMotorcycles from "@/components/home/featured-motorcycles"
import HowItWorks from "@/components/home/how-it-works"
import Testimonials from "@/components/home/testimonials"
import BlogPreview from "@/components/home/blog-preview"
import ContactSection from "@/components/home/contact-section"
import AvailabilityPreview from "@/components/home/availability-preview"
import { VideoContextProvider } from "@/contexts/video-context"
import PageSeo from "@/components/shared/seo/page-seo"

export default function Home() {
  return (
    <div className="flex flex-col w-full">
      <PageSeo 
        title="Rosantibike Motorent - Rental Motor Terpercaya di Malang"
        description="Rental motor terpercaya dengan harga terjangkau dan layanan terbaik di Malang. Temukan berbagai pilihan motor untuk perjalanan Anda."
        canonicalPath="/"
        ogImage="/images/home-og.jpg"
      />
      <VideoContextProvider>
        <Hero />
      </VideoContextProvider>
      <FeaturedMotorcycles />
      <HowItWorks />
      <AvailabilityPreview />
      <Testimonials />
      <BlogPreview />
      <ContactSection />
    </div>
  )
}

