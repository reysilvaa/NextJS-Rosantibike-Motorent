"use client"

import { useState, useEffect } from "react"
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
import { toast } from "@/components/ui/use-toast"

interface AvailabilityResultsProps {
  motorcycles: MotorcycleUnit[]
  startDate: string
  endDate: string
}

export default function AvailabilityResults({ motorcycles, startDate, endDate }: AvailabilityResultsProps) {
  const { t } = useTranslation()
  const router = useRouter()
  const [sortOption, setSortOption] = useState("price-asc")
  
  // Log untuk debugging
  useEffect(() => {
    console.log("AvailabilityResults received motorcycles:", motorcycles);
    console.log("Motorcycles array length:", motorcycles.length);
    
    if (motorcycles.length > 0) {
      console.log("Sample motorcycle in AvailabilityResults:", motorcycles[0]);
    }
  }, [motorcycles]);
  
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
    if (!motorcycleId || motorcycleId === 'undefined' || motorcycleId === 'null' || motorcycleId.trim() === '') {
      console.error("ID motor tidak valid");
      toast({
        title: "Error",
        description: "ID motor tidak valid, silakan coba motor lain",
        variant: "destructive",
      });
      return;
    }
    
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(motorcycleId)) {
      console.error("Format ID motor tidak valid");
      toast({
        title: "Error",
        description: "Format ID motor tidak valid, silakan coba motor lain",
        variant: "destructive",
      });
      return;
    }
    
    router.push(`/availability/booking?unitId=${motorcycleId}&startDate=${startDate}&endDate=${endDate}`);
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
    <div className="space-y-6 w-full">
      <div className="flex flex-col sm:flex-row justify-between items-center bg-gray-900/70 border border-gray-800 rounded-lg p-4 mb-6 w-full">
        <div>
          <h2 className="text-xl font-bold mb-1">Hasil Pencarian</h2>
          <p className="text-gray-400">
            <span className="font-medium text-white">{motorcycles.length}</span> {t("motorcyclesAvailable")}
          </p>
        </div>
        <div className="flex items-center gap-2 mt-4 sm:mt-0">
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

      <div className="grid grid-cols-1 gap-6 w-full">
        {sortedMotorcycles.map((motorcycle) => (
          <Card key={motorcycle.id} className="bg-gray-900/70 border-gray-800 overflow-hidden hover:border-gray-700 transition-all duration-300 shadow-lg hover:shadow-xl">
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/3 lg:w-1/4 relative h-56 md:h-auto">
                <div className="absolute inset-0 flex items-center justify-center bg-gray-800 text-gray-600">
                  <Image
                    src={motorcycle.jenis?.gambar && motorcycle.jenis.gambar !== "" 
                      ? motorcycle.jenis.gambar 
                      : "/motorcycle-placeholder.svg"}
                    alt={motorcycle.jenis?.merk && motorcycle.jenis?.model ? 
                      `${motorcycle.jenis.merk} ${motorcycle.jenis.model}` : 
                      "Gambar motor tidak tersedia"}
                    fill
                    className="object-cover"
                    onError={(e) => {
                      // Prevent infinite loop from error event
                      e.currentTarget.onerror = null;
                      // Set fallback image
                      e.currentTarget.src = "/motorcycle-placeholder.svg";
                    }}
                  />
                </div>
              </div>
              <CardContent className="flex-1 flex flex-col md:flex-row p-6">
                <div className="flex-1">
                  <h3 className="text-2xl font-bold mb-1">
                    {motorcycle.jenis?.merk && motorcycle.jenis?.model ? 
                      `${motorcycle.jenis.merk} ${motorcycle.jenis.model}` : 
                      "Detail motor tidak tersedia"}
                  </h3>
                  <div className="flex items-center gap-2 mb-4">
                    <span key={`plat-${motorcycle.id}`} className="inline-flex items-center rounded-md bg-blue-400/10 px-2 py-1 text-xs font-medium text-blue-400 ring-1 ring-inset ring-blue-400/20">
                      {motorcycle.platNomor || "-"}
                    </span>
                    <span key={`warna-${motorcycle.id}`} className="inline-flex items-center rounded-md bg-purple-400/10 px-2 py-1 text-xs font-medium text-purple-400 ring-1 ring-inset ring-purple-400/20">
                      {motorcycle.warna || "-"}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-gray-950/40 rounded-lg p-3">
                      <p className="text-sm text-gray-500">{t("pricePerDay")}</p>
                      <p className="font-bold text-lg text-primary">{formatCurrency(motorcycle.hargaSewa)}</p>
                    </div>
                    <div className="bg-gray-950/40 rounded-lg p-3">
                      <p className="text-sm text-gray-500">{t("total")} ({rentalDays} {t("days")})</p>
                      <p className="font-bold text-lg">{formatCurrency(motorcycle.hargaSewa * rentalDays)}</p>
                    </div>
                  </div>
                </div>
                <div className="mt-4 md:mt-0 flex flex-col justify-center items-center md:ml-6">
                  <Button 
                    className="min-w-40 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white font-bold py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-105" 
                    onClick={() => handleBookNow(motorcycle.id)}
                  >
                    {t("bookNow")}
                  </Button>
                  <Link 
                    href={motorcycle.jenis?.id ? `/motorcycles/${motorcycle.jenis.id}` : '#'} 
                    className="text-center text-sm text-primary mt-3 hover:underline"
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