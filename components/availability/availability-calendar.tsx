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

export default function AvailabilityCalendar() {
  const searchParams = useSearchParams()
  const [startDate, setStartDate] = useState<Date | null>(null)
  const [endDate, setEndDate] = useState<Date | null>(null)
  const [availableMotorcycles, setAvailableMotorcycles] = useState<MotorcycleUnit[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [view, setView] = useState<"calendar" | "list">("calendar")

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
          
          setIsLoading(true)
          setError(null)

          try {
            const data = await checkAvailability({
              tanggalMulai: startParam,
              tanggalSelesai: endParam,
            })
            
            if (isMounted) {
              setAvailableMotorcycles(data)
            }
          } catch (err: any) {
            if (isMounted) {
              setError(err?.message || "Failed to fetch availability data")
              console.error(err)
            }
          } finally {
            if (isMounted) {
              setIsLoading(false)
            }
          }
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
      <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 md:p-8 text-center">
        <h2 className="text-2xl font-semibold mb-4">Check Motorcycle Availability</h2>
        <p className="text-gray-400 mb-6">Please select your rental dates above to see available motorcycles.</p>
        <div className="max-w-md mx-auto">
          <div className="bg-gray-800/50 rounded-lg p-8 flex items-center justify-center">
            <CalendarIcon className="h-16 w-16 text-gray-600" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 md:p-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-semibold">Available Motorcycles</h2>
          <p className="text-gray-400">
            {startDate && endDate ? (
              <>
                {format(startDate, "MMM d, yyyy")} - {format(endDate, "MMM d, yyyy")} (
                {Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))} days)
              </>
            ) : (
              "Select dates to see availability"
            )}
          </p>
        </div>

        <Tabs
          defaultValue="calendar"
          className="w-full md:w-auto"
          onValueChange={(value) => setView(value as "calendar" | "list")}
        >
          <TabsList className="grid w-full grid-cols-2 md:w-[200px]">
            <TabsTrigger value="calendar">Calendar View</TabsTrigger>
            <TabsTrigger value="list">List View</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : error ? (
        <div className="text-center py-10">
          <p className="text-red-500 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      ) : (
        <>
          {view === "calendar" ? (
            <div className="overflow-x-auto">
              <div className="min-w-[800px]">
                <div className="grid grid-cols-[200px_1fr] gap-4">
                  <div className="bg-gray-800/50 rounded-lg p-4">
                    <h3 className="font-semibold mb-2">Motorcycle</h3>
                  </div>
                  <div className="grid grid-cols-7 gap-1">
                    {days.map((day) => (
                      <div key={day.toISOString()} className="bg-gray-800/50 rounded-lg p-2 text-center">
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
                      <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
                        <div className="font-medium">
                          {motorcycle.jenis?.merk || 'Motor'} {motorcycle.jenis?.model || ''}
                        </div>
                        <div className="text-sm text-gray-400">{motorcycle.platNomor}</div>
                        <div className="text-sm text-gray-400">{motorcycle.warna}</div>
                        <div className="font-medium text-primary mt-2">Rp {motorcycle.hargaSewa?.toLocaleString() || 0}/day</div>
                      </div>
                      <div className="grid grid-cols-7 gap-1">
                        {days.map((day) => (
                          <div
                            key={`${motorcycle.id}-${day.toISOString()}`}
                            className="bg-green-900/20 border border-green-900/30 rounded-lg p-2 text-center"
                          >
                            <div className="text-green-500 text-xs">Available</div>
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

// Helper icon component for the calendar view
function CalendarIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
      <line x1="16" x2="16" y1="2" y2="6" />
      <line x1="8" x2="8" y1="2" y2="6" />
      <line x1="3" x2="21" y1="10" y2="10" />
    </svg>
  )
}

