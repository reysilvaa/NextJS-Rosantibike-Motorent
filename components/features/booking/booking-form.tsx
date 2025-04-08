"use client";

import React, { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, CreditCard, ArrowLeft, ArrowRight } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import type { MotorcycleUnit } from "@/lib/types/types";
import { createTransaction, calculateRentalPrice as apiCalculateRentalPrice } from "@/lib/network/api";
import { calculateRentalPrice } from "@/lib/utils/booking-calculations";

// Import the step components
import PersonalInfoStep from "./step-personal-info";
import BookingDetailsStep from "./step-booking-details";
import ConfirmationStep from "./step-confirmation";
import BookingSummary from "./booking-summary";
import StepProgress from "./step-progress";

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
  const [isCalculating, setIsCalculating] = useState(false);
  const [backendPriceDetails, setBackendPriceDetails] = useState<any>(null);
  
  // Step state for multi-step form
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

  // Calculate price using local utility
  const priceBreakdown = calculateRentalPrice({
    motorcycle,
    startDate,
    endDate,
    jamMulai: formData.jamMulai,
    jamSelesai: formData.jamSelesai
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Function to go to next step
  const nextStep = () => {
    setCurrentStep((prevStep) => Math.min(prevStep + 1, totalSteps));
  };

  // Function to go to previous step
  const prevStep = () => {
    setCurrentStep((prevStep) => Math.max(prevStep - 1, 1));
  };

  // Validate current step before proceeding
  const validateStep = (step: number): boolean => {
    setFormError(null);
    
    if (step === 1) {
      if (!formData.namaCustomer.trim()) {
        setFormError("Nama tidak boleh kosong");
        return false;
      }
      if (!formData.noHP.trim()) {
        setFormError("Nomor telepon tidak boleh kosong");
        return false;
      }
      if (!formData.alamat.trim()) {
        setFormError("Alamat tidak boleh kosong");
        return false;
      }
      if (!formData.nomorKTP.trim()) {
        setFormError("Nomor KTP tidak boleh kosong");
        return false;
      }
      return true;
    }
    
    return true;
  };

  // Handle next button click with validation
  const handleNext = () => {
    if (validateStep(currentStep)) {
      nextStep();
    }
  };

  // Fungsi untuk mengambil kalkulasi harga dari backend
  const fetchPriceCalculation = useCallback(async () => {
    setIsCalculating(true);
    try {
      const result = await apiCalculateRentalPrice({
        unitId: motorcycle.id,
        tanggalMulai: format(startDate, "yyyy-MM-dd"),
        tanggalSelesai: format(endDate, "yyyy-MM-dd"),
        jamMulai: formData.jamMulai,
        jamSelesai: formData.jamSelesai,
        jasHujan: Number(formData.jasHujan),
        helm: Number(formData.helm)
      });
      
      setBackendPriceDetails(result);
      console.log("Price details from backend:", result);
    } catch (err) {
      console.error("Error fetching price calculation:", err);
      toast({
        title: "Error",
        description: "Gagal mendapatkan perhitungan harga. Menggunakan perhitungan lokal.",
        variant: "destructive",
      });
      // Use local calculation as fallback
    } finally {
      setIsCalculating(false);
    }
  }, [motorcycle.id, startDate, endDate, formData.jamMulai, formData.jamSelesai, formData.jasHujan, formData.helm, toast]);

  // Panggil API perhitungan harga ketika input form berubah
  useEffect(() => {
    fetchPriceCalculation();
  }, [fetchPriceCalculation]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError(null);

    try {
      // Use the total price from our local calculation if backend fails
      const finalPrice = backendPriceDetails?.totalPrice || priceBreakdown.totalPrice;
      
      await createTransaction({
        namaPenyewa: formData.namaCustomer,
        noWhatsapp: formData.noHP,
        unitId: motorcycle.id,
        tanggalMulai: format(startDate, "yyyy-MM-dd"),
        tanggalSelesai: format(endDate, "yyyy-MM-dd"),
        jamMulai: formData.jamMulai || "08:00",
        jamSelesai: formData.jamSelesai || "08:00",
        jasHujan: Number(formData.jasHujan || 0),
        helm: Number(formData.helm || 0),
        totalBiaya: finalPrice
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

  return (
    <Card className="bg-card border-border shadow-lg animate-fadeIn">
      <CardHeader className="bg-secondary/30 rounded-t-lg border-b border-border pb-4">
        <CardTitle className="text-xl flex items-center gap-2">
          <CreditCard className="h-5 w-5 text-primary" />
          Formulir Pemesanan Motor
        </CardTitle>
        <CardDescription>
          Lengkapi data diri Anda untuk menyewa motor
          <span className="block mt-1 text-warning">
            <span className="font-medium">Catatan:</span> Keterlambatan pengembalian dikenakan denda Rp 15.000/jam
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} id="bookingForm" className="space-y-5">
          <StepProgress currentStep={currentStep} totalSteps={totalSteps} />
          
          <BookingSummary
            motorcycle={motorcycle}
            startDate={startDate}
            endDate={endDate}
          />
          
          {currentStep === 1 && (
            <PersonalInfoStep 
              formData={formData} 
              onChange={handleChange} 
            />
          )}
          
          {currentStep === 2 && (
            <BookingDetailsStep 
              formData={formData} 
              motorcycle={motorcycle}
              onChange={handleChange} 
            />
          )}
          
          {currentStep === 3 && (
            <ConfirmationStep 
              formData={formData}
              motorcycle={motorcycle}
              startDate={startDate}
              endDate={endDate}
              priceBreakdown={priceBreakdown}
            />
          )}
          
          {formError && (
            <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4 text-destructive text-sm">
              {formError}
            </div>
          )}
        </form>
      </CardContent>
      <CardFooter className="border-t border-border pt-5 flex flex-col sm:flex-row gap-3">
        {currentStep > 1 && (
          <Button 
            type="button"
            variant="outline" 
            className="w-full sm:w-auto flex items-center justify-center gap-1"
            onClick={prevStep}
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali
          </Button>
        )}
        
        {currentStep < totalSteps && (
          <Button 
            type="button"
            className="w-full sm:w-auto flex items-center justify-center gap-1 bg-primary hover:bg-primary/90 text-primary-foreground"
            onClick={handleNext}
          >
            Lanjut
            <ArrowRight className="h-4 w-4" />
          </Button>
        )}
        
        {currentStep === totalSteps && (
          <Button
            type="submit"
            form="bookingForm"
            className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground py-6 text-base"
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
        )}
      </CardFooter>
    </Card>
  )
}
