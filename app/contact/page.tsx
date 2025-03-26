import type { Metadata } from "next"
import ContactForm from "@/components/contact/contact-form"
import ContactInfo from "@/components/contact/contact-info"
import ContactMap from "@/components/contact/contact-map"

export const metadata: Metadata = {
  title: "Contact Us | MotoCruise",
  description: "Get in touch with our team for inquiries, support, or feedback",
}

export default function ContactPage() {
  return (
    <div className="pt-20 pb-20">
      <div className="container mx-auto px-4">
        <div className="py-10">
          <h1 className="text-4xl font-bold mb-6">Contact Us</h1>
          <p className="text-gray-400 max-w-3xl">
            Have questions or need assistance? Reach out to our team and we'll get back to you as soon as possible.
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

