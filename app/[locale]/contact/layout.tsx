import { generateMetadata } from '@/lib/seo/config';
import { generateKeywords } from '@/lib/seo/keywords';

export const metadata = generateMetadata({
  title: 'Contact Us - Rosantibike Motorent',
  description:
    'Get in touch with Rosantibike Motorent. We are here to answer your questions about our motorcycle rental services in Malang.',
  keywords: generateKeywords('contact', {
    additionalKeywords: ['kontak rental motor', 'hubungi kami', 'rental motor malang'],
  }),
  openGraph: {
    url: 'https://rosantibikemotorent.com/contact',
    images: ['/images/contact-og.jpg'],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: 'https://rosantibikemotorent.com/contact',
  },
});

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
