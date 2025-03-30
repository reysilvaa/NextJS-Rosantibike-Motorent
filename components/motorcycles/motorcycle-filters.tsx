"use client"

import { useState } from "react"
import { Search, Filter } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { useTranslation } from "@/i18n/hooks"
import { useMotorcycleFilters } from "@/contexts/motorcycle-filter-context"

export default function MotorcycleFilters() {
  const { t } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  
  // Menggunakan filter context
  const { filters, updateFilter, resetFilters, availableBrands, isLoading } = useMotorcycleFilters()

  // Handler untuk checkbox brands
  const handleBrandChange = (brandId: string, checked: boolean) => {
    // Cari brand object berdasarkan ID
    const brand = availableBrands.find(b => b.id === brandId);
    
    // Gunakan nilai merk sebagai filter value
    const brandValue = brand?.merk || "";
    
    if (!brandValue) {
      console.error(`Brand dengan ID ${brandId} tidak ditemukan atau tidak memiliki nilai merk`);
      return;
    }
    
    const updatedBrands = checked
      ? [...filters.brands, brandValue]
      : filters.brands.filter(value => value !== brandValue);
    
    updateFilter('brands', updatedBrands);
    
    // Log untuk debugging
    console.log(`Brand filter updated: ${brandValue} (${brandId}) is ${checked ? 'checked' : 'unchecked'}`);
    console.log(`Current brands filter:`, updatedBrands);
  }

  // Handler untuk search
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateFilter('search', e.target.value)
    
    // Tambahkan log untuk debugging filter
    console.log(`Search filter updated to: ${e.target.value}`);
  }

  // Handler untuk slider CC
  const handleCCChange = (value: number[]) => {
    // Ensure the value is an array of exactly 2 numbers
    if (Array.isArray(value) && value.length === 2) {
      updateFilter('ccRange', value as [number, number]);
      
      // Tambahkan log untuk debugging filter
      console.log(`CC range filter updated to: ${value[0]}-${value[1]} CC`);
    }
  }

  // Handler untuk slider tahun
  const handleYearChange = (value: number[]) => {
    // Ensure the value is an array of exactly 2 numbers
    if (Array.isArray(value) && value.length === 2) {
      updateFilter('yearRange', value as [number, number]);
      
      // Tambahkan log untuk debugging filter
      console.log(`Year range filter updated to: ${value[0]}-${value[1]}`);
    }
  }

  // Handler untuk reset filters
  const handleResetFilters = () => {
    resetFilters();
    console.log("Filters reset to default");
  };

  return (
    <>
      {/* Mobile Filters */}
      <div className="lg:hidden mb-6">
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <div className="flex items-center gap-2 mb-4">
            <Input 
              placeholder={t("searchMotorcycles")} 
              className="bg-card/50 border-border"
              value={filters.search} 
              onChange={handleSearchChange}
            />
            <CollapsibleTrigger asChild>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </CollapsibleTrigger>
          </div>

          <CollapsibleContent>
            <div className="bg-card/50 border border-border rounded-lg p-4 space-y-6">
              <div>
                <h3 className="font-medium mb-3">{t("engineSizeCC")}</h3>
                <Slider
                  value={filters.ccRange}
                  min={0}
                  max={1500}
                  step={50}
                  onValueChange={handleCCChange}
                  className="mb-2"
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>{filters.ccRange[0]} CC</span>
                  <span>{filters.ccRange[1]} CC</span>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-3">{t("year")}</h3>
                <Slider
                  value={filters.yearRange}
                  min={2010}
                  max={new Date().getFullYear()}
                  step={1}
                  onValueChange={handleYearChange}
                  className="mb-2"
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>{filters.yearRange[0]}</span>
                  <span>{filters.yearRange[1]}</span>
                </div>
              </div>

              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="brands" className="border-border">
                  <AccordionTrigger className="py-2">{t("brands")}</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2">
                      {isLoading ? (
                        <p className="text-sm text-muted-foreground">{t("loading")}</p>
                      ) : availableBrands.length === 0 ? (
                        <p className="text-sm text-muted-foreground">{t("noBrandsAvailable")}</p>
                      ) : (
                        availableBrands.map((brand) => (
                          <div key={brand.id} className="flex items-center space-x-2">
                            <Checkbox 
                              id={`mobile-${brand.id}`} 
                              checked={filters.brands.includes(brand.merk)}
                              onCheckedChange={(checked) => 
                                handleBrandChange(brand.id, checked as boolean)
                              }
                            />
                            <Label htmlFor={`mobile-${brand.id}`} className="text-sm font-normal cursor-pointer">
                              {brand.merk}
                            </Label>
                          </div>
                        ))
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              <div className="pt-2 flex gap-2">
                <Button variant="outline" className="flex-1" onClick={handleResetFilters}>
                  {t("reset")}
                </Button>
                <Button className="flex-1" onClick={() => setIsOpen(false)}>
                  {t("applyFilters")}
                </Button>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>

      {/* Desktop Filters */}
      <div className="hidden lg:block sticky top-24">
        <div className="bg-card/50 border border-border rounded-lg p-6 space-y-6">
          <div>
            <h3 className="font-medium mb-3">{t("search")}</h3>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder={t("searchMotorcycles")} 
                className="pl-9 bg-background/50 border-input"
                value={filters.search}
                onChange={handleSearchChange}
              />
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-3">{t("engineSizeCC")}</h3>
            <Slider 
              value={filters.ccRange} 
              min={0} 
              max={1500} 
              step={50} 
              onValueChange={handleCCChange} 
              className="mb-2" 
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{filters.ccRange[0]} CC</span>
              <span>{filters.ccRange[1]} CC</span>
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-3">{t("year")}</h3>
            <Slider
              value={filters.yearRange}
              min={2010}
              max={new Date().getFullYear()}
              step={1}
              onValueChange={handleYearChange}
              className="mb-2"
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{filters.yearRange[0]}</span>
              <span>{filters.yearRange[1]}</span>
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-3">{t("brands")}</h3>
            <div className="space-y-2">
              {isLoading ? (
                <p className="text-sm text-muted-foreground">{t("loading")}</p>
              ) : availableBrands.length === 0 ? (
                <p className="text-sm text-muted-foreground">{t("noBrandsAvailable")}</p>
              ) : (
                availableBrands.map((brand) => (
                  <div key={brand.id} className="flex items-center space-x-2">
                    <Checkbox 
                      id={brand.id} 
                      checked={filters.brands.includes(brand.merk)}
                      onCheckedChange={(checked) => 
                        handleBrandChange(brand.id, checked as boolean)
                      }
                    />
                    <Label htmlFor={brand.id} className="text-sm font-normal cursor-pointer">
                      {brand.merk}
                    </Label>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="pt-2 flex gap-2">
            <Button variant="outline" className="flex-1" onClick={handleResetFilters}>
              {t("reset")}
            </Button>
            <Button className="flex-1">
              {t("applyFilters")}
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}

