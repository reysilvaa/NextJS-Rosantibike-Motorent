'use client';

import { motion } from 'framer-motion';
import { CalendarDays, ChevronRight, Key, Tag } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';
import { useAvailability } from '@/hooks/availability/use-availability';
import { useTranslation } from '@/i18n/hooks';
import type { MotorcycleUnit } from '@/lib/types/motorcycle';
import { formatCurrency } from '@/lib/utils/utils';

interface AvailabilityResultsProps {
  motorcycles: MotorcycleUnit[];
  startDate: string;
  endDate: string;
  _isLoading?: boolean;
  _onBook?: (motorcycle: MotorcycleUnit) => void;
}

export default function AvailabilityResults({
  motorcycles,
  startDate,
  endDate,
  _isLoading,
  _onBook,
}: AvailabilityResultsProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const { sortOption, setSortOption, rentalDays, calculateTotalPrice } = useAvailability();

  const handleBookNow = (motorcycleId: string) => {
    if (
      !motorcycleId ||
      motorcycleId === 'undefined' ||
      motorcycleId === 'null' ||
      motorcycleId.trim() === ''
    ) {
      console.error('ID motor tidak valid');
      toast({
        title: 'Error',
        description: 'ID motor tidak valid, silakan coba motor lain',
        variant: 'destructive',
      });
      return;
    }

    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(motorcycleId)) {
      console.error('Format ID motor tidak valid');
      toast({
        title: 'Error',
        description: 'Format ID motor tidak valid, silakan coba motor lain',
        variant: 'destructive',
      });
      return;
    }

    router.push(
      `/availability/booking?unitId=${motorcycleId}&startDate=${startDate}&endDate=${endDate}`
    );
  };

  if (!motorcycles || motorcycles.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="bg-card/30 border-primary/5 p-10 text-center">
          <div className="flex flex-col items-center justify-center">
            <div className="mb-6 relative">
              <div className="absolute inset-0 bg-primary/5 rounded-full blur-2xl"></div>
              <div className="relative bg-primary/10 p-5 rounded-full">
                <CalendarDays className="h-10 w-10 text-primary/70" />
              </div>
            </div>
            <h3 className="text-2xl font-bold mb-3">{t('noMotorcyclesAvailable')}</h3>
            <p className="text-muted-foreground max-w-md mb-4">{t('noMotorcyclesAvailableDesc')}</p>
            <p className="text-sm text-muted-foreground mb-6">{t('tryDifferentDates')}</p>
          </div>
        </Card>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6 w-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col sm:flex-row justify-between items-center bg-card/70 border border-primary/10 rounded-lg p-5 mb-6 w-full"
      >
        <div>
          <h2 className="text-xl font-bold mb-1">{t('availableMotorcycles')}</h2>
          <p className="text-muted-foreground">
            <span className="font-medium text-foreground">{motorcycles.length}</span>{' '}
            {t('motorcyclesAvailable')}
          </p>
        </div>
        <div className="flex items-center gap-2 mt-4 sm:mt-0">
          <span className="text-sm text-muted-foreground hidden sm:inline">{t('sortBy')}:</span>
          <Select value={sortOption} onValueChange={setSortOption}>
            <SelectTrigger className="w-[180px] bg-background/50 border-primary/10">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="price-asc">{t('priceLowestFirst')}</SelectItem>
                <SelectItem value="price-desc">{t('priceHighestFirst')}</SelectItem>
                <SelectItem value="name-asc">{t('nameAZ')}</SelectItem>
                <SelectItem value="name-desc">{t('nameZA')}</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 gap-6 w-full">
        {motorcycles.map((motorcycle, index) => (
          <motion.div
            key={motorcycle.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="bg-card/60 border-primary/5 overflow-hidden hover:border-primary/20 transition-all duration-300 hover:shadow-xl">
              <div className="flex flex-col md:flex-row">
                <div className="md:w-1/3 lg:w-1/4 relative h-64 md:h-auto group overflow-hidden">
                  <div className="absolute inset-0">
                    <Image
                      src={
                        motorcycle.jenis?.gambar && motorcycle.jenis.gambar !== ''
                          ? motorcycle.jenis.gambar
                          : '/motorcycle-placeholder.svg'
                      }
                      alt={
                        motorcycle.jenis?.merk && motorcycle.jenis?.model
                          ? `${motorcycle.jenis.merk} ${motorcycle.jenis.model}`
                          : 'Gambar motor tidak tersedia'
                      }
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      onError={e => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = '/motorcycle-placeholder.svg';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  {motorcycle.jenis?.cc && (
                    <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm text-white text-xs font-medium px-2.5 py-1 rounded">
                      {motorcycle.jenis.cc} CC
                    </div>
                  )}
                </div>
                <CardContent className="flex-1 flex flex-col md:flex-row p-6 md:p-8">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-2xl font-bold text-foreground">
                        {motorcycle.jenis?.merk && motorcycle.jenis?.model
                          ? `${motorcycle.jenis.merk} ${motorcycle.jenis.model}`
                          : 'Detail motor tidak tersedia'}
                      </h3>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 mb-5">
                      <div className="inline-flex items-center gap-1 rounded-md bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                        <Key className="h-3 w-3" />
                        {motorcycle.platNomor || '-'}
                      </div>
                      {motorcycle.warna && (
                        <div className="inline-flex items-center gap-1 rounded-md bg-secondary/10 px-2.5 py-1 text-xs font-medium text-secondary-foreground">
                          <span className="h-2 w-2 rounded-full bg-secondary"></span>
                          {motorcycle.warna}
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="bg-primary/5 border border-primary/10 rounded-lg p-4 relative overflow-hidden">
                        <div className="absolute right-0 top-0 opacity-10 w-20 h-20">
                          <Tag className="h-12 w-12 text-primary -rotate-12" />
                        </div>
                        <p className="text-sm text-muted-foreground font-medium">
                          {t('pricePerDay')}
                        </p>
                        <p className="font-bold text-xl text-primary">
                          {formatCurrency(motorcycle.hargaSewa)}
                        </p>
                      </div>

                      <div className="bg-card border border-border rounded-lg p-4 relative overflow-hidden">
                        <div className="absolute right-0 top-0 opacity-10 w-20 h-20">
                          <CalendarDays className="h-12 w-12 text-foreground -rotate-12" />
                        </div>
                        <p className="text-sm text-muted-foreground font-medium">
                          {t('total')} ({rentalDays} {t('days')})
                        </p>
                        <p className="font-bold text-xl">
                          {formatCurrency(calculateTotalPrice(motorcycle))}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 md:mt-0 flex flex-col justify-center items-center md:items-end md:ml-8 shrink-0">
                    <div className="bg-gradient-to-r from-primary/20 to-primary/5 p-0.5 rounded-lg mb-3 w-full md:w-auto">
                      <Button
                        className="w-full md:w-auto min-w-40 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground font-bold py-2 px-6 rounded-md transition-all duration-300 transform hover:scale-105"
                        onClick={() => handleBookNow(motorcycle.id)}
                      >
                        {t('bookNow')}
                      </Button>
                    </div>

                    <Link
                      href={motorcycle.jenis?.id ? `/motorcycles/${motorcycle.jenis.id}` : '#'}
                      className="text-center text-sm text-primary hover:text-primary/80 hover:underline flex items-center gap-1.5 font-medium"
                    >
                      <span>{t('viewDetails')}</span>
                      <ChevronRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </CardContent>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
