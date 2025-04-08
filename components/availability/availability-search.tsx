"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { format, parse } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useMotorcycleTypes } from "@/hooks/use-motorcycles"
import { cn } from "@/lib/utils/utils"
import type { AvailabilitySearchParams } from "@/lib/types"
import { useSocketContext } from "@/contexts/socket-context"
import { Badge } from "@/components/ui/badge"
import { useTranslation } from "@/i18n/hooks"

interface AvailabilitySearchProps {
  onSearch?: (startDate: string, endDate: string, jenisMotorId?: string) => void;
  initialStartDate?: string | null;
  initialEndDate?: string | null;
}

export default function AvailabilitySearch({ 
  onSearch, 
  initialStartDate, 
  initialEndDate 
}: AvailabilitySearchProps) {
  const { t } = useTranslation()
  const router = useRouter()
  const { data: motorcycleTypes, isLoading: isLoadingTypes } = useMotorcycleTypes()
  const [startDate, setStartDate] = useState<Date | undefined>()
  const [endDate, setEndDate] = useState<Date | undefined>()
  const [motorcycleType, setMotorcycleType] = useState<string | undefined>()
  
  // Inisialisasi tanggal dari props jika tersedia
  useEffect(() => {
    if (initialStartDate) {
      try {
        setStartDate(parse(initialStartDate, "yyyy-MM-dd", new Date()));
      } catch (e) {
        console.error("Error parsing initialStartDate", e);
      }
    }
    
    if (initialEndDate) {
      try {
        setEndDate(parse(initialEndDate, "yyyy-MM-dd", new Date()));
      } catch (e) {
        console.error("Error parsing initialEndDate", e);
      }
    }
  }, [initialStartDate, initialEndDate]);
  
  // Koneksi Socket.IO untuk menampilkan status koneksi
  const { isConnected, joinRoom } = useSocketContext();

  useEffect(() => {
    if (isConnected) {
      joinRoom("availability");
    }
  }, [isConnected, joinRoom]);

  const handleSearch = () => {
    if (!startDate || !endDate) {
      // Tambahkan validasi error disini jika diperlukan
      console.warn(t("startAndEndDateRequired"))
      return
    }

    const formattedStartDate = format(startDate, "yyyy-MM-dd");
    const formattedEndDate = format(endDate, "yyyy-MM-dd");
    const selectedMotorcycleType = motorcycleType && motorcycleType !== "all" ? motorcycleType : undefined;

    // Jika onSearch prop tersedia, gunakan itu (untuk di-handling parent)
    if (onSearch) {
      onSearch(formattedStartDate, formattedEndDate, selectedMotorcycleType);
      return;
    }

    // Legacy behavior - navigasi dengan URL params
    const queryString = new URLSearchParams()
    queryString.append("startDate", formattedStartDate)
    queryString.append("endDate", formattedEndDate)
    if (selectedMotorcycleType) {
      queryString.append("jenisId", selectedMotorcycleType)
    }

    const searchUrl = `/availability?${queryString.toString()}`
    router.push(searchUrl)
  }

  return (
    <Card className="bg-gradient-to-br from-card to-card/90 border-border shadow-lg">
      <CardHeader className="relative pb-2">
        <CardTitle className="text-2xl font-bold">{t("checkMotorcycleAvailability")}</CardTitle>
        {/* Socket Connection Indicator */}
        <div className="absolute top-4 right-4">
          <Badge 
            variant={isConnected ? "outline" : "destructive"} 
            className={cn(
              "text-xs",
              isConnected && "bg-primary/10 text-primary hover:bg-primary/20"
            )}
          >
            {isConnected ? t("realtimeUpdate") : t("offline")}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-5 pt-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <CalendarIcon className="h-4 w-4 text-primary" />
              {t("startDate")}
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal bg-background/50 border-border hover:bg-background hover:border-border/70"
                >
                  <CalendarIcon className="mr-2 h-4 w-4 text-primary" />
                  {startDate ? format(startDate, "PPP") : <span className="text-muted-foreground">{t("selectDate")}</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={setStartDate}
                  disabled={(date) => date < new Date()}
                  initialFocus
                  className="rounded-lg border border-border"
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <CalendarIcon className="h-4 w-4 text-primary" />
              {t("endDate")}
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal bg-background/50 border-border hover:bg-background hover:border-border/70"
                >
                  <CalendarIcon className="mr-2 h-4 w-4 text-primary" />
                  {endDate ? format(endDate, "PPP") : <span className="text-muted-foreground">{t("selectDate")}</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={endDate}
                  onSelect={setEndDate}
                  disabled={(date) => !startDate || date <= startDate}
                  initialFocus
                  className="rounded-lg border border-border"
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center gap-2">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className="h-4 w-4 text-primary"
            >
              <path d="M20.42 4.58a5.4 5.4 0 0 0-7.65 0l-.77.78-.77-.78a5.4 5.4 0 0 0-7.65 0C1.46 6.7 1.33 10.28 4 13l8 8 8-8c2.67-2.72 2.54-6.3.42-8.42z"></path>
            </svg>
            {t("motorcycleTypeOptional")}
          </label>
          <Select value={motorcycleType} onValueChange={setMotorcycleType}>
            <SelectTrigger className="bg-background/50 border-border hover:bg-background hover:border-border/70">
              <SelectValue placeholder={t("allMotorcycleTypes")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("allMotorcycleTypes")}</SelectItem>
              {motorcycleTypes?.map((type) => (
                <SelectItem key={type.id} value={type.id}>
                  {type.merk} {type.model}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button 
          className="w-full mt-2 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 font-bold py-6 rounded-lg transition-all duration-300 transform hover:scale-[1.02]"
          onClick={handleSearch}
        >
          {t("checkAvailability")}
        </Button>
      </CardContent>
    </Card>
  )
}

