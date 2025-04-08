"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useMotorcycleTypes } from "@/hooks/use-motorcycles"
import { useSocketContext } from "@/contexts/socket-context"
import { toast } from "sonner"
import type { MotorcycleType } from "@/lib/types"
import { useTranslation } from "@/i18n/hooks"
import { useMotorcycleFilters } from "@/contexts/motorcycle-filter-context"

// Placeholder statis yang dijamin ada di folder public
const MOTORCYCLE_PLACEHOLDER = "/motorcycle-placeholder.svg"

// Helper function to normalize motorcycle data
const normalizeMotorcycle = (motorcycle: MotorcycleType): MotorcycleType => {
  return {
    ...motorcycle,
    imageUrl: motorcycle.imageUrl || motorcycle.gambar,
    year: motorcycle.year || motorcycle.tahun,
    pricePerDay: motorcycle.pricePerDay || (motorcycle.unitMotor?.[0]?.hargaSewa || 0),
    status: motorcycle.status || (motorcycle.unitMotor?.[0]?.status === "TERSEDIA" ? "available" : 
                               motorcycle.unitMotor?.[0]?.status === "DISEWA" ? "rented" : "maintenance")
  };
};

export default function MotorcycleList() {
  const { t } = useTranslation()
  const { filters } = useMotorcycleFilters()
  
  // Gunakan filter dari context langsung ke hook
  const { data: motorcycles, isLoading, error, refetch } = useMotorcycleTypes(filters)
  const [hasNewMotor, setHasNewMotor] = useState(false)
  
  // Debug untuk memastikan filter dan data berfungsi
  useEffect(() => {
    if (typeof window !== 'undefined') {
      console.log("Filters being applied:", filters);
      console.log("Motorcycles data received:", motorcycles?.length || 0);
      
      if (motorcycles?.length > 0) {
        console.log("Sample motorcycle data:", motorcycles[0]);
      }
    }
  }, [filters, motorcycles]);

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
    
    toast.success(t("newMotorcycleAdded"), {
      description: `${data.merk || ''} ${data.model || ''} ${t("hasBeenAddedToList")}`,
      action: {
        label: t("refresh"),
        onClick: () => refetch(),
      },
    });
    
    setHasNewMotor(true);
  }
  
  // Handler untuk data motor diupdate
  function handleUpdateMotorcycle(data: any) {
    if (!data || !data.id) return;
    
    toast.info(t("motorcycleInfoUpdated"), {
      description: `${t("dataOf")} ${data.merk || ''} ${data.model || ''} ${t("hasBeenUpdated")}`
    });
    
    // Refresh data otomatis setelah update
    refetch();
  }
  
  // Handler untuk motor dihapus
  function handleDeleteMotorcycle(data: any) {
    if (!data || !data.id) return;
    
    toast.warning(t("motorcycleDeleted"), {
      description: t("motorcycleRemovedFromSystem")
    });
    
    // Refresh data otomatis setelah delete
    refetch();
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
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
        <p className="text-destructive">{t("errorLoadingMotorcycles")}</p>
        <Button onClick={() => refetch()} className="mt-4">
          {t("tryAgain")}
        </Button>
      </div>
    );
  }

  if (!motorcycles || motorcycles.length === 0) {
    return (
      <div className="text-center py-10">
        <p>{t("noMotorcyclesFound")}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {motorcycles.map((motorcycle, index) => (
        <MotorcycleCard 
          key={motorcycle.id} 
          motorcycle={normalizeMotorcycle(motorcycle)} 
          index={index} 
        />
      ))}
    </div>
  );
}

interface MotorcycleCardProps {
  motorcycle: MotorcycleType;
  index: number;
}

function MotorcycleCard({ motorcycle, index }: MotorcycleCardProps) {
  const { t } = useTranslation();
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card className="bg-card/50 border-border overflow-hidden hover:shadow-lg transition-shadow">
        <Link href={`/motorcycles/${motorcycle.id}`}>
          <div className="relative h-48">
            <Image
              src={motorcycle.imageUrl || MOTORCYCLE_PLACEHOLDER}
              alt={motorcycle.merk + " " + motorcycle.model}
              fill
              className="object-cover"
              priority={index < 3}
            />
            {motorcycle.status === "available" && (
              <Badge className="absolute top-2 right-2 bg-green-500">
                {t("available")}
              </Badge>
            )}
            {motorcycle.status === "rented" && (
              <Badge className="absolute top-2 right-2 bg-yellow-500">
                {t("rented")}
              </Badge>
            )}
            {motorcycle.status === "maintenance" && (
              <Badge className="absolute top-2 right-2 bg-red-500">
                {t("maintenance")}
              </Badge>
            )}
          </div>
          <CardContent className="p-5">
            <h3 className="font-semibold text-lg mb-1">
              {motorcycle.merk} {motorcycle.model}
            </h3>
            <p className="text-muted-foreground text-sm mb-2">
              {motorcycle.year} • {motorcycle.cc}cc
            </p>
            <p className="text-primary font-semibold">
              {t("pricePerDay")}: {motorcycle.pricePerDay ? motorcycle.pricePerDay.toLocaleString() : '0'} IDR
            </p>
          </CardContent>
        </Link>
      </Card>
    </motion.div>
  );
}

