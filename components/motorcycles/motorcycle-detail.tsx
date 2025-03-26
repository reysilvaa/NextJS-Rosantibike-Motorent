"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { fetchMotorcycleTypeById } from "@/lib/api"
import { motion } from "framer-motion"
import type { MotorcycleType, MotorcycleUnit } from "@/lib/types"

// Placeholder statis yang dijamin ada di folder public
const MOTORCYCLE_PLACEHOLDER = "/motorcycle-placeholder.svg"

export default function MotorcycleDetail({ id }: { id: string }) {
  const router = useRouter()
  const [motorcycle, setMotorcycle] = useState<MotorcycleType | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [startDate, setStartDate] = useState<Date | undefined>(undefined)
  const [endDate, setEndDate] = useState<Date | undefined>(undefined)
  const [formattedStartDate, setFormattedStartDate] = useState<string | undefined>(undefined)
  const [formattedEndDate, setFormattedEndDate] = useState<string | undefined>(undefined)
  const [imageSrc, setImageSrc] = useState<string>(MOTORCYCLE_PLACEHOLDER)
  const [units, setUnits] = useState<MotorcycleUnit[]>([])

  useEffect(() => {
    const fetchMotorcycleDetail = async () => {
      try {
        setIsLoading(true)
        const data = await fetchMotorcycleTypeById(id)
        
        // Cek apakah data valid
        if (data) {
          setMotorcycle(data)
          
          // Set image source dengan gambar dari API jika tersedia
          if (data.gambar) {
            setImageSrc(data.gambar)
          }
          
          // Jika unit motor tersedia langsung dalam respons API, simpan di state
          if (data.unitMotor && Array.isArray(data.unitMotor)) {
            setUnits(data.unitMotor)
          }
          
          setError(null)
        } else {
          // Handle kasus data tidak ada
          setError("Data motor tidak ditemukan")
        }
      } catch (err: any) {
        console.error("Error fetching motorcycle details:", err)
        setError(err.message || "Gagal memuat detail motor")
      } finally {
        setIsLoading(false)
      }
    }

    fetchMotorcycleDetail()
  }, [id])

  useEffect(() => {
    if (startDate) {
      setFormattedStartDate(format(startDate, "yyyy-MM-dd"))
    } else {
      setFormattedStartDate(undefined)
    }
  }, [startDate])

  useEffect(() => {
    if (endDate) {
      setFormattedEndDate(format(endDate, "yyyy-MM-dd"))
    } else {
      setFormattedEndDate(undefined)
    }
  }, [endDate])

  const handleCheckAvailability = () => {
    if (!startDate || !endDate) {
      return
    }

    const formattedStartDate = format(startDate, "yyyy-MM-dd")
    const formattedEndDate = format(endDate, "yyyy-MM-dd")

    router.push(
      `/availability?tanggalMulai=${formattedStartDate}&tanggalSelesai=${formattedEndDate}&jenisMotorId=${id}`
    )
  }

  const handleImageError = () => {
    setImageSrc(MOTORCYCLE_PLACEHOLDER)
  }

  const handleRent = (unitId: string) => {
    if (!startDate || !endDate) {
      router.push(`/availability?jenisMotorId=${id}`)
      return
    }
    
    if (!formattedStartDate || !formattedEndDate) return;
    
    router.push(
      `/availability/booking?unitId=${unitId}&startDate=${formattedStartDate}&endDate=${formattedEndDate}`
    )
  }

  // Menghitung jumlah hari sewa
  const calculateDays = () => {
    if (!startDate || !endDate) return 1;
    return Math.max(1, Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)))
  }

  if (isLoading) {
    return (
      <div className="py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Skeleton className="w-full aspect-video rounded-lg" />
          <div className="space-y-4">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      </div>
    )
  }

  if (error || !motorcycle) {
    return (
      <div className="py-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Error</h2>
        <p className="text-red-500 mb-4">{error || "Motor tidak ditemukan"}</p>
        <Button onClick={() => router.back()}>Kembali</Button>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="py-8"
    >
      <Link href="/motorcycles" className="flex items-center mb-6 hover:text-primary">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="mr-2"
        >
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        Kembali ke Daftar Motor
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="relative aspect-video rounded-lg overflow-hidden border border-gray-800">
          <Image
            src={imageSrc}
            alt={`${motorcycle.merk} ${motorcycle.model}`}
            fill
            className="object-cover"
            priority
            onError={handleImageError}
          />
          <Badge className="absolute top-4 right-4 bg-primary text-lg">{motorcycle.cc} CC</Badge>
        </div>

        <div>
          <h1 className="text-3xl font-bold mb-2">
            {motorcycle.merk} {motorcycle.model}
          </h1>
          {motorcycle.tahun && <p className="text-gray-400 mb-4">Tahun: {motorcycle.tahun}</p>}

          <Separator className="my-4" />

          {motorcycle.deskripsi && (
            <>
              <h2 className="text-xl font-semibold mb-2">Deskripsi</h2>
              <p className="text-gray-300 mb-6">{motorcycle.deskripsi}</p>
            </>
          )}

          <Card className="bg-gray-900/50 border-gray-800">
            <CardHeader>
              <CardTitle>Cek Ketersediaan</CardTitle>
              <CardDescription>
                Pilih tanggal penyewaan untuk memeriksa ketersediaan motor ini
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium mb-2">Tanggal Mulai</h3>
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    disabled={(date) => date < new Date()}
                    className="border border-gray-800 rounded-md p-3"
                  />
                </div>
                <div>
                  <h3 className="text-sm font-medium mb-2">Tanggal Selesai</h3>
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    disabled={(date) => !startDate || date < startDate}
                    className="border border-gray-800 rounded-md p-3"
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full" 
                onClick={handleCheckAvailability}
                disabled={!startDate || !endDate}
              >
                Periksa Ketersediaan
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">Spesifikasi</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <Card className="bg-gray-900/50 border-gray-800">
            <CardHeader>
              <CardTitle className="text-lg">Merk</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xl">{motorcycle.merk}</p>
            </CardContent>
          </Card>
          <Card className="bg-gray-900/50 border-gray-800">
            <CardHeader>
              <CardTitle className="text-lg">Model</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xl">{motorcycle.model}</p>
            </CardContent>
          </Card>
          <Card className="bg-gray-900/50 border-gray-800">
            <CardHeader>
              <CardTitle className="text-lg">CC</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xl">{motorcycle.cc}</p>
            </CardContent>
          </Card>
          {motorcycle.tahun && (
            <Card className="bg-gray-900/50 border-gray-800">
              <CardHeader>
                <CardTitle className="text-lg">Tahun</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xl">{motorcycle.tahun}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Daftar Unit Motor */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">
          Unit Motor Tersedia
          {startDate && endDate && (
            <span className="ml-2 text-sm font-normal text-gray-400">
              ({format(startDate, "dd/MM/yyyy")} - {format(endDate, "dd/MM/yyyy")})
            </span>
          )}
        </h2>
        
        {units.length === 0 ? (
          <Card className="bg-gray-900/50 border-gray-800">
            <CardContent className="pt-6">
              <p className="text-gray-400">
                Tidak ada unit tersedia saat ini
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {units.map((unit, index) => (
              <motion.div
                key={unit.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card className="bg-gray-900/50 border-gray-800 hover:border-primary/30 transition-all">
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-xl">
                        {unit.platNomor}
                        {unit.warna && <span className="ml-2 text-gray-400">({unit.warna})</span>}
                      </CardTitle>
                      <Badge 
                        className={
                          unit.status === "TERSEDIA" ? "bg-green-500/20 text-green-300 hover:bg-green-500/30" :
                          unit.status === "DISEWA" ? "bg-blue-500/20 text-blue-300 hover:bg-blue-500/30" :
                          unit.status === "SERVIS" ? "bg-orange-500/20 text-orange-300 hover:bg-orange-500/30" :
                          "bg-red-500/20 text-red-300 hover:bg-red-500/30"
                        }
                      >
                        {unit.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-300 mb-2">
                      Rp {Number(unit.hargaSewa).toLocaleString("id-ID")} / hari
                    </p>
                    
                    {startDate && endDate && (
                      <>
                        <Separator className="my-4" />
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-gray-400 text-sm">Total untuk {calculateDays()} hari:</p>
                            <p className="text-xl font-bold">
                              Rp {(Number(unit.hargaSewa) * calculateDays()).toLocaleString("id-ID")}
                            </p>
                          </div>
                          
                          <Button 
                            variant="default" 
                            disabled={unit.status !== "TERSEDIA"}
                            onClick={() => handleRent(unit.id)}
                          >
                            {unit.status === "TERSEDIA" ? "Sewa Sekarang" : "Tidak Tersedia"}
                          </Button>
                        </div>
                      </>
                    )}
                    
                    {(!startDate || !endDate) && (
                      <Button 
                        className="w-full mt-4" 
                        variant="outline"
                        onClick={() => router.push(`/availability?jenisMotorId=${id}`)}
                      >
                        Cek Ketersediaan & Harga
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  )
} 