"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useMotorcycleTypes } from "@/hooks/use-motorcycles"
import { useSocket } from "@/hooks/use-socket"
import { toast } from "sonner"
import type { MotorcycleType } from "@/lib/types"
import { useTranslation } from "@/i18n/hooks"
import { useMotorcycleFilters } from "@/contexts/motorcycle-filter-context"

// Placeholder statis yang dijamin ada di folder public
const MOTORCYCLE_PLACEHOLDER = "/motorcycle-placeholder.svg"

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
  const { isConnected } = useSocket({
    room: 'motorcycles',
    events: {
      'new-motorcycle': handleNewMotorcycle,
      'update-motorcycle': handleUpdateMotorcycle,
      'delete-motorcycle': handleDeleteMotorcycle,
    }
  });

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
              <div className="h-6 bg-muted rounded animate-pulse mb-2" />
              <div className="h-4 bg-muted rounded animate-pulse w-3/4 mb-4" />
              <div className="h-16 bg-muted rounded animate-pulse" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500 mb-4">{error}</p>
        <Button onClick={() => window.location.reload()}>{t("tryAgain")}</Button>
      </div>
    )
  }
  
  if (hasNewMotor) {
    return (
      <div className="space-y-6">
        <div className="bg-accent/30 border border-accent rounded-lg p-4 flex justify-between items-center">
          <div>
            <p className="text-accent-foreground">{t("newMotorcycleData")}</p>
            <p className="text-sm text-accent-foreground/80">{t("reloadToSeeLatest")}</p>
          </div>
          <Button
            onClick={() => {
              refetch();
              setHasNewMotor(false);
            }}
            className="bg-primary hover:bg-primary/90"
          >
            {t("reload")}
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {motorcycles && motorcycles.map((motorcycle, index) => (
            <MotorcycleCard key={motorcycle.id} motorcycle={motorcycle} index={index} />
          ))}
        </div>
      </div>
    )
  }

  if (!motorcycles || motorcycles.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-lg mb-4">{t("noMotorcyclesFound")}</p>
        <Button onClick={() => refetch()}>
          {t("resetAndRefresh")}
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {motorcycles.map((motorcycle, index) => (
        <MotorcycleCard key={motorcycle.id} motorcycle={motorcycle} index={index} />
      ))}
    </div>
  )
}

// Komponen kartu motor yang lebih terstruktur
interface MotorcycleCardProps {
  motorcycle: MotorcycleType;
  index: number;
}

function MotorcycleCard({ motorcycle, index }: MotorcycleCardProps) {
  const { t } = useTranslation()
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link href={`/motorcycles/${motorcycle.id}`}>
        <Card className="bg-card/50 border-border overflow-hidden hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/10 h-full">
          <div className="relative h-48 overflow-hidden">
            <Image
              src={motorcycle.gambar || MOTORCYCLE_PLACEHOLDER}
              alt={`${motorcycle.merk} ${motorcycle.model}`}
              fill
              className="object-cover transition-transform hover:scale-105"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = MOTORCYCLE_PLACEHOLDER;
                target.onerror = null; // Mencegah infinite loop
              }}
            />
            <Badge className="absolute top-2 right-2 bg-primary">{motorcycle.cc} CC</Badge>
          </div>
          <CardContent className="p-5">
            <h3 className="text-xl font-bold mb-1">
              {motorcycle.merk} {motorcycle.model}
            </h3>
            <p className="text-muted-foreground text-sm mb-3">{t("year")}: {motorcycle.tahun}</p>
            <p className="text-foreground/80 line-clamp-3">{motorcycle.deskripsi}</p>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  )
}

