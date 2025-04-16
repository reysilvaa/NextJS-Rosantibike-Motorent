import { generateMetadata } from '@/lib/seo/config';
import { generateKeywords } from '@/lib/seo/keywords';

export const metadata = generateMetadata({
  title: 'Booking History - Rosanti Bike Rental',
  description: 'View your motorcycle rental booking history and manage your reservations.',
  keywords: generateKeywords('booking-history'),
  openGraph: {
    url: 'https://rosantibikemotorent.com/booking-history',
    images: ['/images/booking-history-og.jpg'],
  },
  robots: {
    index: true,
    follow: true,
  },
});

export default function BookingHistoryLayout({ children }: { children: React.ReactNode }) {
  return children;
}
