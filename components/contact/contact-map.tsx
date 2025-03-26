"use client"

import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import GoogleMapComponent from "@/components/google-map"

export default function ContactMap() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card className="bg-gray-900/50 border-gray-800 overflow-hidden">
        <div className="h-[400px]">
          <GoogleMapComponent />
        </div>
      </Card>
    </motion.div>
  )
}

