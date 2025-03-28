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

export default function MotorcycleFilters() {
  const { t } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  const [ccRange, setCcRange] = useState([0, 1500])
  const [yearRange, setYearRange] = useState([2018, 2023])

  const brands = [
    { id: "honda", label: "Honda" },
    { id: "yamaha", label: "Yamaha" },
    { id: "kawasaki", label: "Kawasaki" },
    { id: "suzuki", label: "Suzuki" },
    { id: "ducati", label: "Ducati" },
    { id: "bmw", label: "BMW" },
    { id: "triumph", label: "Triumph" },
    { id: "harley", label: "Harley-Davidson" },
  ]

  const categories = [
    { id: "sport", label: "Sport" },
    { id: "naked", label: "Naked" },
    { id: "cruiser", label: "Cruiser" },
    { id: "adventure", label: "Adventure" },
    { id: "touring", label: "Touring" },
    { id: "scooter", label: "Scooter" },
  ]

  return (
    <>
      {/* Mobile Filters */}
      <div className="lg:hidden mb-6">
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <div className="flex items-center gap-2 mb-4">
            <Input placeholder={t("searchMotorcycles")} className="bg-card/50 border-border" />
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
                  defaultValue={ccRange}
                  min={0}
                  max={1500}
                  step={50}
                  onValueChange={setCcRange}
                  className="mb-2"
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>{ccRange[0]} CC</span>
                  <span>{ccRange[1]} CC</span>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-3">{t("year")}</h3>
                <Slider
                  defaultValue={yearRange}
                  min={2010}
                  max={2023}
                  step={1}
                  onValueChange={setYearRange}
                  className="mb-2"
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>{yearRange[0]}</span>
                  <span>{yearRange[1]}</span>
                </div>
              </div>

              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="brands" className="border-border">
                  <AccordionTrigger className="py-2">{t("brands")}</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2">
                      {brands.map((brand) => (
                        <div key={brand.id} className="flex items-center space-x-2">
                          <Checkbox id={`mobile-${brand.id}`} />
                          <Label htmlFor={`mobile-${brand.id}`} className="text-sm font-normal cursor-pointer">
                            {brand.label}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="categories" className="border-border">
                  <AccordionTrigger className="py-2">{t("categories")}</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2">
                      {categories.map((category) => (
                        <div key={category.id} className="flex items-center space-x-2">
                          <Checkbox id={`mobile-${category.id}`} />
                          <Label htmlFor={`mobile-${category.id}`} className="text-sm font-normal cursor-pointer">
                            {category.label}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              <div className="pt-2 flex gap-2">
                <Button variant="outline" className="flex-1">
                  {t("reset")}
                </Button>
                <Button className="flex-1">{t("applyFilters")}</Button>
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
              <Input placeholder={t("searchMotorcycles")} className="pl-9 bg-background/50 border-input" />
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-3">{t("engineSizeCC")}</h3>
            <Slider defaultValue={ccRange} min={0} max={1500} step={50} onValueChange={setCcRange} className="mb-2" />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{ccRange[0]} CC</span>
              <span>{ccRange[1]} CC</span>
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-3">{t("year")}</h3>
            <Slider
              defaultValue={yearRange}
              min={2010}
              max={2023}
              step={1}
              onValueChange={setYearRange}
              className="mb-2"
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{yearRange[0]}</span>
              <span>{yearRange[1]}</span>
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-3">{t("brands")}</h3>
            <div className="space-y-2">
              {brands.map((brand) => (
                <div key={brand.id} className="flex items-center space-x-2">
                  <Checkbox id={brand.id} />
                  <Label htmlFor={brand.id} className="text-sm font-normal cursor-pointer">
                    {brand.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-3">{t("categories")}</h3>
            <div className="space-y-2">
              {categories.map((category) => (
                <div key={category.id} className="flex items-center space-x-2">
                  <Checkbox id={category.id} />
                  <Label htmlFor={category.id} className="text-sm font-normal cursor-pointer">
                    {category.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-2 flex gap-2">
            <Button variant="outline" className="flex-1">
              {t("reset")}
            </Button>
            <Button className="flex-1">{t("applyFilters")}</Button>
          </div>
        </div>
      </div>
    </>
  )
}

