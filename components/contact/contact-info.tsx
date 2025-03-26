"use client"

import { motion } from "framer-motion"
import { Phone, Mail, MapPin, Clock } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export default function ContactInfo() {
  const contactInfo = [
    {
      icon: <Phone className="h-10 w-10 text-primary" />,
      title: "Phone",
      details: ["+1 (234) 567-8900", "+1 (234) 567-8901"],
    },
    {
      icon: <Mail className="h-10 w-10 text-primary" />,
      title: "Email",
      details: ["info@motocruise.com", "support@motocruise.com"],
    },
    {
      icon: <MapPin className="h-10 w-10 text-primary" />,
      title: "Address",
      details: ["123 Ride Street", "Bike City, BC 12345", "United States"],
    },
    {
      icon: <Clock className="h-10 w-10 text-primary" />,
      title: "Business Hours",
      details: ["Monday - Friday: 9AM - 6PM", "Saturday: 10AM - 4PM", "Sunday: Closed"],
    },
  ]

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Card className="bg-gray-900/50 border-gray-800">
        <CardContent className="p-6">
          <h2 className="text-2xl font-semibold mb-6">Contact Information</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {contactInfo.map((item, index) => (
              <div key={index} className="flex gap-4">
                <div className="flex-shrink-0 mt-1">{item.icon}</div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                  <ul className="space-y-1 text-gray-400">
                    {item.details.map((detail, i) => (
                      <li key={i}>{detail}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

