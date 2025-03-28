"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar, ArrowRight, AlertCircle, Loader2, Search, Clock, CreditCard, Tag, CalendarIcon, BikeIcon as Motorcycle, ChevronRight } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import type { Transaction } from "@/lib/types";
import { searchTransactionsByPhone } from "@/lib/api";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

export default function BookingHistoryPage() {
  const { toast } = useToast();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isSearched, setIsSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!phoneNumber) {
      toast({
        title: "Nomor telepon diperlukan",
        description: "Silakan masukkan nomor telepon/WhatsApp untuk mencari riwayat booking",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    setIsSearched(true);
    
    try {
      // Panggil API untuk mencari transaksi berdasarkan nomor telepon
      const data = await searchTransactionsByPhone(phoneNumber);
      setTransactions(data);
      
      // Tampilkan toast jika tidak ditemukan hasil
      if (data.length === 0) {
        toast({
          title: "Riwayat tidak ditemukan",
          description: `Tidak ditemukan riwayat booking untuk nomor ${phoneNumber}`,
          variant: "default",
        });
      } else {
        toast({
          title: "Riwayat ditemukan",
          description: `Ditemukan ${data.length} riwayat booking`,
          variant: "default",
        });
      }
    } catch (error) {
      console.error("Error searching transactions:", error);
      toast({
        title: "Gagal memuat data",
        description: "Terjadi kesalahan saat mencari riwayat booking",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string, className: string, icon: React.ReactNode }> = {
      "PENDING": { 
        label: "Menunggu Konfirmasi", 
        className: "bg-warning/20 text-warning border-warning/30",
        icon: <Clock className="h-3 w-3 mr-1" />
      },
      "AKTIF": { 
        label: "Aktif", 
        className: "bg-primary/20 text-primary border-primary/30",
        icon: <Tag className="h-3 w-3 mr-1" />
      },
      "SELESAI": { 
        label: "Selesai", 
        className: "bg-success/20 text-success border-success/30",
        icon: <CalendarIcon className="h-3 w-3 mr-1" />
      },
      "DIBATALKAN": { 
        label: "Dibatalkan", 
        className: "bg-destructive/20 text-destructive border-destructive/30",
        icon: <AlertCircle className="h-3 w-3 mr-1" />
      },
      "OVERDUE": { 
        label: "Terlambat", 
        className: "bg-warning/20 text-warning border-warning/30",
        icon: <Clock className="h-3 w-3 mr-1" />
      }
    };
    
    const defaultStatus = { 
      label: status, 
      className: "bg-secondary/50 text-muted-foreground border-border",
      icon: <Tag className="h-3 w-3 mr-1" />
    };
    
    const statusInfo = statusMap[status] || defaultStatus;
    
    return (
      <span className={`px-2 py-1 text-xs rounded border flex items-center ${statusInfo.className}`}>
        {statusInfo.icon}
        {statusInfo.label}
      </span>
    );
  };

  return (
    <div className="container mx-auto px-4 py-20">
      <div className="max-w-6xl mx-auto">
        <div className="mb-10">
          <h1 className="text-4xl font-bold mb-6">Riwayat Booking</h1>
          <p className="text-muted-foreground max-w-3xl">
            Lacak dan lihat semua riwayat pemesanan motor Anda dengan mudah. Masukkan nomor telepon yang digunakan saat pemesanan.
          </p>
        </div>
        
        <Card className="bg-card border-border mb-10">
          <CardHeader className="border-b border-border pb-4">
            <CardTitle className="text-2xl flex items-center gap-2">
              <Calendar className="h-6 w-6" /> 
              Cek Riwayat Booking
            </CardTitle>
            <CardDescription>
              Masukkan nomor telepon/WhatsApp yang digunakan saat booking untuk melihat riwayat
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="flex flex-col md:flex-row gap-3">
                <div className="flex-1">
                  <Label htmlFor="phoneNumber">Nomor Telepon/WhatsApp</Label>
                  <Input
                    id="phoneNumber"
                    type="text"
                    placeholder="08xxxxxxxxxx"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="bg-background/50 border-input mt-1"
                  />
                </div>
                <div className="flex items-end">
                  <Button 
                    type="submit" 
                    className="w-full md:w-auto"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <span className="flex items-center">
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Mencari...
                      </span>
                    ) : (
                      <span className="flex items-center">
                        Cari Booking <ArrowRight className="ml-2 h-4 w-4" />
                      </span>
                    )}
                  </Button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>

        {isSearched && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Hasil Pencarian</h2>
            
            {isLoading ? (
              <div className="text-center py-20">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
                <p className="text-muted-foreground">Memuat riwayat booking...</p>
              </div>
            ) : transactions.length > 0 ? (
              <div className="space-y-4">
                {transactions.map((transaction) => (
                  <Card key={transaction.id} className="bg-card/80 border-border">
                    <CardContent className="p-4">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-medium">
                              {transaction.unitMotor?.jenis?.merk} {transaction.unitMotor?.jenis?.model}
                            </h3>
                            {getStatusBadge(transaction.status)}
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-4 text-sm text-muted-foreground">
                            <div>
                              <span className="inline-block w-32">Plat Nomor:</span>
                              <span className="font-medium text-foreground/80">{transaction.unitMotor?.platNomor}</span>
                            </div>
                            <div>
                              <span className="inline-block w-32">Periode:</span>
                              <span className="font-medium text-foreground/80">
                                {format(new Date(transaction.tanggalMulai), "dd MMM yyyy", { locale: id })} - 
                                {format(new Date(transaction.tanggalSelesai), "dd MMM yyyy", { locale: id })}
                              </span>
                            </div>
                            <div>
                              <span className="inline-block w-32">Total Biaya:</span>
                              <span className="font-medium text-primary">
                                Rp {transaction.totalBiaya?.toLocaleString()}
                              </span>
                            </div>
                            <div>
                              <span className="inline-block w-32">Tanggal Booking:</span>
                              <span className="font-medium text-foreground/80">
                                {transaction.createdAt && format(new Date(transaction.createdAt), "dd MMM yyyy", { locale: id })}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div>
                          <Button
                            variant="outline"
                            size="sm"
                          >
                            Detail
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 flex flex-col items-center">
                <AlertCircle className="h-10 w-10 text-muted-foreground/50 mb-3" />
                <p className="text-muted-foreground mb-2">Tidak ditemukan riwayat booking</p>
                <p className="text-sm text-muted-foreground/70 max-w-md mb-4">Pastikan nomor telepon/WhatsApp yang Anda masukkan sama dengan yang digunakan saat melakukan pemesanan.</p>
                <Button asChild>
                  <a href="/availability">Cari Motor Tersedia</a>
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
