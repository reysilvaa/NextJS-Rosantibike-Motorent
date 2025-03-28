"use client"

import MotorcycleList from "@/components/motorcycles/motorcycle-list"
import MotorcycleFilters from "@/components/motorcycles/motorcycle-filters"
import { useTranslation } from "@/i18n/hooks"

export default function MotorcyclesPageContent() {
  const { t } = useTranslation()
  
  return (
    <div className="container mx-auto px-4 py-20">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">{t("ourMotorcycleCollection")}</h1>
        <p className="text-xl text-gray-400 mb-10">
          {t("exploreMotorcycleDescription")}
        </p>
        
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-1/4">
            <MotorcycleFilters />
          </div>
          <div className="lg:w-3/4">
            <MotorcycleList />
          </div>
        </div>
      </div>
    </div>
  )
} 