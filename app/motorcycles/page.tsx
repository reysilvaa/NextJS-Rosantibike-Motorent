import type { Metadata } from "next"
import MotorcycleList from "@/components/motorcycles/motorcycle-list"
import MotorcycleFilters from "@/components/motorcycles/motorcycle-filters"

export const metadata: Metadata = {
  title: "Motorcycles | MotoCruise",
  description: "Browse our collection of premium motorcycles available for rent",
}

export default function MotorcyclesPage() {
  return (
    <div className="pt-20 pb-20">
      <div className="container mx-auto px-4">
        <div className="py-10">
          <h1 className="text-4xl font-bold mb-6">Our Motorcycles</h1>
          <p className="text-gray-400 max-w-3xl">
            Browse our extensive collection of premium motorcycles available for rent. From sporty rides to comfortable
            cruisers, we have the perfect bike for your adventure.
          </p>
        </div>

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

