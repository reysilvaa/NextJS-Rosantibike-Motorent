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
import { searchTransactionsByPhone } from "@/lib/network/api";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "@/i18n/hooks";
import { motion } from "framer-motion";
import { useAutoScroll } from "@/hooks/common/use-auto-scroll";
import { Skeleton } from "@/components/ui/skeleton";
import { generateMetadata } from '@/lib/seo/config';

export const metadata = generateMetadata({
  title: 'Booking History - Rosanti Bike Rental',
  description: 'View your motorcycle rental booking history and manage your reservations.',
  openGraph: {
    url: 'https://rosantibike.com/booking-history',
    images: ['/images/booking-history-og.jpg'],
  },
  robots: {
    index: true,
    follow: true,
  },
});

export default function BookingHistoryPage() {
  const { toast } = useToast();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isSearched, setIsSearched] = useState(false);
  const { t } = useTranslation();
  
  const { resultsRef, showResultIndicator } = useAutoScroll({
    shouldScroll: Boolean(isSearched),
    isLoading,
    hasData: transactions.length > 0,
  });

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!phoneNumber) {
      toast({
        title: t("phoneRequired"),
        description: t("enterPhoneNumber"),
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
          title: t("historyNotFound"),
          description: `${t("noBookingHistoryFound")} ${phoneNumber}`,
          variant: "default",
        });
      } else {
        toast({
          title: t("bookingHistoryFound"),
          description: `${t("foundBookingHistory")} ${data.length}`,
          variant: "default",
        });
      }
    } catch (error) {
      console.error("Error searching transactions:", error);
      toast({
        title: t("failedToLoadData"),
        description: t("errorSearchingTransactions"),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string, className: string, icon: React.ReactNode }> = {
      "PENDING": { 
        label: t("waitingConfirmation"), 
        className: "bg-warning/20 text-warning border-warning/30",
        icon: <Clock className="h-3 w-3 mr-1" />
      },
      "AKTIF": { 
        label: t("active"), 
        className: "bg-primary/20 text-primary border-primary/30",
        icon: <Tag className="h-3 w-3 mr-1" />
      },
      "SELESAI": { 
        label: t("completed"), 
        className: "bg-success/20 text-success border-success/30",
        icon: <CalendarIcon className="h-3 w-3 mr-1" />
      },
      "DIBATALKAN": { 
        label: t("cancelled"), 
        className: "bg-destructive/20 text-destructive border-destructive/30",
        icon: <AlertCircle className="h-3 w-3 mr-1" />
      },
      "OVERDUE": { 
        label: t("overdue"), 
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/95">
      {/* Hero section with background pattern */}
      <div className="relative bg-gradient-to-b from-primary/5 to-background pt-32 pb-24 border-b border-border/10 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] pointer-events-none"></div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="container mx-auto px-4 relative z-10"
        >
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div className="md:max-w-xl">
                <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full mb-4 text-sm font-medium">
                  <Calendar className="h-4 w-4" />
                  <span>{t("bookingHistory")}</span>
                </div>
                <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                {t("trackYourBookings")}
                </h1>
                <p className="text-muted-foreground text-lg max-w-xl">
                  {t("enterPhoneNumber")}
                </p>
              </div>
              
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="w-full md:w-auto"
              >
                <div className="relative p-1 rounded-xl">
                  <Card className="bg-card border border-primary/10 shadow-xl relative z-10 w-full">
                    <CardHeader className="border-b border-border/10 pb-4">
                      <CardTitle className="text-xl flex items-center gap-2">
                        <Search className="h-5 w-5 text-primary" />
                        {t("checkBookingHistory")}
                      </CardTitle>
                      <CardDescription>
                        {t("enterPhoneNumber")}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <form onSubmit={handleSearch} className="space-y-4">
                        <div className="flex flex-col md:flex-row gap-3">
                          <div className="flex-1">
                            <Label htmlFor="phoneNumber">{t("phoneNumber")}</Label>
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
                                  {t("searching")}
                                </span>
                              ) : (
                                <span className="flex items-center">
                                  {t("searchBooking")} <ArrowRight className="ml-2 h-4 w-4" />
                                </span>
                              )}
                            </Button>
                          </div>
                        </div>
                      </form>
                    </CardContent>
                  </Card>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
      
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          {/* Results section */}
          {isSearched && (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-8"
              ref={resultsRef}
            >
              <motion.div 
                variants={itemVariants} 
                className={`flex items-center justify-between border-b border-border/50 pb-6 relative ${
                  showResultIndicator ? "after:absolute after:inset-0 after:bg-primary/5 after:animate-pulse after:rounded-lg after:-z-10" : ""
                }`}
              >
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    <h2 className="text-2xl font-bold">{t("searchResults")}</h2>
                    {showResultIndicator && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/20 text-primary animate-bounce">
                        {t("newResults")}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center flex-wrap gap-2 text-muted-foreground">
                    <span className="bg-primary/5 px-3 py-1 rounded-md text-sm inline-flex items-center">
                      <Search className="h-3.5 w-3.5 mr-1.5" />
                      {phoneNumber}
                    </span>
                  </div>
                </div>
                
                <div className="relative w-64 hidden md:block">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/20 via-primary/5 to-transparent blur-xl"></div>
                </div>
              </motion.div>
              
              <motion.div variants={itemVariants}>
                {isLoading ? (
                  <div className="grid gap-6">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="bg-card/50 border border-border rounded-xl overflow-hidden">
                        <div className="flex flex-col md:flex-row">
                          <Skeleton className="h-64 md:w-1/3 lg:w-1/4" />
                          <div className="p-6 flex-1 flex flex-col md:flex-row gap-6">
                            <div className="flex-1 space-y-4">
                              <Skeleton className="h-8 w-3/4" />
                              <Skeleton className="h-4 w-1/2" />
                              <div className="grid grid-cols-2 gap-4 pt-4">
                                <Skeleton className="h-20 rounded-lg" />
                                <Skeleton className="h-20 rounded-lg" />
                              </div>
                            </div>
                            <div className="flex flex-col items-center justify-center gap-4 md:w-40">
                              <Skeleton className="h-12 w-40" />
                              <Skeleton className="h-4 w-24" />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : transactions.length > 0 ? (
                  <div className="space-y-4">
                    {transactions.map((transaction) => (
                      <Card key={transaction.id} className="bg-card/80 border-border hover:border-primary/20 transition-colors">
                        <CardContent className="p-6">
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="font-medium text-lg">
                                  {transaction.unitMotor?.jenis?.merk} {transaction.unitMotor?.jenis?.model}
                                </h3>
                                {getStatusBadge(transaction.status)}
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-4 text-sm text-muted-foreground">
                                <div className="flex items-center gap-2">
                                  <Motorcycle className="h-4 w-4 text-primary/70" />
                                  <span className="font-medium text-foreground/80">{transaction.unitMotor?.platNomor}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <CalendarIcon className="h-4 w-4 text-primary/70" />
                                  <span className="font-medium text-foreground/80">
                                    {format(new Date(transaction.tanggalMulai), "dd MMM yyyy", { locale: id })} - 
                                    {format(new Date(transaction.tanggalSelesai), "dd MMM yyyy", { locale: id })}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <CreditCard className="h-4 w-4 text-primary/70" />
                                  <span className="font-medium text-primary">
                                    Rp {transaction.totalBiaya?.toLocaleString()}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Clock className="h-4 w-4 text-primary/70" />
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
                                className="group"
                              >
                                {t("detail")}
                                <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="flex flex-col items-center justify-center py-16 text-center"
                  >
                    <div className="relative mb-8">
                      <div className="absolute inset-0 rounded-full bg-primary/10 blur-xl"></div>
                      <div className="relative z-10 bg-primary/10 rounded-full p-5">
                        <AlertCircle className="h-10 w-10 text-primary/80" />
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold mb-3">{t("noBookingHistoryFound")}</h3>
                    <p className="text-muted-foreground max-w-md mb-6">
                      {t("noBookingHistoryFoundMessage")}
                    </p>
                    <Button asChild>
                      <a href="/availability">{t("findAvailableMotorcycles")}</a>
                    </Button>
                  </motion.div>
                )}
              </motion.div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}