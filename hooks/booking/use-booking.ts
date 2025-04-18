import { format } from 'date-fns';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

import {
  calculateRentalPrice as apiCalculateRentalPrice,
  checkMotorcycleAvailability,
  createTransaction,
} from '@/lib/network/api';
import type { MotorcycleUnit } from '@/lib/types';
import { calculateRentalPrice } from '@/lib/utils/booking-calculations';

import { useLoading } from '../common/use-loading';
import { useToast } from '../common/use-toast';

// Types for the booking form data
export interface BookingFormData {
  namaCustomer: string;
  noHP: string;
  alamat: string;
  nomorKTP: string;
  jasHujan: number;
  helm: number;
  jamMulai: string;
  jamSelesai: string;
}

// Types for booking hook params
export interface UseBookingParams {
  motorcycle: MotorcycleUnit;
  startDate: Date;
  endDate: Date;
  onSuccess?: () => void;
}

// Hook untuk mengelola proses booking
export function useBooking({ motorcycle, startDate, endDate, onSuccess }: UseBookingParams) {
  const router = useRouter();
  const { toast } = useToast();
  const { isLoading: isSubmitting, withLoading } = useLoading(false);
  const { isLoading: isCalculating, withLoading: withCalculatingLoading } = useLoading(false);
  const { isLoading: isCheckingAvailability, withLoading: withAvailabilityLoading } =
    useLoading(false);

  // Form state
  const [formData, setFormData] = useState<BookingFormData>({
    namaCustomer: '',
    noHP: '',
    alamat: '',
    nomorKTP: '',
    jasHujan: 0,
    helm: 0,
    jamMulai: '08:00',
    jamSelesai: '08:00',
  });

  // Error state
  const [formError, setFormError] = useState<string | null>(null);

  // Price state
  const [backendPriceDetails, setBackendPriceDetails] = useState<any>(null);

  // Availability state
  const [isAvailable, setIsAvailable] = useState<boolean>(true);

  // Multi-step form state
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

  // Calculate price using local utility
  const priceBreakdown = calculateRentalPrice({
    motorcycle,
    startDate,
    endDate,
    jamMulai: formData.jamMulai,
    jamSelesai: formData.jamSelesai,
  });

  // Handle form field changes
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, [name]: value }));
    },
    []
  );

  // Step navigation
  const nextStep = useCallback(() => {
    setCurrentStep(prevStep => Math.min(prevStep + 1, totalSteps));
  }, [totalSteps]);

  const prevStep = useCallback(() => {
    setCurrentStep(prevStep => Math.max(prevStep - 1, 1));
  }, []);

  // Validation
  const validateStep = useCallback(
    (step: number): boolean => {
      setFormError(null);

      if (step === 1) {
        if (!formData.namaCustomer.trim()) {
          setFormError('Nama tidak boleh kosong');
          return false;
        }
        if (!formData.noHP.trim()) {
          setFormError('Nomor telepon tidak boleh kosong');
          return false;
        }
        if (!formData.alamat.trim()) {
          setFormError('Alamat tidak boleh kosong');
          return false;
        }
        if (!formData.nomorKTP.trim()) {
          setFormError('Nomor KTP tidak boleh kosong');
          return false;
        }
        return true;
      }

      return true;
    },
    [formData]
  );

  // Check motorcycle availability
  const checkAvailability = useCallback(async () => {
    try {
      const response = await withAvailabilityLoading(
        checkMotorcycleAvailability({
          unitId: motorcycle.id,
          tanggalMulai: format(startDate, 'yyyy-MM-dd'),
          tanggalSelesai: format(endDate, 'yyyy-MM-dd'),
          jamMulai: formData.jamMulai,
          jamSelesai: formData.jamSelesai,
        })
      );

      const isMotorcycleAvailable = Boolean(response);
      setIsAvailable(isMotorcycleAvailable);

      if (!isMotorcycleAvailable) {
        setFormError(
          'Motor tidak tersedia pada rentang waktu yang dipilih. Silakan pilih waktu lain.'
        );
        return false;
      }

      return true;
    } catch (err) {
      console.error('Error checking availability:', err);
      setFormError('Gagal memeriksa ketersediaan motor. Silakan coba lagi.');
      return false;
    }
  }, [
    motorcycle.id,
    startDate,
    endDate,
    formData.jamMulai,
    formData.jamSelesai,
    withAvailabilityLoading,
  ]);

  // Handle next step with validation
  const handleNext = useCallback(async () => {
    if (currentStep === 2) {
      // Check availability before proceeding to confirmation step
      const isAvailable = await checkAvailability();
      if (!isAvailable) return;
    }

    if (validateStep(currentStep)) {
      nextStep();
    }
  }, [currentStep, nextStep, validateStep, checkAvailability]);

  // Fetch price calculation from backend
  const fetchPriceCalculation = useCallback(async () => {
    try {
      const result = await withCalculatingLoading(
        apiCalculateRentalPrice({
          unitId: motorcycle.id,
          tanggalMulai: format(startDate, 'yyyy-MM-dd'),
          tanggalSelesai: format(endDate, 'yyyy-MM-dd'),
          jamMulai: formData.jamMulai,
          jamSelesai: formData.jamSelesai,
          jasHujan: Number(formData.jasHujan),
          helm: Number(formData.helm),
        })
      );

      setBackendPriceDetails(result);
    } catch (err) {
      console.error('Error fetching price calculation:', err);
      toast({
        title: 'Error',
        description: 'Gagal mendapatkan perhitungan harga. Menggunakan perhitungan lokal.',
        variant: 'destructive',
      });
      // Use local calculation as fallback
    }
  }, [
    motorcycle.id,
    startDate,
    endDate,
    formData.jamMulai,
    formData.jamSelesai,
    formData.jasHujan,
    formData.helm,
    toast,
    withCalculatingLoading,
  ]);

  // Call price calculation API when input changes
  useEffect(() => {
    fetchPriceCalculation();
  }, [fetchPriceCalculation]);

  // Submit booking
  const handleSubmit = useCallback(
    async (e?: React.FormEvent) => {
      if (e) e.preventDefault();
      setFormError(null);

      try {
        // Check availability one final time before submitting
        const isAvailable = await checkAvailability();
        if (!isAvailable) return;

        // Use the total price from backend or fallback to local calculation
        const finalPrice = backendPriceDetails?.totalBiaya || priceBreakdown.totalPrice;

        const result = await withLoading(
          createTransaction({
            namaPenyewa: formData.namaCustomer,
            noWhatsapp: formData.noHP,
            unitId: motorcycle.id,
            tanggalMulai: format(startDate, 'yyyy-MM-dd'),
            tanggalSelesai: format(endDate, 'yyyy-MM-dd'),
            jamMulai: formData.jamMulai || '08:00',
            jamSelesai: formData.jamSelesai || '08:00',
            jasHujan: Number(formData.jasHujan || 0),
            helm: Number(formData.helm || 0),
            totalBiaya: finalPrice,
          })
        );

        toast({
          title: 'Booking berhasil',
          description: 'Pemesanan motor Anda telah dikonfirmasi',
          variant: 'default',
        });

        if (onSuccess) {
          onSuccess();
        } else {
          router.push(
            `/booking-success?name=${encodeURIComponent(formData.namaCustomer)}&motor=${encodeURIComponent(motorcycle.jenis?.merk + ' ' + motorcycle.jenis?.model)}&plate=${encodeURIComponent(motorcycle.platNomor)}&startDate=${encodeURIComponent(format(startDate, 'd MMM yyyy'))}`
          );
        }

        return result;
      } catch (err) {
        console.error(err);
        setFormError('Gagal membuat pemesanan. Silakan coba lagi.');
        toast({
          title: 'Booking gagal',
          description: 'Terjadi kesalahan saat membuat pemesanan',
          variant: 'destructive',
        });
        throw err;
      }
    },
    [
      backendPriceDetails,
      priceBreakdown.totalPrice,
      withLoading,
      formData,
      motorcycle,
      startDate,
      endDate,
      toast,
      onSuccess,
      router,
      checkAvailability,
    ]
  );

  return {
    formData,
    setFormData,
    handleChange,
    formError,
    currentStep,
    totalSteps,
    nextStep,
    prevStep,
    handleNext,
    priceBreakdown,
    backendPriceDetails,
    isSubmitting,
    isCalculating,
    isCheckingAvailability,
    isAvailable,
    handleSubmit,
    validateStep,
  };
}
