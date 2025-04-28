'use client';

import { format } from 'date-fns';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/components/ui/use-toast';
import { SocketEvents, useSocketContext } from '@/contexts/socket-context';
import { useAppTranslations } from '@/i18n/hooks';
import { checkAvailability, fetchMotorcycleTypeBySlug } from '@/lib/network/api';
import { StatusMotor } from '@/lib/types/enums';
import type { MotorcycleType, MotorcycleUnit } from '@/lib/types/motorcycle';

// Extend MotorcycleType for additional properties
interface ExtendedMotorcycleType extends MotorcycleType {
  tahun?: number;
  deskripsi?: string;
}

// Placeholder statis yang dijamin ada di folder public
const MOTORCYCLE_PLACEHOLDER = '/motorcycle-placeholder.svg';

// Tambahkan interface untuk response dari API
interface AvailabilityResponse {
  startDate: string;
  endDate: string;
  totalUnits: number;
  units: Array<
    MotorcycleUnit & {
      jenisMotor?: { id: string; merk: string; model: string; cc: number };
      availability?: Array<{ date: string; isAvailable: boolean }>;
    }
  >;
}

export default function MotorcycleDetail({ slug }: { slug: string }) {
  const { t  } = useAppTranslations();
  const router = useRouter();
  const [motorcycle, setMotorcycle] = useState<ExtendedMotorcycleType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [formattedStartDate, setFormattedStartDate] = useState<string | undefined>(undefined);
  const [formattedEndDate, setFormattedEndDate] = useState<string | undefined>(undefined);
  const [imageSrc, setImageSrc] = useState<string>(MOTORCYCLE_PLACEHOLDER);
  const [units, setUnits] = useState<MotorcycleUnit[]>([]);

  // State untuk ketersediaan
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);
  const [_availableUnits, setAvailableUnits] = useState<MotorcycleUnit[]>([]);
  const [_showAvailability, setShowAvailability] = useState(false);

  // Socket connection untuk mendapatkan real-time updates
  const { isConnected, joinRoom, listen } = useSocketContext();

  useEffect(() => {
    if (!isConnected || !motorcycle) return;

    // Join room untuk motor ini
    joinRoom(`motorcycle-${motorcycle.id}`);

    // Setup listeners
    const unsubStatusUpdate = listen(SocketEvents.MOTOR_STATUS_UPDATE, handleMotorStatusUpdate);
    const unsubUnitUpdate = listen('unit-update', handleUnitUpdate);
    const unsubUnitDelete = listen('unit-delete', handleUnitDelete);

    // Cleanup listeners on unmount
    return () => {
      unsubStatusUpdate();
      unsubUnitUpdate();
      unsubUnitDelete();
    };
  }, [isConnected, motorcycle, joinRoom, listen]);

  // Handler untuk update status motor
  function handleMotorStatusUpdate(data: any) {
    if (data && data.unitId) {
      // Update status pada unit yang sesuai
      setUnits(prevUnits =>
        prevUnits.map(unit => {
          if (unit.id === data.unitId) {
            // Toast notification untuk update status
            const statusText =
              data.status === StatusMotor.TERSEDIA
                ? t('available').toLowerCase()
                : data.status === StatusMotor.DISEWA
                  ? t('rented').toLowerCase()
                  : data.status === StatusMotor.DIPESAN
                    ? t('service').toLowerCase()
                    : t('unavailable').toLowerCase();

            toast({
              title: t('motorcycleStatusChanged'),
              description: `${t('unit')} ${unit.platNomor} ${t('isNow')} ${statusText}`,
              variant: data.status === StatusMotor.TERSEDIA ? 'default' : 'destructive',
            });

            return { ...unit, status: data.status };
          }
          return unit;
        })
      );
    }
  }

  // Handler untuk update informasi unit
  function handleUnitUpdate(updatedUnit: MotorcycleUnit) {
    if (!updatedUnit || !updatedUnit.id) return;

    // Periksa apakah unit sudah ada dalam daftar
    const unitExists = units.some(unit => unit.id === updatedUnit.id);

    if (unitExists) {
      // Update unit yang sudah ada
      setUnits(prevUnits =>
        prevUnits.map(unit => (unit.id === updatedUnit.id ? { ...unit, ...updatedUnit } : unit))
      );

      toast({
        title: t('motorcycleUnitUpdated'),
        description: `${t('infoFor')} ${updatedUnit.platNomor} ${t('hasBeenUpdated')}`,
      });
    } else {
      // Tambahkan unit baru jika jenisnya cocok dengan yang sedang dilihat
      if (updatedUnit.jenis?.id === slug) {
        setUnits(prevUnits => [...prevUnits, updatedUnit]);

        toast({
          title: t('newMotorcycleUnit'),
          description: `${t('newUnit')} ${updatedUnit.platNomor} ${t('hasBeenAdded')}`,
          variant: 'default',
        });
      }
    }
  }

  // Handler untuk penghapusan unit
  function handleUnitDelete(deletedUnit: { id: string; platNomor?: string }) {
    if (!deletedUnit || !deletedUnit.id) return;

    // Cek apakah unit ada dalam daftar
    const unitToDelete = units.find(unit => unit.id === deletedUnit.id);

    if (unitToDelete) {
      // Hapus unit dari daftar
      setUnits(prevUnits => prevUnits.filter(unit => unit.id !== deletedUnit.id));

      toast({
        title: t('motorcycleUnitDeleted'),
        description: `${t('unit')} ${unitToDelete.platNomor || deletedUnit.platNomor || t('motorcycle')} ${t('hasBeenRemovedFromSystem')}`,
        variant: 'destructive',
      });
    }
  }

  useEffect(() => {
    const fetchMotorcycleDetail = async () => {
      try {
        setIsLoading(true);
        const data = await fetchMotorcycleTypeBySlug(slug);

        // Cek apakah data valid
        if (data) {
          setMotorcycle(data);

          // Set image source dengan gambar dari API jika tersedia
          if (data.gambar) {
            setImageSrc(data.gambar);
          }

          // Jika unit motor tersedia langsung dalam respons API, simpan di state
          if (data.unitMotor && Array.isArray(data.unitMotor)) {
            setUnits(data.unitMotor);
          }

          setError(null);
        } else {
          // Handle kasus data tidak ada
          setError(t('motorcycleDataNotFound'));
        }
      } catch (err: any) {
        console.error('Error fetching motorcycle details:', err);
        setError(err.message || t('failedToLoadMotorcycleDetails'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchMotorcycleDetail();
  }, [slug, t]);

  useEffect(() => {
    if (startDate) {
      setFormattedStartDate(format(startDate, 'yyyy-MM-dd'));
    } else {
      setFormattedStartDate(undefined);
    }
  }, [startDate]);

  useEffect(() => {
    if (endDate) {
      setFormattedEndDate(format(endDate, 'yyyy-MM-dd'));
    } else {
      setFormattedEndDate(undefined);
    }
  }, [endDate]);

  // Fungsi untuk memeriksa ketersediaan motor
  const handleCheckAvailability = async () => {
    if (!startDate || !endDate) {
      toast({
        title: t('error'),
        description: t('dateRequired'),
        variant: 'destructive',
      });
      return;
    }

    // Validasi tanggal mulai tidak boleh lebih besar dari tanggal selesai
    if (startDate > endDate) {
      toast({
        title: t('dateError'),
        description: t('invalidDateRange'),
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsCheckingAvailability(true);

      // Format tanggal dalam bentuk YYYY-MM-DD (tanpa waktu)
      const formattedStartDate = format(startDate, 'yyyy-MM-dd');
      const formattedEndDate = format(endDate, 'yyyy-MM-dd');

      const searchParams = {
        tanggalMulai: formattedStartDate,
        tanggalSelesai: formattedEndDate,
        jenisMotorId: slug,
      };

      // Tambahkan logging untuk membantu debug
      console.log('Checking availability with params:', searchParams);

      // Ambil data ketersediaan dari API
      const response = await checkAvailability(searchParams);
      console.log('Availability response:', response);

      // Periksa format respons dan ekstrak unit yang tersedia
      let availableUnits: MotorcycleUnit[] = [];

      if (Array.isArray(response)) {
        // Format lama: langsung array unit
        availableUnits = response;
      } else if (response && typeof response === 'object') {
        // Format baru: objek dengan properti units
        // Gunakan type assertion untuk memberitahu TypeScript tentang struktur response
        const typedResponse = response as AvailabilityResponse;

        if (typedResponse.units && Array.isArray(typedResponse.units)) {
          // Perbarui struktur respons sesuai dengan endpoint backend baru
          availableUnits = typedResponse.units.filter(unit => {
            // Filter unit berdasarkan jenisId yang sama dengan ID motor yang sedang dilihat
            const isCorrectType = unit.jenisMotor?.id === slug;

            // Periksa availability dari semua hari
            const isFullyAvailable =
              unit.availability &&
              Array.isArray(unit.availability) &&
              unit.availability.every(day => day.isAvailable);

            return isCorrectType && isFullyAvailable;
          });
        }
      }

      setAvailableUnits(availableUnits);
      setShowAvailability(true);

      // Update units dengan data ketersediaan
      if (availableUnits.length > 0) {
        setUnits(availableUnits);

        toast({
          title: t('availabilityCheck'),
          description: t('motorcyclesAvailable', { count: availableUnits.length }),
        });
      } else {
        toast({
          title: t('availabilityCheck'),
          description: t('noMotorcyclesAvailable'),
          variant: 'destructive',
        });
      }
    } catch (err: any) {
      console.error('Error checking availability:', err);
      toast({
        title: t('error'),
        description: err.message || t('failedToCheckAvailability'),
        variant: 'destructive',
      });
    } finally {
      setIsCheckingAvailability(false);
    }
  };

  const handleImageError = () => {
    setImageSrc(MOTORCYCLE_PLACEHOLDER);
  };

  const handleRent = (unitId: string) => {
    if (!startDate || !endDate) {
      toast({
        title: 'Pilih Tanggal',
        description: 'Harap pilih tanggal penyewaan terlebih dahulu',
      });
      return;
    }

    if (!formattedStartDate || !formattedEndDate) return;

    router.push(
      `/availability/booking?unitId=${unitId}&startDate=${formattedStartDate}&endDate=${formattedEndDate}`
    );
  };

  // Menghitung jumlah hari sewa
  const _calculateDays = () => {
    if (!startDate || !endDate) return 1;
    return Math.max(
      1,
      Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
    );
  };

  if (isLoading) {
    return (
      <div className="py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Skeleton className="w-full aspect-video rounded-lg" />
          <div className="space-y-4">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !motorcycle) {
    return (
      <div className="py-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Error</h2>
        <p className="text-destructive mb-4">{error || 'Motor tidak ditemukan'}</p>
        <Button onClick={() => router.back()}>Kembali</Button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="py-8"
    >
      <Link href="/motorcycles" className="flex items-center mb-6 hover:text-primary">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="mr-2"
        >
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        Kembali ke Daftar Motor
      </Link>

      {/* Socket Connection Status */}
      <div className="mb-4 flex items-center">
        <Badge variant={isConnected ? 'outline' : 'destructive'} className="text-xs">
          {isConnected ? 'Live Updates Aktif' : 'Live Updates Tidak Aktif'}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="relative aspect-video rounded-lg overflow-hidden border border-border">
          <Image
            src={imageSrc}
            alt={`${motorcycle.merk} ${motorcycle.model}`}
            fill
            className="object-cover"
            priority
            onError={handleImageError}
          />
          <Badge className="absolute top-4 right-4 bg-primary text-lg">{motorcycle.cc} CC</Badge>
        </div>

        <div>
          <h1 className="text-3xl font-bold mb-2">
            {motorcycle.merk} {motorcycle.model}
          </h1>
          {motorcycle.tahun && (
            <p className="text-muted-foreground mb-4">Tahun: {motorcycle.tahun}</p>
          )}

          <Separator className="my-4" />

          {motorcycle.deskripsi && (
            <>
              <h2 className="text-xl font-semibold mb-2">Deskripsi</h2>
              <p className="text-foreground/80 mb-6">{motorcycle.deskripsi}</p>
            </>
          )}

          <Card className="bg-card/50 border-border">
            <CardHeader>
              <CardTitle>Cek Ketersediaan</CardTitle>
              <CardDescription>
                Pilih tanggal penyewaan untuk memeriksa ketersediaan motor ini
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium mb-2">Tanggal Mulai</h3>
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    disabled={date => date < new Date()}
                    className="border border-border rounded-md p-3"
                  />
                </div>
                <div>
                  <h3 className="text-sm font-medium mb-2">Tanggal Selesai</h3>
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    disabled={date => !startDate || date < startDate}
                    className="border border-border rounded-md p-3"
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                onClick={handleCheckAvailability}
                disabled={!startDate || !endDate || isCheckingAvailability}
              >
                {isCheckingAvailability ? 'Memeriksa...' : 'Periksa Ketersediaan'}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">Spesifikasi</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <Card className="bg-card/50 border-border">
            <CardHeader>
              <CardTitle className="text-lg">Merk</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xl">{motorcycle.merk}</p>
            </CardContent>
          </Card>
          <Card className="bg-card/50 border-border">
            <CardHeader>
              <CardTitle className="text-lg">Model</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xl">{motorcycle.model}</p>
            </CardContent>
          </Card>
          <Card className="bg-card/50 border-border">
            <CardHeader>
              <CardTitle className="text-lg">CC</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xl">{motorcycle.cc}</p>
            </CardContent>
          </Card>
          {motorcycle.tahun && (
            <Card className="bg-card/50 border-border">
              <CardHeader>
                <CardTitle className="text-lg">Tahun</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xl">{motorcycle.tahun}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Unit List */}
      {units.length > 0 && (
        <div className="mt-10">
          <h2 className="text-2xl font-bold mb-4">{t('availableUnits')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {units.map(unit => {
              // Cek status unit
              const isAvailable = unit.status === StatusMotor.TERSEDIA;

              // Cek ketersediaan untuk rentang tanggal yang dipilih jika availability data ada
              const hasAvailabilityData = unit.availability && Array.isArray(unit.availability);
              const isAvailableForDates = hasAvailabilityData
                ? unit.availability && unit.availability.every(day => day.isAvailable)
                : isAvailable;

              return (
                <Card key={unit.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{unit.platNomor}</CardTitle>
                      <Badge
                        className={
                          isAvailable
                            ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                            : 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                        }
                      >
                        {isAvailable ? t('available') : t('unavailable')}
                      </Badge>
                    </div>
                    <CardDescription>
                      {t('manufacturingYear')}: {unit.tahunPembuatan}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="flex justify-between items-center">
                      <div className="font-medium">
                        {t('rentalPrice')}:{' '}
                        <span className="text-primary font-bold">
                          Rp {new Intl.NumberFormat('id-ID').format(unit.hargaSewa)}
                        </span>
                        <span className="text-sm text-muted-foreground ml-1">{t('perDay')}</span>
                      </div>
                    </div>

                    {startDate && endDate && hasAvailabilityData && (
                      <div className="mt-2">
                        <Badge
                          variant={isAvailableForDates ? 'outline' : 'destructive'}
                          className="w-full justify-center mt-2"
                        >
                          {isAvailableForDates
                            ? t('availableForSelectedDates')
                            : t('unavailableForSelectedDates')}
                        </Badge>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter>
                    <Button
                      className="w-full"
                      disabled={!isAvailable || (startDate && endDate && !isAvailableForDates)}
                      onClick={() => handleRent(unit.id)}
                    >
                      {t('rentNow')}
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        </div>
      )}
    </motion.div>
  );
}
