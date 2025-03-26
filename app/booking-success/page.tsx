"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function BookingSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [countdown, setCountdown] = useState(10);
  
  // Mendapatkan data dari parameter query
  const name = searchParams.get("name") || "Pelanggan";
  const motor = searchParams.get("motor") || "Motor";
  const plate = searchParams.get("plate") || "-";
  const startDate = searchParams.get("startDate") || "Tanggal pemesanan";

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push("/");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router]);

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <Card className="border-gray-800 bg-gray-900">
          <CardContent className="pt-8 pb-6 px-6 text-center">
            <div className="mb-6 inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 text-green-600">
              <CheckCircle2 className="h-12 w-12" />
            </div>
            <h1 className="text-2xl font-bold mb-4">Pemesanan Berhasil!</h1>
            <p className="text-gray-300 mb-6">
              Terima kasih <span className="font-semibold">{name}</span> telah memesan motor di layanan kami. Detail pemesanan Anda telah kami terima dan sedang diproses.
            </p>
            
            <div className="bg-gray-800/50 rounded-lg p-4 mb-6 text-left">
              <h3 className="font-medium mb-3 text-primary">Detail Pemesanan:</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Motor:</span>
                  <span className="font-medium">{motor}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Plat Nomor:</span>
                  <span className="font-medium">{plate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Tanggal Mulai:</span>
                  <span className="font-medium">{startDate}</span>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-800/50 rounded-lg p-4 mb-6 text-left">
              <h3 className="font-medium mb-3 text-green-400">Langkah Selanjutnya:</h3>
              <ul className="space-y-2 text-sm list-disc list-inside">
                <li>Kami akan mengirimkan konfirmasi melalui WhatsApp ke nomor yang Anda daftarkan</li>
                <li>Silakan datang ke lokasi rental pada tanggal dan jam mulai yang telah Anda pilih</li>
                <li>Jangan lupa membawa KTP asli dan salinannya untuk verifikasi</li>
                <li>Pembayaran dapat dilakukan saat pengambilan motor</li>
              </ul>
            </div>
            <p className="text-sm text-gray-400 mt-4">
              Halaman ini akan otomatis dialihkan dalam {countdown} detik
            </p>
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row gap-3 justify-center pb-8 px-6">
            <Button
              variant="outline"
              className="w-full sm:w-auto border-gray-700 hover:bg-gray-800"
              asChild
            >
              <Link href="/">Kembali ke Beranda</Link>
            </Button>
            <Button
              className="w-full sm:w-auto bg-primary hover:bg-primary/90"
              asChild
            >
              <Link href="/availability">Cari Motor Lainnya</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
} 