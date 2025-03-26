"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { differenceInDays, parseISO, format } from "date-fns"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { formatCurrency } from "@/lib/utils"
import type { MotorcycleUnit } from "@/lib/types"
import { useRouter } from "next/navigation"
import { useTranslation } from "@/i18n/hooks"

interface AvailabilityResultsProps {
  motorcycles: MotorcycleUnit[]
  startDate: string
  endDate: string
}

export default function AvailabilityResults({ motorcycles, startDate, endDate }: AvailabilityResultsProps) {
  const { t } = useTranslation()
  const router = useRouter()
  const [sortOption, setSortOption] = useState("price-asc")
  
  const rentalDays = differenceInDays(parseISO(endDate), parseISO(startDate)) + 1
  
  const sortedMotorcycles = [...motorcycles].sort((a, b) => {
    switch (sortOption) {
      case "price-asc":
        return a.hargaSewa - b.hargaSewa
      case "price-desc":
        return b.hargaSewa - a.hargaSewa
      case "name-asc":
        return `${a.jenis?.merk || ''} ${a.jenis?.model || ''}`.localeCompare(`${b.jenis?.merk || ''} ${b.jenis?.model || ''}`)
      case "name-desc":
        return `${b.jenis?.merk || ''} ${b.jenis?.model || ''}`.localeCompare(`${a.jenis?.merk || ''} ${a.jenis?.model || ''}`)
      default:
        return 0
    }
  })
  
  const handleBookNow = (motorcycleId: string) => {
    router.push(`/booking?unitMotorId=${motorcycleId}&tanggalMulai=${startDate}&tanggalSelesai=${endDate}`)
  }

  if (motorcycles.length === 0) {
    return (
      <Card className="bg-gray-900/50 border-gray-800 p-6 text-center">
        <h3 className="text-xl font-semibold mb-2">{t("noMotorcyclesAvailable")}</h3>
        <p className="text-gray-400 mb-4">
          {t("noMotorcyclesAvailableDesc")}
        </p>
        <p className="text-sm text-gray-500 mb-6">{t("tryDifferentDates")}</p>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-gray-400">
            <span className="font-medium text-white">{motorcycles.length}</span> {t("motorcyclesAvailable")}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-400">{t("sortBy")}:</span>
          <Select value={sortOption} onValueChange={setSortOption}>
            <SelectTrigger className="w-[180px] bg-gray-950/50 border-gray-800">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="price-asc">{t("priceLowestFirst")}</SelectItem>
                <SelectItem value="price-desc">{t("priceHighestFirst")}</SelectItem>
                <SelectItem value="name-asc">{t("nameAZ")}</SelectItem>
                <SelectItem value="name-desc">{t("nameZA")}</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-4">
        {sortedMotorcycles.map((motorcycle) => (
          <Card key={motorcycle.id} className="bg-gray-900/50 border-gray-800 overflow-hidden">
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/4 relative h-48 md:h-auto">
                <Image
                  src={motorcycle.jenis?.gambar || "/motorcycle-placeholder.svg"}
                  alt={`${motorcycle.jenis?.merk || 'Motor'} ${motorcycle.jenis?.model || ''}`}
                  fill
                  className="object-cover"
                />
              </div>
              <CardContent className="flex-1 flex flex-col md:flex-row p-6">
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-1">
                    {motorcycle.jenis?.merk || 'Motor'} {motorcycle.jenis?.model || ''}
                  </h3>
                  <p className="text-gray-400 text-sm mb-4">{t("licensePlate")}: {motorcycle.platNomor} • {motorcycle.warna || "N/A"}</p>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div key={`price-${motorcycle.id}`}>
                      <p className="text-sm text-gray-500">{t("pricePerDay")}</p>
                      <p className="font-medium">{formatCurrency(motorcycle.hargaSewa)}</p>
                    </div>
                    <div key={`total-${motorcycle.id}`}>
                      <p className="text-sm text-gray-500">{t("total")} ({rentalDays} {t("days")})</p>
                      <p className="font-medium">{formatCurrency(motorcycle.hargaSewa * rentalDays)}</p>
                    </div>
                  </div>
                </div>
                <div className="mt-4 md:mt-0 flex flex-col justify-center">
                  <Button className="min-w-32" onClick={() => handleBookNow(motorcycle.id)}>
                    {t("bookNow")}
                  </Button>
                  <Link 
                    href={`/motorcycles/${motorcycle.jenis?.id || ''}`} 
                    className="text-center text-xs text-primary mt-2 hover:underline"
                  >
                    {t("viewDetails")}
                  </Link>
                </div>
              </CardContent>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
} 