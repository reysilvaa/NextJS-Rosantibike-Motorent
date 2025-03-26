"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Calendar, Clock, User, MapPin, CreditCard, Umbrella, HardHat } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import type { MotorcycleUnit } from "@/lib/types";
import { createTransaction } from "@/lib/api";
import { Separator } from "@/components/ui/separator";

interface BookingFormProps {
  motorcycle: MotorcycleUnit;
  startDate: Date;
  endDate: Date;
  onSuccess?: () => void;
}

export default function BookingForm({
  motorcycle,
  startDate,
  endDate,
  onSuccess
}: BookingFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    namaCustomer: "",
    noHP: "",
    alamat: "",
    nomorKTP: "",
    jasHujan: 0,
    helm: 0,
    jamMulai: "08:00",
    jamSelesai: "08:00"
  });
  const [formError, setFormError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError(null);

    try {
      await createTransaction({
        ...formData,
        tanggalMulai: format(startDate, "yyyy-MM-dd"),
        tanggalSelesai: format(endDate, "yyyy-MM-dd"),
        unitMotorId: motorcycle.id,
        jasHujan: Number(formData.jasHujan),
        helm: Number(formData.helm)
      });

      toast({
        title: "Booking berhasil",
        description: "Pemesanan motor Anda telah dikonfirmasi",
        variant: "default",
      });

      if (onSuccess) {
        onSuccess();
      } else {
        router.push(
          `/booking-success?name=${encodeURIComponent(formData.namaCustomer)}&motor=${encodeURIComponent(motorcycle.jenis?.merk + ' ' + motorcycle.jenis?.model)}&plate=${encodeURIComponent(motorcycle.platNomor)}&startDate=${encodeURIComponent(format(startDate, "d MMM yyyy"))}`
        );
      }
    } catch (err) {
      console.error(err);
      setFormError("Gagal membuat pemesanan. Silakan coba lagi.");
      toast({
        title: "Booking gagal",
        description: "Terjadi kesalahan saat membuat pemesanan",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  const basePrice = motorcycle.hargaSewa * totalDays;
  const jasHujanPrice = 5000 * Number(formData.jasHujan);
  const helmPrice = 5000 * Number(formData.helm);
  const totalPrice = basePrice + jasHujanPrice + helmPrice;

  return (
    <Card className="bg-card border-border shadow-lg animate-fadeIn">
      <CardHeader className="bg-secondary/30 rounded-t-lg border-b border-border pb-4">
        <CardTitle className="text-xl flex items-center gap-2">
          <CreditCard className="h-5 w-5 text-primary" />
          Formulir Pemesanan Motor
        </CardTitle>
        <CardDescription>
          Lengkapi data diri Anda untuk menyewa motor
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label htmlFor="namaCustomer" className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                Nama Lengkap
              </Label>
              <Input
                id="namaCustomer"
                name="namaCustomer"
                value={formData.namaCustomer}
                onChange={handleChange}
                required
                className="bg-background/50 border-input focus:border-primary focus:ring-1 focus:ring-primary"
                placeholder="Masukkan nama lengkap Anda"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="noHP" className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
                Nomor Telepon/WhatsApp
              </Label>
              <Input
                id="noHP"
                name="noHP"
                value={formData.noHP}
                onChange={handleChange}
                required
                className="bg-background/50 border-input focus:border-primary focus:ring-1 focus:ring-primary"
                placeholder="Contoh: 08123456789"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="nomorKTP" className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground">
                <rect width="18" height="14" x="3" y="5" rx="2" />
                <path d="M3 10h18" />
                <path d="M7 15h2" />
                <path d="M11 15h6" />
              </svg>
              Nomor KTP
            </Label>
            <Input
              id="nomorKTP"
              name="nomorKTP"
              value={formData.nomorKTP}
              onChange={handleChange}
              required
              className="bg-background/50 border-input focus:border-primary focus:ring-1 focus:ring-primary"
              placeholder="Masukkan 16 digit nomor KTP"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="alamat" className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              Alamat
            </Label>
            <Textarea
              id="alamat"
              name="alamat"
              value={formData.alamat}
              onChange={handleChange}
              required
              className="bg-background/50 border-input focus:border-primary focus:ring-1 focus:ring-primary min-h-[100px]"
              placeholder="Masukkan alamat lengkap Anda"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label htmlFor="jamMulai" className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                Jam Mulai Sewa
              </Label>
              <Input
                id="jamMulai"
                name="jamMulai"
                type="time"
                value={formData.jamMulai}
                onChange={handleChange}
                required
                className="bg-background/50 border-input focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="jamSelesai" className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                Jam Akhir Sewa
              </Label>
              <Input
                id="jamSelesai"
                name="jamSelesai"
                type="time"
                value={formData.jamSelesai}
                onChange={handleChange}
                required
                className="bg-background/50 border-input focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label htmlFor="jasHujan" className="flex items-center gap-2">
                <Umbrella className="h-4 w-4 text-muted-foreground" />
                Jas Hujan (Rp 5.000/unit)
              </Label>
              <select
                id="jasHujan"
                name="jasHujan"
                value={formData.jasHujan}
                onChange={handleChange}
                className="w-full bg-background/50 border-input focus:border-primary focus:ring-1 focus:ring-primary rounded-md px-3 py-2"
              >
                <option value="0">0</option>
                <option value="1">1</option>
                <option value="2">2</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="helm" className="flex items-center gap-2">
                <HardHat className="h-4 w-4 text-muted-foreground" />
                Helm (Rp 5.000/unit)
              </Label>
              <select
                id="helm"
                name="helm"
                value={formData.helm}
                onChange={handleChange}
                className="w-full bg-background/50 border-input focus:border-primary focus:ring-1 focus:ring-primary rounded-md px-3 py-2"
              >
                <option value="0">0</option>
                <option value="1">1</option>
                <option value="2">2</option>
              </select>
            </div>
          </div>

          <div className="bg-secondary/20 rounded-lg p-5 space-y-3 border border-border">
            <h3 className="font-medium text-sm uppercase text-muted-foreground mb-2">Ringkasan Pemesanan</h3>
            
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Motor:</span>
              <span className="text-sm font-medium">
                {motorcycle.jenis?.merk} {motorcycle.jenis?.model}
              </span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Plat Nomor:</span>
              <span className="text-sm font-medium">{motorcycle.platNomor}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground flex items-center gap-1">
                <Calendar className="h-3 w-3" /> Periode Sewa:
              </span>
              <span className="text-sm font-medium">
                {format(startDate, "d MMM yyyy")} - {format(endDate, "d MMM yyyy")}
              </span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Durasi:</span>
              <span className="text-sm font-medium">{totalDays} hari</span>
            </div>
            
            <Separator className="my-2" />
            
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Harga Sewa:</span>
              <span className="text-sm font-medium">
                Rp {motorcycle.hargaSewa.toLocaleString()} × {totalDays} hari
              </span>
            </div>
            
            {formData.jasHujan > 0 && (
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  <Umbrella className="h-3 w-3" /> Jas Hujan:
                </span>
                <span className="text-sm font-medium">
                  {formData.jasHujan} unit (Rp {(5000 * Number(formData.jasHujan)).toLocaleString()})
                </span>
              </div>
            )}
            
            {formData.helm > 0 && (
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  <HardHat className="h-3 w-3" /> Helm:
                </span>
                <span className="text-sm font-medium">
                  {formData.helm} unit (Rp {(5000 * Number(formData.helm)).toLocaleString()})
                </span>
              </div>
            )}
            
            <Separator className="my-2" />
            
            <div className="flex justify-between pt-2">
              <span className="font-medium">Total Biaya:</span>
              <span className="text-primary font-bold text-lg">
                Rp {totalPrice.toLocaleString()}
              </span>
            </div>
          </div>

          {formError && (
            <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4 text-destructive text-sm">
              {formError}
            </div>
          )}

          <Button
            type="submit"
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-6 text-base"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center">
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Memproses...
              </span>
            ) : (
              "Konfirmasi Pemesanan"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
