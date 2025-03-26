"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useMotorcycleTypes } from "@/hooks/use-motorcycles"
import type { MotorcycleType } from "@/lib/types"

// Placeholder statis yang dijamin ada di folder public
const MOTORCYCLE_PLACEHOLDER = "/motorcycle-placeholder.svg"

export default function MotorcycleList() {
  const [searchTerm, setSearchTerm] = useState<string | undefined>(undefined)
  const { data: motorcycles, isLoading, error } = useMotorcycleTypes(searchTerm)


  const displayMotorcycles = motorcycles && motorcycles.length > 0 ? motorcycles : []

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i} className="bg-gray-900/50 border-gray-800 overflow-hidden">
            <div className="h-48 bg-gray-800 animate-pulse" />
            <CardContent className="p-5">
              <div className="h-6 bg-gray-800 rounded animate-pulse mb-2" />
              <div className="h-4 bg-gray-800 rounded animate-pulse w-3/4 mb-4" />
              <div className="h-16 bg-gray-800 rounded animate-pulse" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500 mb-4">{error}</p>
        <Button onClick={() => window.location.reload()}>Coba Lagi</Button>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {displayMotorcycles.map((motorcycle, index) => (
        <motion.div
          key={motorcycle.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <Link href={`/motorcycles/${motorcycle.id}`}>
            <Card className="bg-gray-900/50 border-gray-800 overflow-hidden hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/10 h-full">
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={motorcycle.gambar || MOTORCYCLE_PLACEHOLDER}
                  alt={`${motorcycle.merk} ${motorcycle.model}`}
                  fill
                  className="object-cover transition-transform hover:scale-105"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = MOTORCYCLE_PLACEHOLDER;
                    target.onerror = null; // Mencegah infinite loop
                  }}
                />
                <Badge className="absolute top-2 right-2 bg-primary">{motorcycle.cc} CC</Badge>
              </div>
              <CardContent className="p-5">
                <h3 className="text-xl font-bold mb-1">
                  {motorcycle.merk} {motorcycle.model}
                </h3>
                <p className="text-gray-400 text-sm mb-3">Tahun: {motorcycle.tahun}</p>
                <p className="text-gray-300 line-clamp-3">{motorcycle.deskripsi}</p>
              </CardContent>
            </Card>
          </Link>
        </motion.div>
      ))}
    </div>
  )
}

