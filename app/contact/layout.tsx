import type { Metadata } from "next"
import { generateMetadata } from '@/lib/seo/config';
import { generateKeywords } from '@/lib/seo/keywords';

export const metadata = generateMetadata({
  title: 'Contact Us - Rosanti Bike Rental',
  description: 'Get in touch with Rosanti Bike Rental. We\'re here to help you with your motorcycle rental needs and answer any questions you may have.',
  keywords: generateKeywords('contact'),
  openGraph: {
    url: 'https://rosantibikemotorent.com/contact',
    images: ['/images/contact-og.jpg'],
  },
  robots: {
    index: true,
    follow: true,
  },
});

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children;
} 