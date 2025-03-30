import dynamic from 'next/dynamic'
import Hero from "@/components/home/hero"

// Dynamic import untuk komponen berat dengan loading fallback yang sederhana
const FeaturedMotorcycles = dynamic(() => import("@/components/home/featured-motorcycles"), {
  loading: () => <div className="w-full py-20 bg-gradient-to-b from-background to-background/80"></div>,
  ssr: true
})

const HowItWorks = dynamic(() => import("@/components/home/how-it-works"), {
  ssr: true
})

const Testimonials = dynamic(() => import("@/components/home/testimonials"), {
  ssr: true
})

const BlogPreview = dynamic(() => import("@/components/home/blog-preview"), {
  ssr: true
})

const ContactSection = dynamic(() => import("@/components/home/contact-section"), {
  ssr: true
})

const AvailabilityPreview = dynamic(() => import("@/components/home/availability-preview"), {
  ssr: true
})

export default function Home() {
  return (
    <div className="flex flex-col w-full">
      <Hero />
      <FeaturedMotorcycles />
      <HowItWorks />
      <AvailabilityPreview />
      <Testimonials />
      <BlogPreview />
      <ContactSection />
    </div>
  )
}

