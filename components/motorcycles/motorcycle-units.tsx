"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { motion } from "framer-motion"
import { fetchMotorcycleUnits } from "@/lib/api"
import type { MotorcycleUnit } from "@/lib/types"
import { useTranslation } from "@/i18n/hooks"

interface MotorcycleUnitsProps {
  typeId: string
  startDate?: string
  endDate?: string
}

export default function MotorcycleUnits({ typeId, startDate, endDate }: MotorcycleUnitsProps) {
  const { t } = useTranslation()
  const router = useRouter()
  const [units, setUnits] = useState<MotorcycleUnit[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchUnits = async () => {
      try {
        setIsLoading(true)
        const filter: Record<string, any> = { jenisMotorId: typeId }
        
        if (startDate && endDate) {
          filter.startDate = startDate
          filter.endDate = endDate
        }
        
        const data = await fetchMotorcycleUnits(filter)
        setUnits(Array.isArray(data) ? data : [])
        setError(null)
      } catch (err: any) {
        console.error("Error fetching motorcycle units:", err)
        setError(err.message || t("failedToLoadMotorcycleUnits"))
        setUnits([])
      } finally {
        setIsLoading(false)
      }
    }

    if (typeId) {
      fetchUnits()
    } else {
      setError(t("invalidMotorcycleTypeId"))
      setIsLoading(false)
    }
  }, [typeId, startDate, endDate, t])

  const handleRent = (unitId: string) => {
    if (!startDate || !endDate) {
      router.push(`/availability?jenisMotorId=${typeId}`)
      return
    }
    
    router.push(
      `/availability/booking?unitId=${unitId}&startDate=${startDate}&endDate=${endDate}`
    )
  }

  if (isLoading) {
    return (
      <div className="space-y-4 mt-8">
        <h2 className="text-2xl font-bold mb-4">{t("availableMotorcycleUnits")}</h2>
        {[1, 2, 3].map((i) => (
          <Card key={i} className="bg-card/50 border-border">
            <CardHeader>
              <div className="bg-muted h-6 w-36 rounded animate-pulse" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="bg-muted h-4 w-1/2 rounded animate-pulse" />
                <div className="bg-muted h-4 w-3/4 rounded animate-pulse" />
              </div>
              <div className="bg-muted h-10 w-full mt-4 rounded animate-pulse" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">{t("availableMotorcycleUnits")}</h2>
        <Card className="bg-destructive/20 border-destructive/50">
          <CardContent className="pt-6">
            <p className="text-destructive">{error}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (units.length === 0) {
    return (
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">{t("availableMotorcycleUnits")}</h2>
        <Card className="bg-card/50 border-border">
          <CardContent className="pt-6">
            <p className="text-muted-foreground">
              {startDate && endDate
                ? t("noUnitsAvailableForSelectedDates")
                : t("noUnitsAvailableNow")
              }
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">
        {t("availableMotorcycleUnits")}
        {startDate && endDate && (
          <span className="ml-2 text-sm font-normal text-muted-foreground">
            ({format(new Date(startDate), "dd/MM/yyyy")} - {format(new Date(endDate), "dd/MM/yyyy")})
          </span>
        )}
      </h2>
      
      <div className="space-y-4">
        {units.map((unit, index) => (
          <motion.div
            key={unit.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card className="bg-card/50 border-border hover:border-primary/30 transition-all">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-xl">
                    {unit.platNomor}
                    {unit.warna && <span className="ml-2 text-muted-foreground">({unit.warna})</span>}
                  </CardTitle>
                  <Badge 
                    className={
                      unit.status === "TERSEDIA" ? "bg-green-500/20 text-green-300 hover:bg-green-500/30" :
                      unit.status === "DISEWA" ? "bg-accent/50 text-accent-foreground hover:bg-accent/70" :
                      unit.status === "SERVIS" ? "bg-orange-500/20 text-orange-300 hover:bg-orange-500/30" :
                      "bg-destructive/20 text-destructive hover:bg-destructive/30"
                    }
                  >
                    {unit.status === "TERSEDIA" ? t("available") : 
                     unit.status === "DISEWA" ? t("rented") : 
                     unit.status === "SERVIS" ? t("service") : t("unavailable")}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-foreground/80 mb-2">
                  Rp {unit.hargaSewa.toLocaleString("id-ID")} / {t("day")}
                </p>
                
                {startDate && endDate && (
                  <>
                    <Separator className="my-4" />
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-muted-foreground text-sm">{t("totalFor")} {
                          Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24))
                        } {t("days")}:</p>
                        <p className="text-xl font-bold">
                          Rp {(unit.hargaSewa * Math.ceil(
                            (new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)
                          )).toLocaleString("id-ID")}
                        </p>
                      </div>
                      
                      <Button 
                        variant="default" 
                        disabled={unit.status !== "TERSEDIA"}
                        onClick={() => handleRent(unit.id)}
                      >
                        {unit.status === "TERSEDIA" ? t("rentNow") : t("unavailable")}
                      </Button>
                    </div>
                  </>
                )}
                
                {(!startDate || !endDate) && (
                  <Button 
                    className="w-full mt-4" 
                    variant="outline"
                    onClick={() => router.push(`/availability?jenisMotorId=${typeId}`)}
                  >
                    {t("checkAvailabilityAndPrice")}
                  </Button>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
} 