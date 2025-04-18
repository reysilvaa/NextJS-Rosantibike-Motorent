'use client';

import { format } from 'date-fns';
import { Calendar, CheckCircle2, HardHat, Umbrella } from 'lucide-react';
import React from 'react';

import { Separator } from '@/components/ui/separator';
import type { MotorcycleUnit } from '@/lib/types';
import { formatDuration } from '@/lib/utils/booking-calculations';

interface ConfirmationStepProps {
  formData: {
    namaCustomer: string;
    noHP: string;
    alamat: string;
    nomorKTP: string;
    jamMulai: string;
    jamSelesai: string;
    jasHujan: number;
    helm: number;
  };
  motorcycle: MotorcycleUnit;
  startDate: Date;
  endDate: Date;
  priceBreakdown: {
    fullDays: number;
    extraHours: number;
    totalHours: number;
    isOverdue: boolean;
    baseDailyPrice: number;
    overduePrice: number;
    totalPrice: number;
    hargaSewaPerHari: number;
    dendaPerJam: number;
  };
}

export default function ConfirmationStep({
  formData,
  motorcycle,
  startDate,
  endDate,
  priceBreakdown,
}: ConfirmationStepProps) {
  const {
    fullDays,
    extraHours,
    totalHours,
    isOverdue,
    _baseDailyPrice,
    _overduePrice,
    totalPrice,
    hargaSewaPerHari,
    dendaPerJam,
  } = priceBreakdown;

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-center mb-4">
          <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center">
            <CheckCircle2 className="h-8 w-8 text-primary" />
          </div>
        </div>

        <h3 className="text-xl font-semibold text-center">Ringkasan Pemesanan</h3>
        <p className="text-muted-foreground text-center">
          Mohon periksa kembali detail pemesanan Anda
        </p>
      </div>

      <div className="bg-secondary/20 rounded-lg p-5 space-y-3 border border-border">
        <h4 className="font-medium text-sm uppercase text-muted-foreground mb-2">Detail Penyewa</h4>

        <div className="flex justify-between">
          <span className="text-sm text-muted-foreground">Nama:</span>
          <span className="text-sm font-medium">{formData.namaCustomer}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-sm text-muted-foreground">No. Telepon:</span>
          <span className="text-sm font-medium">{formData.noHP}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-sm text-muted-foreground">No. KTP:</span>
          <span className="text-sm font-medium">{formData.nomorKTP}</span>
        </div>

        <Separator className="my-2" />

        <h4 className="font-medium text-sm uppercase text-muted-foreground mb-2">Detail Sewa</h4>

        <div className="flex justify-between">
          <span className="text-sm text-muted-foreground">Motor:</span>
          <span className="text-sm font-medium">
            {motorcycle.jenis?.merk} {motorcycle.jenis?.model}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-sm text-muted-foreground">Plat Nomor:</span>
          <span className="text-sm font-medium">{motorcycle.platNomor}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-sm text-muted-foreground flex items-center gap-1">
            <Calendar className="h-3 w-3" /> Periode Sewa:
          </span>
          <span className="text-sm font-medium">
            {format(startDate, 'd MMM yyyy')} - {format(endDate, 'd MMM yyyy')}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-sm text-muted-foreground">Jam Sewa:</span>
          <span className="text-sm font-medium">
            {formData.jamMulai} - {formData.jamSelesai}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-sm text-muted-foreground">Durasi:</span>
          <span className="text-sm font-medium">
            {formatDuration(fullDays, extraHours, totalHours, isOverdue)}
            {isOverdue && <span className="ml-1 text-warning">(melebihi waktu)</span>}
          </span>
        </div>

        <Separator className="my-2" />

        <h4 className="font-medium text-sm uppercase text-muted-foreground mb-2">Biaya</h4>

        <div className="flex justify-between">
          <span className="text-sm text-muted-foreground">Harga Sewa:</span>
          <span className="text-sm font-medium">
            Rp {hargaSewaPerHari.toLocaleString()} × {fullDays} hari
          </span>
        </div>

        {isOverdue && (
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground text-warning">Biaya Keterlambatan:</span>
            <span className="text-sm font-medium text-warning">
              Rp {dendaPerJam.toLocaleString()} × {extraHours} jam
            </span>
          </div>
        )}

        {formData.jasHujan > 0 && (
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground flex items-center gap-1">
              <Umbrella className="h-3 w-3" /> Jas Hujan:
            </span>
            <span className="text-sm font-medium text-success">
              {formData.jasHujan} unit{' '}
              <span className="text-xs font-medium bg-success/10 px-1.5 py-0.5 rounded">FREE</span>
            </span>
          </div>
        )}

        {formData.helm > 0 && (
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground flex items-center gap-1">
              <HardHat className="h-3 w-3" /> Helm:
            </span>
            <span className="text-sm font-medium text-success">
              {formData.helm} unit{' '}
              <span className="text-xs font-medium bg-success/10 px-1.5 py-0.5 rounded">FREE</span>
            </span>
          </div>
        )}

        <Separator className="my-2" />

        <div className="flex justify-between pt-2">
          <span className="font-medium">Total Biaya:</span>
          <span className="text-primary font-bold text-lg">Rp {totalPrice.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}
