import type { Metadata } from "next"
import ContactForm from "@/components/contact/contact-form"
import ContactInfo from "@/components/contact/contact-info"
import ContactMap from "@/components/contact/contact-map"

export const metadata: Metadata = {
  title: "Hubungi Kami | MotoCruise",
  description: "Hubungi tim kami untuk pertanyaan, dukungan, atau masukan",
}

export default function ContactPage() {
  return (
    <div className="pt-20 pb-20">
      <div className="container mx-auto px-4">
        <div className="py-10">
          <h1 className="text-4xl font-bold mb-6">Hubungi Kami</h1>
          <p className="text-gray-400 max-w-3xl">
            Punya pertanyaan atau membutuhkan bantuan? Hubungi tim kami dan kami akan menghubungi Anda sesegera mungkin.
          </p>
        </div>

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

