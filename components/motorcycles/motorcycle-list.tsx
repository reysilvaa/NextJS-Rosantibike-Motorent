"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useMotorcycleTypes } from "@/hooks/use-motorcycles"
import { useSocket, SocketEvents } from "@/hooks/use-socket"
import { toast } from "sonner"
import type { MotorcycleType } from "@/lib/types"
import { useTranslation } from "@/i18n/hooks"

// Placeholder statis yang dijamin ada di folder public
const MOTORCYCLE_PLACEHOLDER = "/motorcycle-placeholder.svg"

export default function MotorcycleList() {
  const { t } = useTranslation()
  const [searchTerm, setSearchTerm] = useState<string | undefined>(undefined)
  const { data: motorcycles, isLoading, error, refetch } = useMotorcycleTypes(searchTerm)
  const [hasNewMotor, setHasNewMotor] = useState(false)
  const [localMotorcycles, setLocalMotorcycles] = useState<MotorcycleType[]>([])

  // Setiap kali data dari API berubah, update local state
  useEffect(() => {
    if (motorcycles) {
      setLocalMotorcycles(motorcycles);
    }
  }, [motorcycles]);

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
    
    // Jika motor ada di list saat ini, update UI dengan data baru
    if (localMotorcycles?.some(motor => motor.id === data.id)) {
      setLocalMotorcycles(
        localMotorcycles.map(motor => 
          motor.id === data.id ? { ...motor, ...data } : motor
        )
      );
      
      toast.info(t("motorcycleInfoUpdated"), {
        description: `${t("dataOf")} ${data.merk || ''} ${data.model || ''} ${t("hasBeenUpdated")}`
      });
    }
  }
  
  // Handler untuk motor dihapus
  function handleDeleteMotorcycle(data: any) {
    if (!data || !data.id) return;
    
    // Jika motor ada di list saat ini, hapus dari UI
    if (localMotorcycles?.some(motor => motor.id === data.id)) {
      setLocalMotorcycles(
        localMotorcycles.filter(motor => motor.id !== data.id)
      );
      
      toast.warning(t("motorcycleDeleted"), {
        description: t("motorcycleRemovedFromSystem")
      });
    }
  }

  const displayMotorcycles = localMotorcycles && localMotorcycles.length > 0 ? localMotorcycles : []

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i} className="bg-gray-900/50 border-gray-800 overflow-hidden">
            <div className="h-48 bg-gray-800 animate-pulse" />
            <CardContent className="p-5">
              <div className="h-6 bg-gray-800 rounded animate-pulse mb-2" />
              <div className="h-4 bg-gray-800 rounded animate-pulse w-3/4 mb-4" />
              <div className="h-16 bg-gray-800 rounded animate-pulse" />
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
        <div className="bg-blue-900/20 border border-blue-800 rounded-lg p-4 flex justify-between items-center">
          <div>
            <p className="text-blue-400">{t("newMotorcycleData")}</p>
            <p className="text-sm text-blue-200/70">{t("reloadToSeeLatest")}</p>
          </div>
          <Button
            onClick={() => {
              refetch();
              setHasNewMotor(false);
            }}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {t("reload")}
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayMotorcycles.map((motorcycle, index) => (
            <MotorcycleCard key={motorcycle.id} motorcycle={motorcycle} index={index} />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {displayMotorcycles.map((motorcycle, index) => (
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
        <Card className="bg-gray-900/50 border-gray-800 overflow-hidden hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/10 h-full">
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
            <p className="text-gray-400 text-sm mb-3">{t("year")}: {motorcycle.tahun}</p>
            <p className="text-gray-300 line-clamp-3">{motorcycle.deskripsi}</p>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  )
}

