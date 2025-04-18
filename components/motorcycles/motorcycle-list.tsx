'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useMotorcycleFilters } from '@/contexts/motorcycle-filter-context';
import { useSocketContext } from '@/contexts/socket-context';
import { useAvailability, useMotorcycleTypes } from '@/hooks/use-motorcycles';
import { useTranslation } from '@/i18n/hooks';
import type { AvailabilitySearchParams } from '@/lib/types/forms';
import type { MotorcycleType } from '@/lib/types/motorcycle';

// Placeholder statis yang dijamin ada di folder public
const MOTORCYCLE_PLACEHOLDER = '/motorcycle-placeholder.svg';

// Helper function to normalize motorcycle data
const normalizeMotorcycle = (motorcycle: MotorcycleType): MotorcycleType => {
  return {
    ...motorcycle,
    gambar: motorcycle.gambar || MOTORCYCLE_PLACEHOLDER,
  };
};

export default function MotorcycleList() {
  const { t } = useTranslation();
  const { filters } = useMotorcycleFilters();

  // Gunakan filter dari context langsung ke hook
  const { data: motorcycles, isLoading, error, refetch } = useMotorcycleTypes(filters);
  const [_hasNewMotor, setHasNewMotor] = useState(false);

  // Check availability if dates are selected
  const availabilityParams: AvailabilitySearchParams | null =
    filters.startDate && filters.endDate
      ? {
          tanggalMulai: filters.startDate,
          tanggalSelesai: filters.endDate,
          jenisMotorId: undefined, // We'll check availability for all motorcycles
        }
      : null;

  const { data: availableUnits } = useAvailability(availabilityParams);

  // Debug untuk memastikan filter dan data berfungsi
  useEffect(() => {
    if (typeof window !== 'undefined') {
      console.log('Filters being applied:', filters);
      console.log('Motorcycles data received:', motorcycles?.length || 0);
      console.log('Available units:', availableUnits?.length || 0);

      if (motorcycles?.length > 0) {
        console.log('Sample motorcycle data:', motorcycles[0]);
      }
    }
  }, [filters, motorcycles, availableUnits]);

  // Re-fetch data ketika filter berubah
  useEffect(() => {
    refetch();
  }, [filters, refetch]);

  // Connect to socket for realtime motorcycle updates
  const { isConnected, listen, joinRoom } = useSocketContext();

  useEffect(() => {
    if (!isConnected) return;

    // Join motorcycles room
    joinRoom('motorcycles');

    // Subscribe to motorcycle events
    const unsubNew = listen('new-motorcycle', handleNewMotorcycle);
    const unsubUpdate = listen('update-motorcycle', handleUpdateMotorcycle);
    const unsubDelete = listen('delete-motorcycle', handleDeleteMotorcycle);

    return () => {
      unsubNew();
      unsubUpdate();
      unsubDelete();
    };
  }, [isConnected, listen, joinRoom]);

  // Handler untuk motor baru ditambahkan
  function handleNewMotorcycle(data: any) {
    if (!data || !data.id) return;

    toast.success(t('newMotorcycleAdded'), {
      description: `${data.merk || ''} ${data.model || ''} ${t('hasBeenAddedToList')}`,
      action: {
        label: t('refresh'),
        onClick: () => refetch(),
      },
    });

    setHasNewMotor(true);
  }

  // Handler untuk data motor diupdate
  function handleUpdateMotorcycle(data: any) {
    if (!data || !data.id) return;

    toast.info(t('motorcycleInfoUpdated'), {
      description: `${t('dataOf')} ${data.merk || ''} ${data.model || ''} ${t('hasBeenUpdated')}`,
    });

    // Refresh data otomatis setelah update
    refetch();
  }

  // Handler untuk motor dihapus
  function handleDeleteMotorcycle(data: any) {
    if (!data || !data.id) return;

    toast.warning(t('motorcycleDeleted'), {
      description: t('motorcycleRemovedFromSystem'),
    });

    // Refresh data otomatis setelah delete
    refetch();
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map(i => (
          <Card key={i} className="bg-card/50 border-border overflow-hidden">
            <div className="h-48 bg-muted animate-pulse" />
            <CardContent className="p-5">
              <div className="space-y-2">
                <div className="h-4 bg-muted rounded w-3/4 animate-pulse" />
                <div className="h-4 bg-muted rounded w-1/2 animate-pulse" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-destructive">{t('errorLoadingMotorcycles')}</p>
        <Button onClick={() => refetch()} className="mt-4">
          {t('tryAgain')}
        </Button>
      </div>
    );
  }

  if (!motorcycles || motorcycles.length === 0) {
    return (
      <div className="text-center py-10">
        <p>{t('noMotorcyclesFound')}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {motorcycles.map((motorcycle, index) => {
        // Check if this motorcycle type has available units
        const isAvailable = availableUnits?.some(unit => unit.jenis.id === motorcycle.id);

        return (
          <MotorcycleCard
            key={motorcycle.id}
            motorcycle={normalizeMotorcycle(motorcycle)}
            index={index}
            isAvailable={isAvailable}
            startDate={filters.startDate}
            endDate={filters.endDate}
          />
        );
      })}
    </div>
  );
}

interface MotorcycleCardProps {
  motorcycle: MotorcycleType;
  index: number;
  isAvailable?: boolean;
  startDate?: string;
  endDate?: string;
}

function MotorcycleCard({
  motorcycle,
  index,
  isAvailable,
  startDate,
  endDate,
}: MotorcycleCardProps) {
  const { t } = useTranslation();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card className="bg-card/50 border-border overflow-hidden hover:shadow-lg transition-all hover:border-primary/30 h-full flex flex-col">
        <Link
          href={`/motorcycles/${motorcycle.id}${startDate && endDate ? `?startDate=${startDate}&endDate=${endDate}` : ''}`}
          className="flex flex-col h-full"
        >
          <div className="relative h-48 overflow-hidden">
            <Image
              src={motorcycle.gambar || MOTORCYCLE_PLACEHOLDER}
              alt={motorcycle.merk + ' ' + motorcycle.model}
              fill
              className="object-cover transition-transform hover:scale-105"
              priority={index < 3}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 hover:opacity-100 transition-opacity" />
            {isAvailable !== undefined && (
              <Badge
                className={`absolute top-2 right-2 ${
                  isAvailable
                    ? 'bg-green-500/20 text-green-300 hover:bg-green-500/30'
                    : 'bg-destructive/20 text-destructive hover:bg-destructive/30'
                }`}
              >
                {isAvailable ? t('available') : t('unavailable')}
              </Badge>
            )}
          </div>

          <CardContent className="p-5 flex-grow flex flex-col">
            <div className="flex-grow">
              <h3 className="font-bold text-lg mb-1 line-clamp-1">
                {motorcycle.merk} {motorcycle.model}
              </h3>
              <div className="flex items-center gap-2 text-muted-foreground text-sm mb-3">
                <span className="flex items-center gap-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.6-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.5 2.8C1.4 11.3 1 12.1 1 13v3c0 .6.4 1 1 1h2" />
                    <circle cx="7" cy="17" r="2" />
                    <path d="M9 17h6" />
                    <circle cx="17" cy="17" r="2" />
                  </svg>
                  {motorcycle.cc}cc
                </span>
              </div>
            </div>

            <div className="pt-2 border-t border-border">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-1.5">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-muted-foreground flex-shrink-0"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                  <span className="text-sm text-muted-foreground truncate">{t('pricePerDay')}</span>
                </div>

                <div className="flex items-baseline">
                  <span className="text-lg font-semibold text-primary">
                    {motorcycle.unitMotor?.[0]?.hargaSewa?.toLocaleString() || '0'}
                  </span>
                  <span className="text-xs font-medium text-primary/80 ml-1">IDR</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Link>
      </Card>
    </motion.div>
  );
}
