"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, Calendar, Bike, AlertCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { format } from "date-fns";
import { useAuth } from "@/hooks/use-auth";
import { fetchUserTransactions } from "@/lib/api";
import type { Transaction } from "@/lib/types";

export default function ProfilePage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoadingTransactions, setIsLoadingTransactions] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login?returnUrl=/profile");
    }
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    const loadTransactions = async () => {
      if (isAuthenticated) {
        try {
          setIsLoadingTransactions(true);
          const data = await fetchUserTransactions();
          setTransactions(data);
        } catch (error) {
          console.error("Error fetching transactions:", error);
          toast({
            title: "Gagal memuat data",
            description: "Terjadi kesalahan saat memuat riwayat transaksi",
            variant: "destructive",
          });
        } finally {
          setIsLoadingTransactions(false);
        }
      }
    };

    loadTransactions();
  }, [isAuthenticated, toast]);

  if (isLoading) {
    return (
      <div className="container mx-auto py-12 min-h-[70vh] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null; // Router will redirect
  }

  const getStatusBadge = (status: string) => {
    const statusClasses: Record<string, string> = {
      pending: "bg-yellow-900/30 text-yellow-400 border-yellow-800",
      confirmed: "bg-green-900/30 text-green-400 border-green-800",
      active: "bg-blue-900/30 text-blue-400 border-blue-800",
      completed: "bg-gray-800/50 text-gray-400 border-gray-700",
      cancelled: "bg-red-900/30 text-red-400 border-red-800",
    };
    
    return (
      <span className={`px-2 py-1 text-xs rounded border ${statusClasses[status.toLowerCase()] || statusClasses.pending}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <Card className="bg-gray-900 border-gray-800 mb-8">
          <CardHeader className="pb-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20 border-2 border-primary">
                  <AvatarImage src={(user as any).avatar || undefined} alt={user.name || "User"} />
                  <AvatarFallback className="text-2xl bg-primary/20">
                    {user.name?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-2xl">{user.name || "Pengguna"}</CardTitle>
                  <CardDescription className="text-gray-400">{(user as any).email}</CardDescription>
                </div>
              </div>
              <Button className="bg-primary hover:bg-primary/90">Edit Profil</Button>
            </div>
          </CardHeader>
        </Card>

        <Tabs defaultValue="bookings" className="w-full">
          <TabsList className="bg-gray-800 border border-gray-700">
            <TabsTrigger value="bookings" className="data-[state=active]:bg-primary">
              Riwayat Booking
            </TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-primary">
              Pengaturan
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="bookings" className="mt-6">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <Calendar className="h-5 w-5" /> Riwayat Booking
                </CardTitle>
                <CardDescription>
                  Daftar riwayat pemesanan motor Anda
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingTransactions ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : transactions.length > 0 ? (
                  <div className="space-y-4">
                    {transactions.map((transaction) => (
                      <Card key={transaction.id} className="bg-gray-800/50 border-gray-700">
                        <CardContent className="p-4">
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <Bike className="h-5 w-5 text-primary" />
                                <h3 className="font-medium">
                                  {transaction.unitMotor?.jenis?.merk} {transaction.unitMotor?.jenis?.model}
                                </h3>
                                {getStatusBadge(transaction.status)}
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-4 text-sm text-gray-400">
                                <div>
                                  <span className="inline-block w-32">Plat Nomor:</span>
                                  <span className="font-medium text-gray-300">{transaction.unitMotor?.platNomor}</span>
                                </div>
                                <div>
                                  <span className="inline-block w-32">Periode:</span>
                                  <span className="font-medium text-gray-300">
                                    {format(new Date(transaction.tanggalMulai), "dd MMM yyyy")} - 
                                    {format(new Date(transaction.tanggalSelesai), "dd MMM yyyy")}
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
                                  <span className="font-medium text-gray-300">
                                    {transaction.createdAt ? format(new Date(transaction.createdAt), "dd MMM yyyy") : "-"}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="flex flex-col gap-2 md:items-end">
                              <Button
                                variant="outline"
                                size="sm"
                                className="border-gray-700 hover:bg-gray-700"
                              >
                                Detail
                              </Button>
                              {((transaction.status as string) === "PENDING" || (transaction.status as string) === "DIBUAT") && (
                                <Button
                                  variant="destructive"
                                  size="sm"
                                >
                                  Batalkan
                                </Button>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10 flex flex-col items-center">
                    <AlertCircle className="h-10 w-10 text-gray-500 mb-3" />
                    <p className="text-gray-400">Anda belum memiliki riwayat pemesanan</p>
                    <Button className="mt-4 bg-primary hover:bg-primary/90" asChild>
                      <a href="/availability">Lihat Motor Tersedia</a>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="settings" className="mt-6">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-xl">Pengaturan Akun</CardTitle>
                <CardDescription>
                  Kelola pengaturan dan preferensi akun Anda
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400">Fitur pengaturan akan segera hadir.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
} 