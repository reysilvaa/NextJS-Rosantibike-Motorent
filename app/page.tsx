import Hero from "@/components/home/hero"
import FeaturedMotorcycles from "@/components/home/featured-motorcycles"
import HowItWorks from "@/components/home/how-it-works"
import Testimonials from "@/components/home/testimonials"
import BlogPreview from "@/components/home/blog-preview"
import ContactSection from "@/components/home/contact-section"
import AvailabilityPreview from "@/components/home/availability-preview"
import { VideoContextProvider } from "@/contexts/video-context"
import { generateMetadata } from '@/lib/seo/config';
import { generateKeywords } from '@/lib/seo/keywords';

export const metadata = generateMetadata({
  title: 'Rosantibike - Premium Motorcycle Rental Service',
  description: 'Experience the best motorcycle rental service in town. Choose from our wide range of high-quality bikes for your next adventure.',
  keywords: generateKeywords('home'),
  openGraph: {
    url: 'https://rosantibikemotorent.com',
    images: ['/images/home-og.jpg'],
  },
  robots: {
    index: true,
    follow: true,
  },
});

export default function Home() {
  return (
    <div className="flex flex-col w-full">
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

