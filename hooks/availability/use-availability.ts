import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { format, parse, differenceInDays } from 'date-fns';
import { useMotorcycleTypes } from '@/hooks/use-motorcycles';
import { useAutoScroll } from '@/hooks/common/use-auto-scroll';
import { MotorcycleType, AvailabilitySearchParams, MotorcycleUnit } from '@/lib/types';
import { useAvailability as useMotorcycleAvailability } from '@/hooks/use-motorcycles';
import ENDPOINTS from '@/lib/network/endpoint';

export function useAvailability() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [sortOption, setSortOption] = useState("price-asc");
  
  // Extract search params
  const tanggalMulai = searchParams.get("startDate");
  const tanggalSelesai = searchParams.get("endDate");
  const jenisMotorId = searchParams.get("jenisId") || undefined;
  
  // Get motorcycle type info for filter display
  const { data: motorcycleTypes } = useMotorcycleTypes();
  const selectedType = motorcycleTypes?.find(type => type.id === jenisMotorId);
  
  // Format dates for display
  const startDate = tanggalMulai 
    ? format(parse(tanggalMulai, "yyyy-MM-dd", new Date()), "d MMMM yyyy")
    : null;
  const endDate = tanggalSelesai 
    ? format(parse(tanggalSelesai, "yyyy-MM-dd", new Date()), "d MMMM yyyy")
    : null;
  
  // Only search if both dates are provided
  const canSearch = tanggalMulai && tanggalSelesai;
  const searchParamsObj = canSearch 
    ? { 
        tanggalMulai, 
        tanggalSelesai,
        jamMulai: "08:00", // Default time values
        jamSelesai: "08:00",
        ...(jenisMotorId ? { jenisMotorId } : {})
      } 
    : null;
  
  const { data: availableMotorcycles, isLoading, error } = useMotorcycleAvailability(searchParamsObj);

  const { resultsRef, showResultIndicator } = useAutoScroll({
    shouldScroll: Boolean(canSearch),
    isLoading,
    hasData: !!availableMotorcycles && availableMotorcycles.length > 0,
  });

  // Calculate rental days
  const rentalDays = canSearch && tanggalMulai && tanggalSelesai
    ? differenceInDays(parse(tanggalSelesai, "yyyy-MM-dd", new Date()), parse(tanggalMulai, "yyyy-MM-dd", new Date()))
    : 0;

  // Sort motorcycles
  const sortedMotorcycles = availableMotorcycles ? [...availableMotorcycles].sort((a, b) => {
    switch (sortOption) {
      case "price-asc":
        return a.hargaSewa - b.hargaSewa;
      case "price-desc":
        return b.hargaSewa - a.hargaSewa;
      case "name-asc":
        return `${a.jenis?.merk || ''} ${a.jenis?.model || ''}`.localeCompare(`${b.jenis?.merk || ''} ${b.jenis?.model || ''}`);
      case "name-desc":
        return `${b.jenis?.merk || ''} ${b.jenis?.model || ''}`.localeCompare(`${a.jenis?.merk || ''} ${a.jenis?.model || ''}`);
      default:
        return 0;
    }
  }) : [];

  // Calculate total price for a motorcycle
  const calculateTotalPrice = (motorcycle: MotorcycleUnit) => {
    return motorcycle.hargaSewa * rentalDays;
  };

  // Handle date range search
  const handleDateRangeSearch = (startDate: string, endDate: string) => {
    const queryString = new URLSearchParams();
    queryString.append("startDate", startDate);
    queryString.append("endDate", endDate);
    if (jenisMotorId) {
      queryString.append("jenisId", jenisMotorId);
    }

    const searchUrl = `/availability?${queryString.toString()}`;
    router.push(searchUrl);
  };

  return {
    // Search parameters
    tanggalMulai,
    tanggalSelesai,
    jenisMotorId,
    selectedType,
    startDate,
    endDate,
    canSearch,
    
    // Data
    availableMotorcycles: sortedMotorcycles,
    isLoading,
    error,
    
    // UI state
    resultsRef,
    showResultIndicator,
    
    // Sorting and price calculation
    sortOption,
    setSortOption,
    rentalDays,
    calculateTotalPrice,
    
    // Handlers
    handleDateRangeSearch
  };
}
