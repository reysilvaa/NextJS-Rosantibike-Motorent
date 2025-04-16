import type { Metadata } from "next"
import { generateMetadata } from '@/lib/seo/config';
import { generateKeywords } from '@/lib/seo/keywords';

export const metadata = generateMetadata({
  title: 'Book Your Motorcycle - Rosanti Bike Rental',
  description: 'Complete your motorcycle booking details. Fast and secure motorcycle reservation process with flexible options.',
  keywords: generateKeywords('availability', {
    additionalKeywords: ['motorcycle booking', 'reservation form', 'rental booking']
  }),
  openGraph: {
    url: 'https://rosantibikemotorent.com/availability/booking',
    images: ['/images/booking-og.jpg'],
  },
  robots: {
    index: true,
    follow: true,
  },
});

export default function BookingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children;
} 