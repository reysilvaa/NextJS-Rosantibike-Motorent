"use client";

import React from "react";
import { format } from "date-fns";
import { Calendar } from "lucide-react";
import type { MotorcycleUnit } from "@/lib/types/types";

interface BookingSummaryProps {
  motorcycle: MotorcycleUnit;
  startDate: Date;
  endDate: Date;
}

export default function BookingSummary({ 
  motorcycle, 
  startDate, 
  endDate 
}: BookingSummaryProps) {
  return (
    <div className="bg-secondary/20 rounded-lg p-4 space-y-2 border border-border mb-4">
      <h4 className="font-medium text-sm uppercase text-muted-foreground">Ringkasan Motor</h4>
      
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
          <Calendar className="h-3 w-3" /> Periode:
        </span>
        <span className="text-sm font-medium">
          {format(startDate, "d MMM yyyy")} - {format(endDate, "d MMM yyyy")}
        </span>
      </div>
      
      <div className="flex justify-between">
        <span className="text-sm text-muted-foreground">Harga Sewa:</span>
        <span className="text-sm font-medium">
          Rp {motorcycle.hargaSewa.toLocaleString()}/hari
        </span>
      </div>
    </div>
  );
} 