import { Metadata } from "next"
import ContactForm from "@/components/contact/contact-form"
import ContactInfo from "@/components/contact/contact-info"
import ContactMap from "@/components/contact/contact-map"
import { PageHeader } from "@/components/ui/page-header"
import { getSeoMetadata } from "@/lib/shared/seo"

export const metadata: Metadata = getSeoMetadata({
  title: "Hubungi Kami",
  description: "Punya pertanyaan atau membutuhkan bantuan? Hubungi tim Rosantibike Motorent dan kami akan menghubungi Anda sesegera mungkin.",
  canonicalPath: "/contact",
  ogImage: "/images/contact-og.jpg",
})

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

