"use client"

import type React from "react"

import { useState } from "react"
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

interface AvailableMotorcycleCardProps {
  motorcycle: MotorcycleUnit
  startDate: Date
  endDate: Date
}

export default function AvailableMotorcycleCard({ motorcycle, startDate, endDate }: AvailableMotorcycleCardProps) {
  const router = useRouter()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    namaCustomer: "",
    noHP: "",
    alamat: "",
    nomorKTP: "",
  })
  const [formError, setFormError] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setFormError(null)

    try {
      await createTransaction({
        ...formData,
        tanggalMulai: format(startDate, "yyyy-MM-dd"),
        tanggalSelesai: format(endDate, "yyyy-MM-dd"),
        unitMotorId: motorcycle.id,
      })

      setIsDialogOpen(false)
      router.push("/booking-success")
    } catch (err) {
      setFormError("Failed to create booking. Please try again.")
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
  const totalPrice = motorcycle.hargaSewa * totalDays

  return (
    <Card className="bg-gray-900 border-gray-800 overflow-hidden hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/10">
      <div className="relative h-48 overflow-hidden">
        <Image
          src={motorcycle.jenis?.gambar || `/motorcycle-placeholder.svg`}
          alt={`${motorcycle.jenis?.merk || 'Motor'} ${motorcycle.jenis?.model || ''}`}
          fill
          className="object-cover"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
          <h3 className="text-lg font-bold">
            {motorcycle.jenis?.merk || 'Motor'} {motorcycle.jenis?.model || ''}
          </h3>
        </div>
      </div>
      <CardContent className="p-4">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-sm text-gray-400">License Plate</p>
            <p className="font-medium">{motorcycle.platNomor}</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Color</p>
            <p className="font-medium">{motorcycle.warna}</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Daily Rate</p>
            <p className="font-medium">Rp {motorcycle.hargaSewa.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Status</p>
            <p className="font-medium text-green-500">Available</p>
          </div>
        </div>

        <div className="bg-gray-800/50 rounded-lg p-3">
          <div className="flex justify-between mb-2">
            <span className="text-sm text-gray-400">Rental Period:</span>
            <span className="text-sm font-medium">{totalDays} days</span>
          </div>
          <div className="flex justify-between font-medium">
            <span>Total Price:</span>
            <span className="text-primary">Rp {totalPrice.toLocaleString()}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full bg-primary hover:bg-primary/90">Book Now</Button>
          </DialogTrigger>
          <DialogContent className="bg-gray-900 border-gray-800 sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Complete Your Booking</DialogTitle>
              <DialogDescription>
                Fill in your details to book the {motorcycle.jenis?.merk || 'Motor'} {motorcycle.jenis?.model || ''} for{" "}
                {totalDays} days.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4 py-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="namaCustomer">Full Name</Label>
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
                  <Label htmlFor="noHP">Phone Number</Label>
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
                  <Label htmlFor="nomorKTP">ID Card Number</Label>
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
                  <Label htmlFor="alamat">Address</Label>
                  <Textarea
                    id="alamat"
                    name="alamat"
                    value={formData.alamat}
                    onChange={handleChange}
                    required
                    className="bg-gray-800/50 border-gray-700"
                  />
                </div>
              </div>

              <div className="bg-gray-800/50 rounded-lg p-3 space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-400">Motorcycle:</span>
                  <span className="text-sm">
                    {motorcycle.jenis?.merk || 'Motor'} {motorcycle.jenis?.model || ''}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-400">License Plate:</span>
                  <span className="text-sm">{motorcycle.platNomor}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-400">Rental Period:</span>
                  <span className="text-sm">
                    {format(startDate, "MMM d, yyyy")} - {format(endDate, "MMM d, yyyy")}
                  </span>
                </div>
                <div className="flex justify-between font-medium pt-1 border-t border-gray-700">
                  <span>Total Price:</span>
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
                      Processing...
                    </span>
                  ) : (
                    "Confirm Booking"
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

