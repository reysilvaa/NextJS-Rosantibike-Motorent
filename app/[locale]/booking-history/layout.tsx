import { generateMetadata } from '@/lib/seo/config';
import { generateKeywords } from '@/lib/seo/keywords';

export const metadata = generateMetadata({
  title: 'Booking History - Rosantibike Motorent',
  description: 'View your booking history and track your reservations with Rosantibike Motorent.',
  keywords: generateKeywords('booking-history'),
  openGraph: {
    url: 'https://rosantibikemotorent.com/booking-history',
    images: ['/images/booking-og.jpg'],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: 'https://rosantibikemotorent.com/booking-history',
  },
});

export default function BookingHistoryLayout({ children }: { children: React.ReactNode }) {
  return children;
}
