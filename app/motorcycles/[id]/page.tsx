import type { Metadata } from "next"
import { notFound } from "next/navigation"
import MotorcycleDetail from "@/components/motorcycles/motorcycle-detail"

export const metadata: Metadata = {
  title: "Detail Motor | MotoCruise",
  description: "Lihat detail motor dan ketersediaan untuk rental",
}

interface MotorcycleDetailPageProps {
  params: {
    id: string
  }
}

export default async function MotorcycleDetailPage({ params }: MotorcycleDetailPageProps) {
  // Await params untuk menghindari error "params should be awaited before using its properties"
  const resolvedParams = await Promise.resolve(params)
  const { id } = resolvedParams

  if (!id) {
    notFound()
  }

  return (
    <div className="pt-20 pb-20">
      <div className="container mx-auto px-4">
        <MotorcycleDetail id={id} />
      </div>
    </div>
  )
} 