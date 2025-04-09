"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { format, parse } from "date-fns"
import { useAvailability } from "@/hooks/use-motorcycles"
import AvailabilityResults from "@/components/availability/availability-results"
import DateRangeSearch from "@/components/shared/date-range-search"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, Calendar, Search, Bike } from "lucide-react"
import { useTranslation } from "@/i18n/hooks"
import { motion } from "framer-motion"
import { useEffect } from "react"
import { useMotorcycleTypes } from "@/hooks/use-motorcycles"
import { Badge } from "@/components/ui/badge"
import { useAutoScroll } from "@/hooks/common/use-auto-scroll"
import { MotorcycleType, AvailabilitySearchParams } from "@/lib/types"
import { generateMetadata } from '@/lib/seo/config';

export const metadata = generateMetadata({
  title: 'Check Availability - Rosanti Bike Rental',
  description: 'Check motorcycle availability and book your preferred bike for your trip. Easy online booking with instant confirmation.',
  openGraph: {
    url: 'https://rosantibike.com/availability',
    images: ['/images/availability-og.jpg'],
  },
});

export default function AvailabilityPage() {
  const { t } = useTranslation()
  const router = useRouter()
  const searchParams = useSearchParams()
  
  // Extract search params
  const tanggalMulai = searchParams.get("startDate")
  const tanggalSelesai = searchParams.get("endDate")
  const jenisMotorId = searchParams.get("jenisId") || undefined
  
  // Get motorcycle type info for filter display
  const { data: motorcycleTypes } = useMotorcycleTypes()
  const selectedType = motorcycleTypes?.find(type => type.id === jenisMotorId)
  
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

  const { resultsRef, showResultIndicator } = useAutoScroll({
    shouldScroll: Boolean(canSearch),
    isLoading,
    hasData: !!availableMotorcycles && availableMotorcycles.length > 0,
  });

  // Log untuk debugging
  useEffect(() => {
    if (availableMotorcycles) {
      console.log(`Rendered ${availableMotorcycles.length} motorcycles in availability page`);
      if (availableMotorcycles.length > 0) {
        console.log('Sample motorcycle:', availableMotorcycles[0]);
      }
    } else {
      console.log('No motorcycles data available');
    }
  }, [availableMotorcycles]);

  // Handle date range search
  const handleDateRangeSearch = (startDate: string, endDate: string) => {
    const queryString = new URLSearchParams()
    queryString.append("startDate", startDate)
    queryString.append("endDate", endDate)
    if (jenisMotorId) {
      queryString.append("jenisId", jenisMotorId)
    }

    const searchUrl = `/availability?${queryString.toString()}`
    router.push(searchUrl)
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  }
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/95">
      {/* Hero section with background pattern */}
      <div className="relative bg-gradient-to-b from-primary/5 to-background pt-32 pb-24 border-b border-border/10 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] pointer-events-none"></div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="container mx-auto px-4 relative z-10"
        >
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div className="md:max-w-xl">
                <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full mb-4 text-sm font-medium">
                  <Calendar className="h-4 w-4" />
                  <span>{t("availability")}</span>
                </div>
                <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                  {t("motorcycleAvailability")}
                </h1>
                <p className="text-muted-foreground text-lg max-w-xl">
                  {t("searchAndViewAvailableMotorcycles")}
                </p>
              </div>
              
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="w-full md:w-auto"
              >
                <div className="relative p-1 rounded-xl">
                  <DateRangeSearch 
                    onSearch={handleDateRangeSearch}
                    title={t("checkMotorcycleAvailability")}
                    description={t("checkAvailabilityDescription")}
                    buttonText={t("checkAvailability")}
                    initialDateFrom={tanggalMulai}
                    initialDateTo={tanggalSelesai}
                    cardClassName="bg-card border border-primary/10 shadow-xl relative z-10 w-full"
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
      
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          {/* Results section */}
          {canSearch && (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-8"
              ref={resultsRef}
            >
              <motion.div 
                variants={itemVariants} 
                className={`flex items-center justify-between border-b border-border/50 pb-6 relative ${
                  showResultIndicator ? "after:absolute after:inset-0 after:bg-primary/5 after:animate-pulse after:rounded-lg after:-z-10" : ""
                }`}
              >
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Bike className="h-5 w-5 text-primary" />
                    <h2 className="text-2xl font-bold">{t("availableMotorcycles")}</h2>
                    {showResultIndicator && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/20 text-primary animate-bounce">
                        {t("newResults")}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center flex-wrap gap-2 text-muted-foreground">
                    <span className="bg-primary/5 px-3 py-1 rounded-md text-sm inline-flex items-center">
                      <Calendar className="h-3.5 w-3.5 mr-1.5" />
                      {startDate} - {endDate}
                    </span>
                    {selectedType && (
                      <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                        {selectedType.merk} {selectedType.model}
                      </Badge>
                    )}
                  </div>
                </div>
                
                <div className="relative w-64 hidden md:block">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/20 via-primary/5 to-transparent blur-xl"></div>
                </div>
              </motion.div>
              
              <motion.div variants={itemVariants}>
                {isLoading ? (
                  <div className="grid gap-6">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="bg-card/50 border border-border rounded-xl overflow-hidden">
                        <div className="flex flex-col md:flex-row">
                          <Skeleton className="h-64 md:w-1/3 lg:w-1/4" />
                          <div className="p-6 flex-1 flex flex-col md:flex-row gap-6">
                            <div className="flex-1 space-y-4">
                              <Skeleton className="h-8 w-3/4" />
                              <Skeleton className="h-4 w-1/2" />
                              <div className="grid grid-cols-2 gap-4 pt-4">
                                <Skeleton className="h-20 rounded-lg" />
                                <Skeleton className="h-20 rounded-lg" />
                              </div>
                            </div>
                            <div className="flex flex-col items-center justify-center gap-4 md:w-40">
                              <Skeleton className="h-12 w-40" />
                              <Skeleton className="h-4 w-24" />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : error ? (
                  <Alert variant="destructive" className="bg-red-500/10 border-red-500/20">
                    <AlertCircle className="h-5 w-5" />
                    <AlertTitle className="text-lg font-semibold mb-1">{t("error")}</AlertTitle>
                    <AlertDescription className="text-red-500/80">
                      {error}
                    </AlertDescription>
                  </Alert>
                ) : (
                  <AvailabilityResults 
                    motorcycles={(availableMotorcycles || [])
                      .filter(motor => !!motor && !!motor.id)
                      .map(motor => ({
                        ...motor,
                        jenis: motor.jenis || {
                          id: motor.jenisId || "",
                          merk: "Motor",
                          model: motor.platNomor || "Unknown",
                          slug: `${motor.platNomor || "unknown"}`.toLowerCase().replace(/\s+/g, '-'),
                          cc: 0,
                          gambar: null,
                          createdAt: new Date().toISOString(),
                          updatedAt: new Date().toISOString(),
                          unitMotor: []
                        }
                      }))} 
                    startDate={tanggalMulai!} 
                    endDate={tanggalSelesai!}
                    isLoading={isLoading}
                    onBook={(motorcycle) => router.push(`/availability/booking?unitId=${motorcycle.id}&startDate=${tanggalMulai}&endDate=${tanggalSelesai}`)}
                  />
                )}
              </motion.div>
            </motion.div>
          )}
          
          {/* No search yet state */}
          {!canSearch && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col items-center justify-center py-16 text-center"
            >
              <div className="relative mb-8">
                <div className="absolute inset-0 rounded-full bg-primary/10 blur-xl"></div>
                <div className="relative z-10 bg-primary/10 rounded-full p-5">
                  <Search className="h-10 w-10 text-primary/80" />
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-3">{t("findYourDreamMotorcycle")}</h3>
              <p className="text-muted-foreground max-w-md mb-6">
                {t("selectDatesToSeeAvailability")}
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}

