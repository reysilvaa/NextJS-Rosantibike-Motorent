import { generateMetadata } from '@/lib/seo/config';
import { generateKeywords } from '@/lib/seo/keywords';

export const metadata = generateMetadata({
  title: 'Booking Confirmation - Rosanti Bike Rental',
  description: 'Your motorcycle rental booking has been confirmed. View your reservation details.',
  keywords: generateKeywords('booking-success'),
  openGraph: {
    url: 'https://rosantibikemotorent.com/booking-success',
    images: ['/images/booking-success-og.jpg'],
  },
  robots: {
    index: true,
    follow: true,
  },
}); 