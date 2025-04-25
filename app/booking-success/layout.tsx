import { generateMetadata } from '@/lib/seo/config';
import { generateKeywords } from '@/lib/seo/keywords';

export const metadata = generateMetadata({
  title: 'Booking Success - Rosantibike Motorent',
  description:
    'Your motorcycle booking has been successfully completed. View your booking details and get ready for your ride with Rosantibike Motorent.',
  keywords: generateKeywords('booking-success'),
  openGraph: {
    url: 'https://rosantibikemotorent.com/booking-success',
    images: ['/images/booking-success-og.jpg'],
  },
  robots: {
    index: false,
    follow: false,
  },
});

export default function BookingSuccessLayout({ children }: { children: React.ReactNode }) {
  return children;
}
