"use client"

import { useSearchParams } from "next/navigation"
import { format, parse } from "date-fns"
import { useAvailability } from "@/hooks/use-motorcycles"
import AvailabilitySearch from "@/components/availability/availability-search"
import AvailabilityResults from "@/components/availability/availability-results"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { useTranslation } from "@/i18n/hooks"

export default function AvailabilityPage() {
  const { t } = useTranslation()
  const searchParams = useSearchParams()
  
  // Extract search params
  const tanggalMulai = searchParams.get("startDate")
  const tanggalSelesai = searchParams.get("endDate")
  const jenisMotorId = searchParams.get("jenisId") || searchParams.get("jenisMotorId") || undefined
  
  // Format dates for display
  const startDate = tanggalMulai 
    ? format(parse(tanggalMulai, "yyyy-MM-dd", new Date()), "d MMMM yyyy")
    : null
  const endDate = tanggalSelesai 
    ? format(parse(tanggalSelesai, "yyyy-MM-dd", new Date()), "d MMMM yyyy")
    : null
  
  // Only search if both dates are provided
  const canSearch = tanggalMulai && tanggalSelesai
  const searchParamsObj = canSearch 
    ? { 
        tanggalMulai, 
        tanggalSelesai,
        ...(jenisMotorId ? { jenisMotorId } : {})
      } 
    : null
  
  const { data: availableMotorcycles, isLoading, error } = useAvailability(searchParamsObj)

  return (
    <div className="container mx-auto px-4 py-20">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">{t("motorcycleAvailability")}</h1>
        
        <div className="mb-8">
          <AvailabilitySearch />
        </div>
        
        {canSearch && (
          <>
            <Separator className="my-8" />
            
            <div className="mb-6">
              <h2 className="text-2xl font-semibold mb-1">{t("availableMotorcycles")}</h2>
              <p className="text-gray-400">
                {startDate} - {endDate}
                {jenisMotorId && ` • ${t("filteredByMotorcycleType")}`}
              </p>
            </div>
            
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex gap-4 p-4 border border-gray-800 rounded-lg">
                    <Skeleton className="w-24 h-16 rounded" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-5 w-40" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                    <div className="w-24">
                      <Skeleton className="h-10 w-full" />
                    </div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>{t("error")}</AlertTitle>
                <AlertDescription>
                  {error}
                </AlertDescription>
              </Alert>
            ) : (
              <AvailabilityResults 
                motorcycles={availableMotorcycles} 
                startDate={tanggalMulai!} 
                endDate={tanggalSelesai!}
              />
            )}
          </>
        )}
      </div>
    </div>
  )
}

