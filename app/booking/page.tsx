"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import BookingForm from "@/components/features/booking/booking-form";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import type { MotorcycleUnit } from "@/lib/types";
import { format, addDays, parse } from "date-fns";
import id from "date-fns/locale/id";

export default function BookingPage() {
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [motorcycle, setMotorcycle] = useState<MotorcycleUnit | null>(null);
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(addDays(new Date(), 1));

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      
      try {
        const motorId = searchParams.get("motorId");
        let start = searchParams.get("startDate");
        let end = searchParams.get("endDate");
        
        if (!motorId) {
          toast({
            title: "Error",
            description: "ID motor tidak ditemukan",
            variant: "destructive",
          });
          return;
        }
        
        // Parse dates from URL params or use defaults
        if (start) {
          setStartDate(parse(start, "yyyy-MM-dd", new Date()));
        }
        
        if (end) {
          setEndDate(parse(end, "yyyy-MM-dd", new Date()));
        }
        
        // Fetch motorcycle details
        const response = await fetch(`/api/motor/${motorId}`);
        if (!response.ok) {
          throw new Error("Gagal mengambil data motor");
        }
        
        const data = await response.json();
        setMotorcycle(data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast({
          title: "Error",
          description: "Gagal memuat data. Silakan coba lagi nanti.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [searchParams, toast]);

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-2xl font-bold mb-6">Pemesanan Motor</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="p-6">
                <Skeleton className="h-8 w-1/3 mb-4 bg-gray-800" />
                <Skeleton className="h-4 w-full mb-2 bg-gray-800" />
                <Skeleton className="h-4 w-full mb-2 bg-gray-800" />
                <Skeleton className="h-4 w-3/4 mb-4 bg-gray-800" />
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <Skeleton className="h-10 w-full bg-gray-800" />
                  <Skeleton className="h-10 w-full bg-gray-800" />
                </div>
                <Skeleton className="h-20 w-full mb-4 bg-gray-800" />
                <Skeleton className="h-10 w-full bg-gray-800" />
              </CardContent>
            </Card>
          </div>
          <div>
            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="p-6">
                <Skeleton className="h-8 w-1/2 mb-4 bg-gray-800" />
                <Skeleton className="h-4 w-full mb-2 bg-gray-800" />
                <Skeleton className="h-4 w-full mb-2 bg-gray-800" />
                <Skeleton className="h-4 w-full mb-2 bg-gray-800" />
                <Skeleton className="h-10 w-full mt-4 bg-gray-800" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (!motorcycle) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-2xl font-bold mb-6">Pemesanan Motor</h1>
        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-6 text-center">
            <p>Motor tidak ditemukan atau tidak tersedia. Silakan kembali ke halaman pencarian.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Pemesanan Motor</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <BookingForm
            motorcycle={motorcycle}
            startDate={startDate}
            endDate={endDate}
          />
        </div>
        <div>
          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Informasi Motor</h2>
              <div className="space-y-3">
                <div>
                  <p className="text-gray-400 text-sm">Merk & Model</p>
                  <p className="font-medium">{motorcycle.jenis?.merk} {motorcycle.jenis?.model}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Plat Nomor</p>
                  <p className="font-medium">{motorcycle.platNomor}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Harga Sewa Per Hari</p>
                  <p className="font-medium">Rp {motorcycle.hargaSewa.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Periode Sewa</p>
                  <p className="font-medium">
                    {format(startDate, "d MMMM yyyy", { locale: id })} - {format(endDate, "d MMMM yyyy", { locale: id })}
                  </p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-800">
                <p className="text-sm text-gray-400 mb-2">Catatan:</p>
                <ul className="list-disc list-inside text-sm space-y-1">
                  <li>Jas hujan dan helm tersedia dengan biaya tambahan</li>
                  <li>Pengembalian terlambat dikenai denda Rp 15.000/jam</li>
                  <li>Booking hanya dapat dilakukan minimal 1 jam setelah motor dikembalikan</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 