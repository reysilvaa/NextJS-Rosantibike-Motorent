"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Calendar, BikeIcon, Search } from 'lucide-react'
import { useTranslation } from "@/i18n/hooks"
import { MotorcycleType } from "@/lib/types/motorcycle"

interface SearchFormProps {
  motorcycleTypes: MotorcycleType[];
  isLoading: boolean;
}

interface SearchFormState {
  motorcycleTypeId: string;
  pickupDate: string;
  returnDate: string;
}

export default function SearchForm({ motorcycleTypes, isLoading }: SearchFormProps) {
  const { t } = useTranslation()
  const [searchForm, setSearchForm] = useState<SearchFormState>({
    motorcycleTypeId: "",
    pickupDate: "",
    returnDate: ""
  })

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setSearchForm(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // Handle form submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Redirect to motorcycles page with search params
    window.location.href = `/motorcycles?typeId=${searchForm.motorcycleTypeId}&pickup=${searchForm.pickupDate}&return=${searchForm.returnDate}`
  }

  return (
    <motion.form
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
      className="bg-white/10 backdrop-blur-md p-6 rounded-xl border border-white/20 shadow-2xl"
      onSubmit={handleSearch}
    >
      <h3 className="text-white text-xl font-bold mb-4">{t("quickSearch") || "Quick Search"}</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-white/80 text-sm font-medium mb-1">
            {t("jenisMotor") || "Jenis Motor"}
          </label>
          <div className="relative">
            <BikeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 h-5 w-5" />
            <select 
              className="w-full bg-white/20 border border-white/30 rounded-lg py-2 pl-10 pr-3 text-white appearance-none focus:outline-none focus:ring-2 focus:ring-primary"
              name="motorcycleTypeId"
              value={searchForm.motorcycleTypeId}
              onChange={handleInputChange}
              required
            >
              <option value="" disabled className="bg-gray-800 text-white">Pilih Motor</option>
              {isLoading ? (
                <option value="" disabled className="bg-gray-800 text-white">Loading...</option>
              ) : (
                motorcycleTypes.map((motor) => (
                  <option key={motor.id} value={motor.id} className="bg-gray-800 text-white">
                    {motor.merk} {motor.model} - {motor.cc}cc
                  </option>
                ))
              )}
            </select>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-white/80 text-sm font-medium mb-1">
              {t("pickupDate") || "Pickup Date"}
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 h-5 w-5" />
              <input 
                type="date" 
                className="w-full bg-white/20 border border-white/30 rounded-lg py-2 pl-10 pr-3 text-white appearance-none focus:outline-none focus:ring-2 focus:ring-primary"
                name="pickupDate"
                value={searchForm.pickupDate}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
          
          <div>
            <label className="block text-white/80 text-sm font-medium mb-1">
              {t("returnDate") || "Return Date"}
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 h-5 w-5" />
              <input 
                type="date" 
                className="w-full bg-white/20 border border-white/30 rounded-lg py-2 pl-10 pr-3 text-white appearance-none focus:outline-none focus:ring-2 focus:ring-primary"
                name="returnDate"
                value={searchForm.returnDate}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
        </div>
        
        <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white">
          <Search className="mr-2 h-4 w-4" />
          {t("search") || "Search"}
        </Button>
      </div>
    </motion.form>
  )
} 