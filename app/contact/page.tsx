import type { Metadata } from "next"
import ContactForm from "@/components/contact/contact-form"
import ContactInfo from "@/components/contact/contact-info"
import ContactMap from "@/components/contact/contact-map"
import { PageHeader } from "@/components/ui/page-header"
import { generateMetadata } from '@/lib/seo/config';
import { generateKeywords } from '@/lib/seo/keywords';

export const metadata = generateMetadata({
  title: 'Contact Us - Rosanti Bike Rental',
  description: 'Get in touch with Rosanti Bike Rental. We\'re here to help you with your motorcycle rental needs and answer any questions you may have.',
  keywords: generateKeywords('contact'),
  openGraph: {
    url: 'https://rosantibike.com/contact',
    images: ['/images/contact-og.jpg'],
  },
  robots: {
    index: true,
    follow: true,
  },
});

export default function ContactPage() {
  return (
    <div className="pb-20">
      <PageHeader 
        title="Hubungi Kami"
        description="Punya pertanyaan atau membutuhkan bantuan? Hubungi tim kami dan kami akan menghubungi Anda sesegera mungkin."
      />

      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <ContactForm />
          <div className="space-y-12">
            <ContactInfo />
            <ContactMap />
          </div>
        </div>
      </div>
    </div>
  )
}

