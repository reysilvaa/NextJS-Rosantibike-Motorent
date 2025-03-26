"use client"

import { motion } from "framer-motion"
import { Calendar, BikeIcon as Motorcycle, CreditCard, CheckCircle } from "lucide-react"

export default function HowItWorks() {
  const steps = [
    {
      icon: <Calendar className="h-10 w-10 text-primary" />,
      title: "Check Availability",
      description: "Browse our selection and check availability for your desired dates.",
    },
    {
      icon: <Motorcycle className="h-10 w-10 text-primary" />,
      title: "Choose Your Ride",
      description: "Select the perfect motorcycle that matches your style and needs.",
    },
    {
      icon: <CreditCard className="h-10 w-10 text-primary" />,
      title: "Book & Pay",
      description: "Complete your booking with our secure payment system.",
    },
    {
      icon: <CheckCircle className="h-10 w-10 text-primary" />,
      title: "Enjoy Your Ride",
      description: "Pick up your motorcycle and hit the road for an unforgettable experience.",
    },
  ]

  return (
    <section className="py-20 bg-black">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
          <p className="text-gray-400">
            Renting a motorcycle with us is quick and easy. Follow these simple steps to get on the road in no time.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative"
            >
              <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 h-full">
                <div className="flex justify-center mb-6">{step.icon}</div>
                <h3 className="text-xl font-semibold mb-3 text-center">{step.title}</h3>
                <p className="text-gray-400 text-center">{step.description}</p>
              </div>

              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                  <div className="w-8 h-0.5 bg-primary"></div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

