"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import BookingForm from "@/components/features/booking/booking-form";
import { fetchMotorcycleUnitById } from "@/lib/network/api";
import { MotorcycleUnit } from "@/lib/types";
import { Loader2 } from "lucide-react";
import { NextSeo } from "next-seo";
import { getClientSeoProps } from "@/lib/shared/seo";

export default function BookingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  
  const unitId = searchParams.get('unitId');
  const startDateParam = searchParams.get('startDate');
  const endDateParam = searchParams.get('endDate');
  
  const [isLoading, setIsLoading] = useState(true);
  const [motorcycle, setMotorcycle] = useState<MotorcycleUnit | null>(null);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  // SEO configuration
  const seoProps = getClientSeoProps({
    title: motorcycle ? `Booking ${motorcycle.jenis?.merk} ${motorcycle.jenis?.model}` : "Formulir Booking",
    description: "Lengkapi formulir pemesanan untuk melanjutkan proses booking motor di Rosantibike Motorent Malang",
    canonicalPath: "/availability/booking",
    ogImage: "/images/booking-og.jpg",
  });

  useEffect(() => {
    if (!unitId || !startDateParam || !endDateParam || unitId === 'undefined') {
      toast({
        title: "Parameter tidak lengkap",
        description: "Silakan pilih motor dari halaman ketersediaan",
        variant: "destructive",
      });
      router.push("/availability");
      return;
    }
    
    setStartDate(new Date(startDateParam));
    setEndDate(new Date(endDateParam));
    
    const loadMotorcycle = async () => {
      try {
        setIsLoading(true);
        if (unitId === 'undefined' || !unitId.trim()) {
          throw new Error("ID motor tidak valid");
        }
        console.log("Mencoba mengambil data motor dengan ID:", unitId);
        const data = await fetchMotorcycleUnitById(unitId);
        console.log("Data motor berhasil didapatkan:", data);
        setMotorcycle(data);
      } catch (error: any) {
        console.error("Error fetching motorcycle:", error);
        const errorMessage = error?.message || "Terjadi kesalahan saat memuat data motor";
        toast({
          title: "Gagal memuat data",
          description: errorMessage,
          variant: "destructive",
        });
        // Redirect setelah 3 detik
        setTimeout(() => {
          router.push("/availability");
        }, 3000);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadMotorcycle();
  }, [unitId, startDateParam, endDateParam, router, toast]);

  if (isLoading) {
    return (
      <div className="container mx-auto py-12 px-4">
        <NextSeo {...seoProps} />
        <div className="max-w-3xl mx-auto text-center">
          <Loader2 className="h-10 w-10 animate-spin mx-auto mb-4 text-primary" />
          <h2 className="text-xl font-semibold mb-2">Memuat data motor...</h2>
          <p className="text-gray-400">Mohon tunggu sebentar</p>
        </div>
      </div>
    );
  }

  if (!motorcycle || !startDate || !endDate) {
    // Jika data tidak ditemukan, redirect otomatis dalam useEffect
    // Tampilkan pesan loading sementara menunggu redirect
    return (
      <div className="container mx-auto py-12 px-4 text-center">
        <NextSeo {...seoProps} />
        <Loader2 className="h-10 w-10 animate-spin mx-auto mb-4 text-primary" />
        <h2 className="text-xl font-semibold mb-2">Mengarahkan ke halaman pencarian...</h2>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <NextSeo 
        {...seoProps} 
        title={`Booking ${motorcycle.jenis?.merk} ${motorcycle.jenis?.model} | Rosantibike Motorent`}
      />
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-2">
            Booking {motorcycle.jenis?.merk} {motorcycle.jenis?.model}
          </h1>
          <p className="text-gray-400">
            Silakan lengkapi formulir di bawah untuk melanjutkan pemesanan
          </p>
        </div>
        
        <BookingForm 
          motorcycle={motorcycle} 
          startDate={startDate} 
          endDate={endDate}
        />
      </div>
    </div>
  );
} 