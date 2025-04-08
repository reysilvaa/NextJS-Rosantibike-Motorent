import { useState, useEffect } from "react"
import { format, parse } from "date-fns"
import type { DateRange } from "react-day-picker"
import { useSocketContext } from "@/contexts/socket-context"
import { useMotorcycleTypes } from "@/hooks/use-motorcycles"

export function useAvailabilitySearch(initialStartDate?: string | null, initialEndDate?: string | null) {
  const { data: motorcycleTypes, isLoading: isLoadingTypes } = useMotorcycleTypes()
  const [dateRange, setDateRange] = useState<DateRange | undefined>()
  const [motorcycleType, setMotorcycleType] = useState<string | undefined>()
  
  // Socket connection
  const { isConnected, joinRoom } = useSocketContext()

  // Initialize dates from props
  useEffect(() => {
    if (initialStartDate && initialEndDate) {
      try {
        const fromDate = parse(initialStartDate, "yyyy-MM-dd", new Date());
        const toDate = parse(initialEndDate, "yyyy-MM-dd", new Date());
        setDateRange({
          from: fromDate,
          to: toDate
        });
      } catch (e) {
        console.error("Error parsing initial dates", e);
      }
    }
  }, [initialStartDate, initialEndDate]);

  // Join socket room
  useEffect(() => {
    if (isConnected) {
      joinRoom("availability");
    }
  }, [isConnected, joinRoom]);

  const handleSearch = (onSearch?: (startDate: string, endDate: string, jenisMotorId?: string) => void) => {
    if (!dateRange?.from || !dateRange?.to) {
      console.warn("Start and end date are required")
      return
    }

    const formattedStartDate = format(dateRange.from, "yyyy-MM-dd");
    const formattedEndDate = format(dateRange.to, "yyyy-MM-dd");
    const selectedMotorcycleType = motorcycleType && motorcycleType !== "all" ? motorcycleType : undefined;

    if (onSearch) {
      onSearch(formattedStartDate, formattedEndDate, selectedMotorcycleType);
    }

    return {
      startDate: formattedStartDate,
      endDate: formattedEndDate,
      motorcycleType: selectedMotorcycleType
    }
  }

  return {
    dateRange,
    setDateRange,
    motorcycleType,
    setMotorcycleType,
    motorcycleTypes,
    isLoadingTypes,
    isConnected,
    handleSearch
  }
} 