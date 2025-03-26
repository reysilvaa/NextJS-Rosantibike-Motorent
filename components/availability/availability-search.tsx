"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useMotorcycleTypes } from "@/hooks/use-motorcycles"
import { cn } from "@/lib/utils"
import type { AvailabilitySearchParams } from "@/lib/types"
import { useSocket } from "@/hooks/use-socket"
import { Badge } from "@/components/ui/badge"

export default function AvailabilitySearch() {
  const router = useRouter()
  const { data: motorcycleTypes, isLoading: isLoadingTypes } = useMotorcycleTypes()
  const [startDate, setStartDate] = useState<Date | undefined>()
  const [endDate, setEndDate] = useState<Date | undefined>()
  const [motorcycleType, setMotorcycleType] = useState<string | undefined>()
  
  // Koneksi Socket.IO untuk menampilkan status koneksi
  const { isConnected } = useSocket({
    room: "availability", // Bergabung ke room availability untuk event umum
  })

  const handleSearch = () => {
    if (!startDate || !endDate) {
      // Tambahkan validasi error disini jika diperlukan
      console.warn("Tanggal mulai dan tanggal selesai harus diisi")
      return
    }

    const searchParams: AvailabilitySearchParams = {
      tanggalMulai: format(startDate, "yyyy-MM-dd"),
      tanggalSelesai: format(endDate, "yyyy-MM-dd"),
    }

    // Hanya tambahkan jenisMotorId jika bukan "all" dan nilai ada
    if (motorcycleType && motorcycleType !== "all") {
      searchParams.jenisMotorId = motorcycleType
    }

    // Buat query string untuk URL dengan nama parameter yang sesuai dengan backend
    const queryString = new URLSearchParams()
    queryString.append("startDate", searchParams.tanggalMulai)
    queryString.append("endDate", searchParams.tanggalSelesai)
    if (searchParams.jenisMotorId) {
      queryString.append("jenisId", searchParams.jenisMotorId)
    }

    const searchUrl = `/availability?${queryString.toString()}`

    // Arahkan ke halaman availability dengan parameter
    router.push(searchUrl)
  }

  return (
    <Card className="bg-gray-900/50 border-gray-800">
      <CardHeader className="relative">
        <CardTitle className="text-xl font-bold">Cek Ketersediaan Motor</CardTitle>
        {/* Socket Connection Indicator */}
        <div className="absolute top-4 right-4">
          <Badge 
            variant={isConnected ? "outline" : "destructive"} 
            className={cn(
              "text-xs",
              isConnected && "bg-green-500/10 text-green-400 hover:bg-green-500/20 hover:text-green-300"
            )}
          >
            {isConnected ? "Update Realtime" : "Offline"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Tanggal Mulai</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal bg-gray-950/50 border-gray-800"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startDate ? format(startDate, "PPP") : <span>Pilih tanggal</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={setStartDate}
                  disabled={(date) => date < new Date()}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Tanggal Selesai</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal bg-gray-950/50 border-gray-800"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {endDate ? format(endDate, "PPP") : <span>Pilih tanggal</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={endDate}
                  onSelect={setEndDate}
                  disabled={(date) => !startDate || date <= startDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Jenis Motor (Opsional)</label>
          <Select value={motorcycleType} onValueChange={setMotorcycleType}>
            <SelectTrigger className="bg-gray-950/50 border-gray-800">
              <SelectValue placeholder="Semua jenis motor" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua jenis motor</SelectItem>
              {motorcycleTypes?.map((type) => (
                <SelectItem key={type.id} value={type.id}>
                  {type.merk} {type.model}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button className="w-full" onClick={handleSearch}>
          Cek Ketersediaan
        </Button>
      </CardContent>
    </Card>
  )
}

