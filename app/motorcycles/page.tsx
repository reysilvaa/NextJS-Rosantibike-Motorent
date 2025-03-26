import type { Metadata } from "next"
import MotorcycleList from "@/components/motorcycles/motorcycle-list"
import MotorcycleFilters from "@/components/motorcycles/motorcycle-filters"

export const metadata: Metadata = {
  title: "Koleksi Motor | MotoCruise",
  description: "Jelajahi koleksi motor premium kami yang tersedia untuk disewa",
}

export default function MotorcyclesPage() {
  return (
    <div className="container mx-auto px-4 py-20">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">Koleksi Motor Kami</h1>
        <p className="text-xl text-gray-400 mb-10">
          Jelajahi koleksi motor premium kami yang tersedia untuk disewa. Dari motor sport hingga cruiser yang nyaman, kami memiliki motor sempurna untuk petualangan Anda.
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

