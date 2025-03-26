"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { MotorcycleUnit } from "@/lib/types"
import { createTransaction } from "@/lib/api"
import { useSocket, SocketEvents } from "@/hooks/use-socket"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/components/ui/use-toast"
import { useTranslation } from "@/i18n/hooks"

interface AvailableMotorcycleCardProps {
  motorcycle: MotorcycleUnit
  startDate: Date
  endDate: Date
}

export default function AvailableMotorcycleCard({ motorcycle, startDate, endDate }: AvailableMotorcycleCardProps) {
  const { t } = useTranslation()
  const router = useRouter()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    namaCustomer: "",
    noHP: "",
    alamat: "",
    nomorKTP: "",
    jasHujan: 0,
    helm: 0,
    jamMulai: "08:00",
    jamSelesai: "08:00"
  })
  const [formError, setFormError] = useState<string | null>(null)
  const [localMotorcycle, setLocalMotorcycle] = useState<MotorcycleUnit>(motorcycle)
  const [isAvailable, setIsAvailable] = useState(motorcycle.status === "TERSEDIA")

  // Socket untuk updates real-time pada status motor
  const { isConnected } = useSocket({
    room: `motorcycle-${motorcycle.id}`,
    events: {
      [SocketEvents.MOTOR_STATUS_UPDATE]: handleMotorStatusUpdate,
      'booking-created': handleBookingCreated
    }
  })

  // Update lokal ketika prop motorcycle berubah
  useEffect(() => {
    setLocalMotorcycle(motorcycle)
    setIsAvailable(motorcycle.status === "TERSEDIA")
  }, [motorcycle])

  // Handler untuk update status motor dari socket
  function handleMotorStatusUpdate(data: any) {
    if (data && data.unitId === motorcycle.id) {
      setLocalMotorcycle(prev => ({
        ...prev,
        status: data.status
      }))
      
      setIsAvailable(data.status === "TERSEDIA")
      
      const statusText = data.status === "TERSEDIA" ? t("available") : 
                         data.status === "DISEWA" ? t("rented") : 
                         data.status === "SERVIS" ? t("inService") : t("unavailable");
                         
      toast({
        title: t("motorcycleStatusChanged"),
        description: `${t("unit")} ${motorcycle.platNomor} ${t("nowIs")} ${statusText}`,
        variant: data.status === "TERSEDIA" ? "default" : "destructive"
      })
    }
  }
  
  // Handler untuk booking yang baru dibuat oleh pengguna lain
  function handleBookingCreated(data: any) {
    if (data && data.unitId === motorcycle.id) {
      setLocalMotorcycle(prev => ({
        ...prev,
        status: "DISEWA"
      }))
      
      setIsAvailable(false)
      
      toast({
        title: t("motorcycleBooked"),
        description: t("unitJustBooked", { platNomor: motorcycle.platNomor }),
        variant: "destructive"
      })
      
      // Tutup dialog jika sedang terbuka
      if (isDialogOpen) {
        setIsDialogOpen(false)
      }
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleNumericChange = (name: string, value: number) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Periksa lagi statusnya sebelum submit
    if (!isAvailable) {
      setFormError(t("motorcycleNoLongerAvailable"))
      return
    }
    
    setIsSubmitting(true)
    setFormError(null)

    try {
      await createTransaction({
        ...formData,
        tanggalMulai: format(startDate, "yyyy-MM-dd"),
        tanggalSelesai: format(endDate, "yyyy-MM-dd"),
        unitMotorId: motorcycle.id,
        jasHujan: Number(formData.jasHujan),
        helm: Number(formData.helm)
      })

      setIsDialogOpen(false)
      router.push("/booking-success")
    } catch (err) {
      setFormError(t("failedToCreateBooking"))
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
  const basePrice = localMotorcycle.hargaSewa * totalDays
  const jasHujanPrice = 5000 * Number(formData.jasHujan)
  const helmPrice = 5000 * Number(formData.helm)
  const totalPrice = basePrice + jasHujanPrice + helmPrice

  return (
    <Card className={`bg-gray-900 border-gray-800 overflow-hidden transition-all ${isAvailable ? 'hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10' : 'opacity-70'}`}>
      <div className="relative h-48 overflow-hidden">
        <Image
          src={localMotorcycle.jenis?.gambar || `/motorcycle-placeholder.svg`}
          alt={`${localMotorcycle.jenis?.merk || t("motorcycle")} ${localMotorcycle.jenis?.model || ''}`}
          fill
          className="object-cover"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
          <h3 className="text-lg font-bold">
            {localMotorcycle.jenis?.merk || t("motorcycle")} {localMotorcycle.jenis?.model || ''}
          </h3>
        </div>
        
        {/* Socket status indicator */}
        {isConnected && (
          <div className="absolute top-2 right-2">
            <Badge variant="outline" className="bg-black/50 text-xs">
              {t("live")}
            </Badge>
          </div>
        )}
      </div>
      <CardContent className="p-4">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-sm text-gray-400">{t("licensePlate")}</p>
            <p className="font-medium">{localMotorcycle.platNomor}</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">{t("color")}</p>
            <p className="font-medium">{localMotorcycle.warna}</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">{t("dailyRate")}</p>
            <p className="font-medium">Rp {localMotorcycle.hargaSewa.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">{t("status")}</p>
            <p className={`font-medium ${isAvailable ? 'text-green-500' : 'text-red-500'}`}>
              {isAvailable ? t("available") : localMotorcycle.status === 'DISEWA' ? t("rented") : 
               localMotorcycle.status === 'SERVIS' ? t("inService") : t("unavailable")}
            </p>
          </div>
        </div>

        <div className="bg-gray-800/50 rounded-lg p-3">
          <div className="flex justify-between mb-2">
            <span className="text-sm text-gray-400">{t("rentalPeriod")}:</span>
            <span className="text-sm font-medium">{totalDays} {t("days")}</span>
          </div>
          <div className="flex justify-between font-medium">
            <span>{t("totalPrice")}:</span>
            <span className="text-primary">Rp {totalPrice.toLocaleString()}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              className="w-full bg-primary hover:bg-primary/90"
              disabled={!isAvailable}
            >
              {isAvailable ? t("bookNow") : t("unavailable")}
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-gray-900 border-gray-800 sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>{t("completeYourBooking")}</DialogTitle>
              <DialogDescription>
                {t("fillPersonalDataToRent", { 
                  merk: localMotorcycle.jenis?.merk || t("motorcycle"), 
                  model: localMotorcycle.jenis?.model || '',
                  days: totalDays
                })}
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4 py-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="namaCustomer">{t("fullName")}</Label>
                  <Input
                    id="namaCustomer"
                    name="namaCustomer"
                    value={formData.namaCustomer}
                    onChange={handleChange}
                    required
                    className="bg-gray-800/50 border-gray-700"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="noHP">{t("phoneNumber")}</Label>
                  <Input
                    id="noHP"
                    name="noHP"
                    value={formData.noHP}
                    onChange={handleChange}
                    required
                    className="bg-gray-800/50 border-gray-700"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nomorKTP">{t("idCardNumber")}</Label>
                  <Input
                    id="nomorKTP"
                    name="nomorKTP"
                    value={formData.nomorKTP}
                    onChange={handleChange}
                    required
                    className="bg-gray-800/50 border-gray-700"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="alamat">{t("address")}</Label>
                  <Textarea
                    id="alamat"
                    name="alamat"
                    value={formData.alamat}
                    onChange={handleChange}
                    required
                    className="bg-gray-800/50 border-gray-700"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="jamMulai">{t("startTime")}</Label>
                    <Input
                      id="jamMulai"
                      name="jamMulai"
                      type="time"
                      value={formData.jamMulai}
                      onChange={handleChange}
                      required
                      className="bg-gray-800/50 border-gray-700"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="jamSelesai">{t("endTime")}</Label>
                    <Input
                      id="jamSelesai"
                      name="jamSelesai"
                      type="time"
                      value={formData.jamSelesai}
                      onChange={handleChange}
                      required
                      className="bg-gray-800/50 border-gray-700"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="jasHujan">{t("raincoat")} (Rp 5.000/unit)</Label>
                    <select
                      id="jasHujan"
                      name="jasHujan"
                      value={formData.jasHujan}
                      onChange={handleChange}
                      className="w-full bg-gray-800/50 border-gray-700 rounded-md px-3 py-2"
                    >
                      <option value="0">0</option>
                      <option value="1">1</option>
                      <option value="2">2</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="helm">{t("helmet")} (Rp 5.000/unit)</Label>
                    <select
                      id="helm"
                      name="helm"
                      value={formData.helm}
                      onChange={handleChange}
                      className="w-full bg-gray-800/50 border-gray-700 rounded-md px-3 py-2"
                    >
                      <option value="0">0</option>
                      <option value="1">1</option>
                      <option value="2">2</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800/50 rounded-lg p-3 space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-400">{t("motorcycle")}:</span>
                  <span className="text-sm">
                    {localMotorcycle.jenis?.merk || t("motorcycle")} {localMotorcycle.jenis?.model || ''}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-400">{t("licensePlate")}:</span>
                  <span className="text-sm">{localMotorcycle.platNomor}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-400">{t("rentalPeriod")}:</span>
                  <span className="text-sm">
                    {format(startDate, "d MMM yyyy")} - {format(endDate, "d MMM yyyy")}
                  </span>
                </div>
                {formData.jasHujan > 0 && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-400">{t("raincoat")}:</span>
                    <span className="text-sm">{formData.jasHujan} {t("unit")} (Rp {(5000 * Number(formData.jasHujan)).toLocaleString()})</span>
                  </div>
                )}
                {formData.helm > 0 && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-400">{t("helmet")}:</span>
                    <span className="text-sm">{formData.helm} {t("unit")} (Rp {(5000 * Number(formData.helm)).toLocaleString()})</span>
                  </div>
                )}
                <div className="flex justify-between font-medium pt-1 border-t border-gray-700">
                  <span>{t("totalPrice")}:</span>
                  <span className="text-primary">Rp {totalPrice.toLocaleString()}</span>
                </div>
              </div>

              {formError && (
                <div className="bg-red-900/30 border border-red-800 rounded-lg p-3 text-red-400 text-sm">
                  {formError}
                </div>
              )}

              <DialogFooter>
                <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <span className="flex items-center">
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      {t("processing")}...
                    </span>
                  ) : (
                    t("confirmBooking")
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  )
}

