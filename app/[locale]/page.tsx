'use client';

import { motion } from 'framer-motion';

import AvailabilityPreview from '@/components/home/availability-preview';
import BlogPreview from '@/components/home/blog-preview';
import ContactSection from '@/components/home/contact-section';
import FeaturedMotorcycles from '@/components/home/featured-motorcycles';
import Hero from '@/components/home/hero';
import HowItWorks from '@/components/home/how-it-works';
import Testimonials from '@/components/home/testimonials';
import { VideoContextProvider } from '@/contexts/video-context';

export default function Home() {
  return (
    <div className="flex flex-col w-full relative overflow-hidden">
      {/* Global Background Gradient - Made more prominent */}
      <div className="absolute inset-0 -z-20 bg-gradient-to-b from-background via-primary/5 to-background/80 dark:from-background/80 dark:via-primary/3 dark:to-background/60" />

      <h1 className="sr-only">Rosantibike Motorent - Rental Motor Premium di Malang</h1>
      <VideoContextProvider>
        <Hero />
      </VideoContextProvider>
      <h2 className="sr-only">
        Rosantibike Motorent - Layanan Sewa Motor Berkualitas di Malang Kota
      </h2>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        <FeaturedMotorcycles />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
      >
        <HowItWorks />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
      >
        <AvailabilityPreview />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.6, ease: 'easeOut' }}
      >
        <Testimonials />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.8, ease: 'easeOut' }}
      >
        <BlogPreview />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 1.0, ease: 'easeOut' }}
      >
        <ContactSection />
      </motion.div>
    </div>
  );
}
