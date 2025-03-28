"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { fetchMotorcycleTypes } from "@/lib/api"
import type { MotorcycleType } from "@/lib/types"
import { useTranslation } from "@/i18n/hooks"

export default function FeaturedMotorcycles() {
  const [motorcycles, setMotorcycles] = useState<MotorcycleType[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { t } = useTranslation()

  useEffect(() => {
    const getMotorcycles = async () => {
      try {
        setIsLoading(true)
        console.log("Fetching motorcycle types...")
        const data = await fetchMotorcycleTypes()
        
        console.log("Response from fetchMotorcycleTypes:", data)
        
        if (data && Array.isArray(data) && data.length > 0) {
          console.log(`Successfully fetched ${data.length} motorcycle types`)
          const featuredMotorcycles = data.slice(0, 4)
          setMotorcycles(featuredMotorcycles)
        } else {
          console.warn("Data dari API kosong atau bukan array, menggunakan placeholder")
          setMotorcycles([])
        }
        setIsLoading(false)
      } catch (err) {
        console.error("Error saat fetching data motor:", err)
        setError(t("loadingFailed"))
        setIsLoading(false)
      }
    }

    getMotorcycles()
  }, [t])

  // Placeholder data for when API fails or during development
  // const placeholderMotorcycles = [
  //   {
  //     id: "1",
  //     merk: "Honda",
  //     model: "CBR 250RR",
  //     cc: 250,
  //     tahun: 2023,
  //     deskripsi: "Sporty and agile motorcycle perfect for city rides and weekend adventures.",
  //     gambar: "/placeholder.svg?height=400&width=600",
  //   },
  //   {
  //     id: "2",
  //     merk: "Yamaha",
  //     model: "MT-09",
  //     cc: 890,
  //     tahun: 2023,
  //     deskripsi: "Powerful naked bike with aggressive styling and exceptional performance.",
  //     gambar: "/placeholder.svg?height=400&width=600",
  //   },
  //   {
  //     id: "3",
  //     merk: "Kawasaki",
  //     model: "Ninja ZX-6R",
  //     cc: 636,
  //     tahun: 2022,
  //     deskripsi: "Track-focused supersport with street-friendly ergonomics.",
  //     gambar: "/placeholder.svg?height=400&width=600",
  //   },
  //   {
  //     id: "4",
  //     merk: "Ducati",
  //     model: "Monster",
  //     cc: 937,
  //     tahun: 2023,
  //     deskripsi: "Iconic naked bike combining style, performance, and Italian craftsmanship.",
  //     gambar: "/placeholder.svg?height=400&width=600",
  //   },
  // ]

  const displayMotorcycles = motorcycles.length > 0 ? motorcycles : []

  return (
    <section className="py-20 bg-gradient-to-b from-background to-background/80">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{t("featuredMotorcycles")}</h2>
            <p className="text-muted-foreground max-w-2xl">
              {t("footerDescription")}
            </p>
          </div>
          <Link href="/motorcycles" className="mt-4 md:mt-0">
            <Button variant="link" className="text-primary">
              {t("viewAll")}
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="bg-card/50 border-border overflow-hidden">
                <div className="h-48 bg-muted animate-pulse" />
                <CardContent className="p-5">
                  <div className="h-6 bg-muted rounded animate-pulse mb-2" />
                  <div className="h-4 bg-muted rounded animate-pulse w-3/4 mb-4" />
                  <div className="h-16 bg-muted rounded animate-pulse" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-10">
            <p className="text-red-500 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>{t("tryAgain")}</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {displayMotorcycles.map((motorcycle, index) => (
              <motion.div
                key={motorcycle.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link href={`/motorcycles/${motorcycle.id}`}>
                  <Card className="bg-card/50 border-border overflow-hidden hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/10 h-full">
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={motorcycle.gambar || "/placeholder.svg?height=400&width=600"}
                        alt={`${motorcycle.merk} ${motorcycle.model}`}
                        fill
                        className="object-cover transition-transform hover:scale-105"
                      />
                      <Badge className="absolute top-2 right-2 bg-primary">{motorcycle.cc} CC</Badge>
                    </div>
                    <CardContent className="p-5">
                      <h3 className="text-xl font-bold mb-1">
                        {motorcycle.merk} {motorcycle.model}
                      </h3>
                      <p className="text-muted-foreground text-sm mb-3">{t("year")}: {motorcycle.tahun}</p>
                      <p className="text-foreground/80 line-clamp-3">{motorcycle.deskripsi}</p>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

