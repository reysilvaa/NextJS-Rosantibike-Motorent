"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Send, Phone, Mail, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import GoogleMapComponent from "@/components/google-map"

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitError(null)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // In a real app, you would send the data to your backend
      // const response = await fetch('/api/contact', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData),
      // })

      setSubmitSuccess(true)
      setFormData({ name: "", email: "", phone: "", message: "" })
    } catch (error) {
      setSubmitError("Failed to send message. Please try again.")
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const contactInfo = [
    {
      icon: <Phone className="h-5 w-5 text-primary" />,
      title: "Phone",
      details: "+1 (234) 567-8900",
    },
    {
      icon: <Mail className="h-5 w-5 text-primary" />,
      title: "Email",
      details: "info@motocruise.com",
    },
    {
      icon: <MapPin className="h-5 w-5 text-primary" />,
      title: "Address",
      details: "123 Ride Street, Bike City, BC 12345",
    },
  ]

  return (
    <section className="py-20 bg-gradient-to-b from-gray-900 to-black">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Contact Us</h2>
          <p className="text-gray-400">
            Have questions or need assistance? Reach out to our team and we'll get back to you as soon as possible.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden h-full">
              <div className="h-[300px] lg:h-[400px]">
                <GoogleMapComponent />
              </div>

              <div className="p-6">
                <h3 className="text-xl font-semibold mb-4">Our Location</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {contactInfo.map((item, index) => (
                    <Card key={index} className="bg-black/30 border-gray-800">
                      <CardContent className="p-4 flex flex-col items-center text-center">
                        <div className="mb-2 mt-2">{item.icon}</div>
                        <h4 className="font-medium mb-1">{item.title}</h4>
                        <p className="text-gray-400 text-sm">{item.details}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 lg:p-8 h-full">
              <h3 className="text-xl font-semibold mb-6">Send Us a Message</h3>

              {submitSuccess ? (
                <div className="bg-green-900/30 border border-green-800 rounded-lg p-4 text-center">
                  <h4 className="font-semibold text-green-400 mb-2">Message Sent Successfully!</h4>
                  <p className="text-gray-300">Thank you for contacting us. We'll get back to you shortly.</p>
                  <Button className="mt-4" variant="outline" onClick={() => setSubmitSuccess(false)}>
                    Send Another Message
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-400 mb-1">
                      Name
                    </label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="bg-gray-800/50 border-gray-700"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-1">
                        Email
                      </label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="bg-gray-800/50 border-gray-700"
                      />
                    </div>

                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-400 mb-1">
                        Phone
                      </label>
                      <Input
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="bg-gray-800/50 border-gray-700"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-400 mb-1">
                      Message
                    </label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      className="bg-gray-800/50 border-gray-700"
                    />
                  </div>

                  {submitError && (
                    <div className="bg-red-900/30 border border-red-800 rounded-lg p-3 text-red-400 text-sm">
                      {submitError}
                    </div>
                  )}

                  <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <span className="flex items-center">
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Sending...
                      </span>
                    ) : (
                      <span className="flex items-center">
                        <Send className="mr-2 h-4 w-4" />
                        Send Message
                      </span>
                    )}
                  </Button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

