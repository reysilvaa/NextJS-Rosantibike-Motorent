import type { Metadata } from "next"
import { generateMetadata } from '@/lib/seo/config';
import { generateKeywords } from '@/lib/seo/keywords';

export const metadata = generateMetadata({
  title: 'Check Availability - Rosanti Bike Rental',
  description: 'Check the availability of motorcycles for your desired rental dates and book your ride with Rosanti Bike Rental.',
  keywords: generateKeywords('availability', {
    additionalKeywords: ['cek ketersediaan motor', 'booking motor', 'jadwal rental']
  }),
  openGraph: {
    url: 'https://rosantibikemotorent.com/availability',
    images: ['/images/availability-og.jpg'],
  },
  robots: {
    index: true,
    follow: true,
  },
});

export default function AvailabilityLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children;
} 