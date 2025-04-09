"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertTriangle, Clock, Umbrella, HardHat } from "lucide-react";
import type { MotorcycleUnit } from "@/lib/types";

interface BookingDetailsStepProps {
  formData: {
    jamMulai: string;
    jamSelesai: string;
    jasHujan: number;
    helm: number;
  };
  motorcycle: MotorcycleUnit;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

export default function BookingDetailsStep({ 
  formData, 
  motorcycle, 
  onChange 
}: BookingDetailsStepProps) {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="space-y-2">
          <Label htmlFor="jamMulai" className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            Jam Mulai Sewa
          </Label>
          <Input
            id="jamMulai"
            name="jamMulai"
            type="time"
            value={formData.jamMulai}
            onChange={onChange}
            required
            className="bg-background/50 border-input focus:border-primary focus:ring-1 focus:ring-primary"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="jamSelesai" className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            Jam Akhir Sewa
          </Label>
          <Input
            id="jamSelesai"
            name="jamSelesai"
            type="time"
            value={formData.jamSelesai}
            onChange={onChange}
            required
            className="bg-background/50 border-input focus:border-primary focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="space-y-2">
          <Label htmlFor="jasHujan" className="flex items-center gap-2">
            <Umbrella className="h-4 w-4 text-muted-foreground" />
            Jas Hujan <span className="text-xs font-medium text-success bg-success/10 px-1.5 py-0.5 rounded">FREE</span>
          </Label>
          <select
            id="jasHujan"
            name="jasHujan"
            value={formData.jasHujan}
            onChange={onChange}
            className="w-full bg-background/50 border-input focus:border-primary focus:ring-1 focus:ring-primary rounded-md px-3 py-2"
          >
            <option value="0">0</option>
            <option value="1">1</option>
            <option value="2">2</option>
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="helm" className="flex items-center gap-2">
            <HardHat className="h-4 w-4 text-muted-foreground" />
            Helm <span className="text-xs font-medium text-success bg-success/10 px-1.5 py-0.5 rounded">FREE</span>
          </Label>
          <select
            id="helm"
            name="helm"
            value={formData.helm}
            onChange={onChange}
            className="w-full bg-background/50 border-input focus:border-primary focus:ring-1 focus:ring-primary rounded-md px-3 py-2"
          >
            <option value="0">0</option>
            <option value="1">1</option>
            <option value="2">2</option>
          </select>
        </div>
      </div>

      <div className="bg-warning/10 border border-warning/20 rounded-lg p-4 text-warning-foreground text-sm">
        <div className="flex items-start gap-2">
          <AlertTriangle className="h-5 w-5 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium mb-1">Informasi Tarif Sewa:</p>
            <p>Tarif sewa motor <strong>{motorcycle.jenis?.merk} {motorcycle.jenis?.model}</strong> adalah <span className="font-medium">Rp {motorcycle.hargaSewa.toLocaleString()}/hari</span>.</p>
            <p className="mt-1">Keterlambatan 1-6 jam dikenakan <span className="font-medium">biaya Rp 15.000/jam</span>.</p>
            <p className="mt-1">Keterlambatan lebih dari 6 jam dihitung sebagai <span className="font-medium">tambahan 1 hari penuh</span>.</p>
          </div>
        </div>
      </div>
    </>
  );
} 