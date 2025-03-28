"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { format, eachDayOfInterval } from "date-fns"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { checkAvailability } from "@/lib/api"
import type { MotorcycleUnit } from "@/lib/types"
import AvailableMotorcycleCard from "@/components/availability/available-motorcycle-card"
import { useSocket, SocketEvents } from "@/hooks/use-socket"
import { toast } from "sonner"
import { useTranslation } from "@/i18n/hooks"

// Event type untuk realtime updates
type AvailabilityEvent = {
  motorId: string;
  isAvailable: boolean;
  tanggalMulai?: string;
  tanggalSelesai?: string;
  reason?: string;
}

export default function AvailabilityCalendar() {
  const { t } = useTranslation()
  const searchParams = useSearchParams()
  const [startDate, setStartDate] = useState<Date | null>(null)
  const [endDate, setEndDate] = useState<Date | null>(null)
  const [availableMotorcycles, setAvailableMotorcycles] = useState<MotorcycleUnit[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [view, setView] = useState<"calendar" | "list">("calendar")
  
  // Menggunakan socket untuk realtime updates
  const { isConnected, socket } = useSocket({
    room: 'availability',
    events: {
      'motor-status-update': handleMotorStatusUpdate,
      'availability-update': handleAvailabilityUpdate,
      'booking-created': handleBookingCreated,
    }
  });

  // Handler untuk update status motor
  function handleMotorStatusUpdate(data: any) {
    if (!data || !data.id) return;
    
    setAvailableMotorcycles(prev => {
      return prev.map(motor => {
        if (motor.id === data.id) {
          // Update status motor dengan nilai yang valid
          return {
            ...motor,
            status: data.status === 'tersedia' ? 'TERSEDIA' : 
                   data.status === 'disewa' ? 'DISEWA' : 
                   data.status === 'servis' ? 'SERVIS' : 'OVERDUE'
          };
        }
        return motor;
      });
    });
    
    // Tampilkan notifikasi
    toast.info(t("motorStatusUpdated"), {
      description: `${t("motor")} ${data.plat_nomor || 'ID: ' + data.id} ${t("nowInStatus")} ${data.status}`,
    });
  }
  
  // Handler untuk update ketersediaan
  function handleAvailabilityUpdate(data: AvailabilityEvent) {
    if (!data || !data.motorId) return;
    
    setAvailableMotorcycles(prev => {
      // Jika motor menjadi tidak tersedia, hapus dari daftar
      if (!data.isAvailable) {
        return prev.filter(motor => motor.id !== data.motorId);
      }
      
      // Jika motor menjadi tersedia dan belum ada di daftar,
      // reload data dari server karena kita butuh informasi lengkap motor
      const exists = prev.some(motor => motor.id === data.motorId);
      if (!exists && startDate && endDate) {
        fetchAvailabilityData();
      }
      
      return prev;
    });
    
    // Tampilkan notifikasi
    toast.info(
      data.isAvailable ? t("motorAvailable") : t("motorUnavailable"), 
      { description: data.reason || t("availabilityStatusUpdated") }
    );
  }
  
  // Handler ketika ada booking baru
  function handleBookingCreated(data: any) {
    if (!data) return;
    
    // Jika rentang waktu booking bertabrakan dengan filter saat ini, update list
    if (startDate && endDate && data.tanggalMulai && data.tanggalSelesai) {
      const bookingStart = new Date(data.tanggalMulai);
      const bookingEnd = new Date(data.tanggalSelesai);
      
      const hasOverlap = 
        (bookingStart <= endDate && bookingEnd >= startDate) ||
        (startDate <= bookingEnd && endDate >= bookingStart);
      
      if (hasOverlap && data.motorId) {
        // Hapus motor yang sudah di-booking dari daftar tersedia
        setAvailableMotorcycles(prev => 
          prev.filter(motor => motor.id !== data.motorId)
        );
        
        // Notify user
        toast.warning(t("newBookingCreated"), {
          description: t("motorJustBookedForPeriod", { id: data.motorId }),
        });
      }
    }
  }

  useEffect(() => {
    const startParam = searchParams.get("startDate")
    const endParam = searchParams.get("endDate")

    if (startParam && endParam) {
      setStartDate(new Date(startParam))
      setEndDate(new Date(endParam))

      // Gunakan ref untuk mencegah multiple fetch
      let isMounted = true
      let timeoutId: NodeJS.Timeout

      const fetchAvailability = async () => {
        // Debounce untuk mencegah multiple request
        clearTimeout(timeoutId)
        
        timeoutId = setTimeout(async () => {
          if (!isMounted) return
          
          fetchAvailabilityData();
        }, 500) // Delay 500ms untuk debounce
      }

      fetchAvailability()
      
      // Cleanup
      return () => {
        isMounted = false
        clearTimeout(timeoutId)
      }
    }
  }, [searchParams])
  
  // Function untuk mengambil data ketersediaan
  const fetchAvailabilityData = async () => {
    if (!startDate || !endDate) return;
    
    setIsLoading(true)
    setError(null)

    try {
      const data = await checkAvailability({
        tanggalMulai: format(startDate, 'yyyy-MM-dd'),
        tanggalSelesai: format(endDate, 'yyyy-MM-dd'),
      })
      
      setAvailableMotorcycles(data)
    } catch (err: any) {
      setError(err?.message || t("failedToFetchAvailabilityData"))
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  // Placeholder data for when API fails or during development
  const placeholderMotorcycles = [
    {
      id: "1",
      platNomor: "B 1234 XYZ",
      warna: "Red",
      hargaSewa: 150000,
      status: "TERSEDIA",
      jenis: {
        id: "1",
        merk: "Honda",
        model: "CBR 250RR",
      },
    },
    {
      id: "2",
      platNomor: "B 5678 ABC",
      warna: "Black",
      hargaSewa: 200000,
      status: "TERSEDIA",
      jenis: {
        id: "2",
        merk: "Yamaha",
        model: "MT-09",
      },
    },
    {
      id: "3",
      platNomor: "B 9012 DEF",
      warna: "Blue",
      hargaSewa: 180000,
      status: "TERSEDIA",
      jenis: {
        id: "3",
        merk: "Kawasaki",
        model: "Ninja ZX-6R",
      },
    },
  ] as MotorcycleUnit[]

  const displayMotorcycles = availableMotorcycles.length > 0 ? availableMotorcycles : placeholderMotorcycles

  // Generate days for the calendar view
  const generateDays = () => {
    if (!startDate || !endDate) return []

    return eachDayOfInterval({
      start: startDate,
      end: endDate,
    })
  }

  const days = generateDays()

  if (!startDate || !endDate) {
    return (
      <div className="bg-card/50 border-border rounded-xl p-6 md:p-8 text-center">
        <h2 className="text-2xl font-semibold mb-4">{t("checkMotorcycleAvailability")}</h2>
        <p className="text-muted-foreground mb-6">{t("pleaseSelectRentalDates")}</p>
        <div className="max-w-md mx-auto">
          <div className="bg-muted/50 rounded-lg p-8 flex items-center justify-center">
            <CalendarIcon className="h-16 w-16 text-muted-foreground" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-card/50 border-border rounded-xl p-6 md:p-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-semibold">{t("availableMotorcycles")}</h2>
          <p className="text-muted-foreground">
            {startDate && endDate ? (
              <>
                {format(startDate, "MMM d, yyyy")} - {format(endDate, "MMM d, yyyy")} (
                {Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))} {t("days")})
              </>
            ) : (
              t("selectDatesToSeeAvailability")
            )}
          </p>
        </div>

        <div className="flex gap-3 items-center">
          <div className="flex items-center">
            <span className={`h-2 w-2 rounded-full mr-1.5 ${isConnected ? 'bg-success' : 'bg-destructive'}`} />
            <span className="text-xs text-muted-foreground">{isConnected ? t("realtimeActive") : t("offline")}</span>
          </div>
          
          <Tabs
            defaultValue="calendar"
            className="w-full md:w-auto"
            onValueChange={(value) => setView(value as "calendar" | "list")}
          >
            <TabsList className="grid w-full grid-cols-2 md:w-[200px]">
              <TabsTrigger value="calendar">{t("calendarView")}</TabsTrigger>
              <TabsTrigger value="list">{t("listView")}</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : error ? (
        <div className="text-center py-10">
          <p className="text-destructive mb-4">{error}</p>
          <Button onClick={() => fetchAvailabilityData()}>{t("tryAgain")}</Button>
        </div>
      ) : (
        <>
          {view === "calendar" ? (
            <div className="overflow-x-auto">
              <div className="min-w-[800px]">
                <div className="grid grid-cols-[200px_1fr] gap-4">
                  <div className="bg-muted/50 rounded-lg p-4">
                    <h3 className="font-semibold mb-2">{t("motorcycle")}</h3>
                  </div>
                  <div className="grid grid-cols-7 gap-1">
                    {days.map((day) => (
                      <div key={day.toISOString()} className="bg-muted/50 rounded-lg p-2 text-center">
                        <div className="text-xs font-medium">{format(day, "EEE")}</div>
                        <div className="text-sm">{format(day, "d")}</div>
                      </div>
                    ))}
                  </div>

                  {displayMotorcycles.map((motorcycle) => (
                    <motion.div
                      key={motorcycle.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="contents"
                    >
                      <div className="bg-card border-border rounded-lg p-4">
                        <div className="font-medium">
                          {motorcycle.jenis?.merk || t("motor")} {motorcycle.jenis?.model || ''}
                        </div>
                        <div className="text-sm text-muted-foreground">{motorcycle.platNomor}</div>
                        <div className="text-sm text-muted-foreground">{motorcycle.warna}</div>
                        <div className="font-medium text-primary mt-2">Rp {motorcycle.hargaSewa?.toLocaleString() || 0}/{t("day")}</div>
                      </div>
                      <div className="grid grid-cols-7 gap-1">
                        {days.map((day) => (
                          <div
                            key={`${motorcycle.id}-${day.toISOString()}`}
                            className="bg-success/20 border border-success/30 rounded-lg p-2 text-center"
                          >
                            <div className="text-success text-xs">{t("available")}</div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {displayMotorcycles.map((motorcycle, index) => (
                <motion.div
                  key={motorcycle.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <AvailableMotorcycleCard motorcycle={motorcycle} startDate={startDate} endDate={endDate} />
                </motion.div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}

function CalendarIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className={className}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
      />
    </svg>
  )
}

