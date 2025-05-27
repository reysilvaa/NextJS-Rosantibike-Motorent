'use client';

import { format } from 'date-fns';
import { Calendar, Filter, Search } from 'lucide-react';
import { useState } from 'react';
import type { DateRange } from 'react-day-picker';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Checkbox } from '@/components/ui/checkbox';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Slider } from '@/components/ui/slider';
import { useMotorcycleFilters } from '@/contexts/motorcycle-filter-context';
import { useAppTranslations } from '@/i18n/hooks';
import { cn } from '@/lib/utils/utils';

// Tambahkan StatusMotor enum sesuai dengan yang di backend
enum StatusMotor {
  TERSEDIA = 'TERSEDIA',
  DISEWA = 'DISEWA',
  DIPESAN = 'DIPESAN',
  OVERDUE = 'OVERDUE',
}

export default function MotorcycleFilters() {
  const { t } = useAppTranslations();
  const [isOpen, setIsOpen] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();

  // Menggunakan filter context
  const { filters, updateFilter, resetFilters, availableBrands, isLoading } =
    useMotorcycleFilters();

  // Handler untuk checkbox brands
  const handleBrandChange = (brandId: string, checked: boolean) => {
    // Cari brand object berdasarkan ID
    const brand = availableBrands.find(b => b.id === brandId);

    // Gunakan nilai merk sebagai filter value
    const brandValue = brand?.merk || '';

    if (!brandValue) {
      console.error(`Brand dengan ID ${brandId} tidak ditemukan atau tidak memiliki nilai merk`);
      return;
    }

    const updatedBrands = checked
      ? [...filters.brands, brandValue]
      : filters.brands.filter(value => value !== brandValue);

    updateFilter('brands', updatedBrands);

    // Log untuk debugging
    console.log(
      `Brand filter updated: ${brandValue} (${brandId}) is ${checked ? 'checked' : 'unchecked'}`
    );
    console.log(`Current brands filter:`, updatedBrands);
  };

  // Handler untuk search
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateFilter('search', e.target.value);

    // Tambahkan log untuk debugging filter
    console.log(`Search filter updated to: ${e.target.value}`);
  };

  // Handler untuk slider CC
  const handleCCChange = (value: number[]) => {
    // Ensure the value is an array of exactly 2 numbers
    if (Array.isArray(value) && value.length === 2) {
      // Only update if values have actually changed
      if (value[0] !== filters.ccMin || value[1] !== filters.ccMax) {
        updateFilter('ccMin', value[0]);
        updateFilter('ccMax', value[1]);

        // Log for debugging
        console.log(`CC range filter updated to: ${value[0]}-${value[1]} CC`);
      }
    }
  };

  // Handler untuk slider tahun
  const handleYearChange = (value: number[]) => {
    // Ensure the value is an array of exactly 2 numbers
    if (Array.isArray(value) && value.length === 2) {
      // Only update if values have actually changed
      if (value[0] !== filters.yearMin || value[1] !== filters.yearMax) {
        updateFilter('yearMin', value[0]);
        updateFilter('yearMax', value[1]);

        // Log for debugging
        console.log(`Year range filter updated to: ${value[0]}-${value[1]}`);
      }
    }
  };

  // Handler untuk reset filters
  const handleResetFilters = () => {
    resetFilters();
    setDateRange(undefined);
    console.log('Filters reset to default');
  };

  // Handler untuk update date range
  const handleDateRangeChange = (range: DateRange | undefined) => {
    setDateRange(range);
    if (range?.from && range?.to) {
      updateFilter('startDate', format(range.from, 'yyyy-MM-dd'));
      updateFilter('endDate', format(range.to, 'yyyy-MM-dd'));
    } else {
      updateFilter('startDate', '');
      updateFilter('endDate', '');
    }
  };

  return (
    <>
      {/* Mobile Filters */}
      <div className="lg:hidden mb-6">
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <div className="flex items-center gap-2 mb-4">
            <Input
              placeholder={t('searchMotorcycles')}
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
              {/* Date Range Picker */}
              <div>
                <h3 className="font-medium mb-3">{t('rentalPeriod')}</h3>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        'w-full justify-start text-left font-normal',
                        !dateRange?.from && 'text-muted-foreground'
                      )}
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {dateRange?.from ? (
                        dateRange?.to ? (
                          <>
                            {format(dateRange.from, 'LLL dd, y')} -{' '}
                            {format(dateRange.to, 'LLL dd, y')}
                          </>
                        ) : (
                          format(dateRange.from, 'LLL dd, y')
                        )
                      ) : (
                        <span>{t('pickDateRange')}</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      initialFocus
                      mode="range"
                      defaultMonth={dateRange?.from}
                      selected={dateRange}
                      onSelect={handleDateRangeChange}
                      numberOfMonths={2}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <h3 className="font-medium mb-3">{t('engineSizeCC')}</h3>
                <Slider
                  value={[filters.ccMin, filters.ccMax]}
                  min={0}
                  max={1500}
                  step={50}
                  onValueChange={handleCCChange}
                  className="mb-2"
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>{filters.ccMin} CC</span>
                  <span>{filters.ccMax} CC</span>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-3">{t('year')}</h3>
                <Slider
                  value={[filters.yearMin, filters.yearMax]}
                  min={2010}
                  max={new Date().getFullYear()}
                  step={1}
                  onValueChange={handleYearChange}
                  className="mb-2"
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>{filters.yearMin}</span>
                  <span>{filters.yearMax}</span>
                </div>
              </div>

              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="brands" className="border-border">
                  <AccordionTrigger className="py-2">{t('brands')}</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2">
                      {isLoading ? (
                        <p className="text-sm text-muted-foreground">{t('loading')}</p>
                      ) : availableBrands.length === 0 ? (
                        <p className="text-sm text-muted-foreground">{t('noBrandsAvailable')}</p>
                      ) : (
                        availableBrands.map(brand => (
                          <div key={brand.id} className="flex items-center space-x-2">
                            <Checkbox
                              id={`mobile-${brand.id}`}
                              checked={filters.brands.includes(brand.merk)}
                              onCheckedChange={checked =>
                                handleBrandChange(brand.id, checked as boolean)
                              }
                            />
                            <Label
                              htmlFor={`mobile-${brand.id}`}
                              className="text-sm font-normal cursor-pointer"
                            >
                              {brand.merk}
                            </Label>
                          </div>
                        ))
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              {/* Status Filter */}
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="status" className="border-border">
                  <AccordionTrigger className="py-2">{t('status')}</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2">
                      {Object.values(StatusMotor).map(status => (
                        <div key={status} className="flex items-center space-x-2">
                          <Checkbox
                            id={`mobile-status-${status}`}
                            checked={filters.status === status}
                            onCheckedChange={checked => {
                              updateFilter('status', checked ? status : undefined);
                            }}
                          />
                          <Label
                            htmlFor={`mobile-status-${status}`}
                            className="text-sm font-normal cursor-pointer"
                          >
                            {status}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              <div className="pt-2 flex gap-2">
                <Button variant="outline" className="flex-1" onClick={handleResetFilters}>
                  {t('reset')}
                </Button>
                <Button className="flex-1" onClick={() => setIsOpen(false)}>
                  {t('applyFilters')}
                </Button>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>

      {/* Desktop Filters */}
      <div className="hidden lg:block sticky top-24">
        <div className="bg-card/50 border border-border rounded-lg p-6 space-y-6">
          {/* Date Range Picker */}
          <div>
            <h3 className="font-medium mb-3">{t('rentalPeriod')}</h3>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    'w-full justify-start text-left font-normal',
                    !dateRange?.from && 'text-muted-foreground'
                  )}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  {dateRange?.from ? (
                    dateRange?.to ? (
                      <>
                        {format(dateRange.from, 'LLL dd, y')} - {format(dateRange.to, 'LLL dd, y')}
                      </>
                    ) : (
                      format(dateRange.from, 'LLL dd, y')
                    )
                  ) : (
                    <span>{t('pickDateRange')}</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  initialFocus
                  mode="range"
                  defaultMonth={dateRange?.from}
                  selected={dateRange}
                  onSelect={handleDateRangeChange}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div>
            <h3 className="font-medium mb-3">{t('search')}</h3>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t('searchMotorcycles')}
                className="pl-9 bg-background/50 border-input"
                value={filters.search}
                onChange={handleSearchChange}
              />
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-3">{t('engineSizeCC')}</h3>
            <Slider
              value={[filters.ccMin, filters.ccMax]}
              min={0}
              max={1500}
              step={50}
              onValueChange={handleCCChange}
              className="mb-2"
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{filters.ccMin} CC</span>
              <span>{filters.ccMax} CC</span>
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-3">{t('year')}</h3>
            <Slider
              value={[filters.yearMin, filters.yearMax]}
              min={2010}
              max={new Date().getFullYear()}
              step={1}
              onValueChange={handleYearChange}
              className="mb-2"
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{filters.yearMin}</span>
              <span>{filters.yearMax}</span>
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-3">{t('brands')}</h3>
            <div className="space-y-2">
              {isLoading ? (
                <p className="text-sm text-muted-foreground">{t('loading')}</p>
              ) : availableBrands.length === 0 ? (
                <p className="text-sm text-muted-foreground">{t('noBrandsAvailable')}</p>
              ) : (
                availableBrands.map(brand => (
                  <div key={brand.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={brand.id}
                      checked={filters.brands.includes(brand.merk)}
                      onCheckedChange={checked => handleBrandChange(brand.id, checked as boolean)}
                    />
                    <Label htmlFor={brand.id} className="text-sm font-normal cursor-pointer">
                      {brand.merk}
                    </Label>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Desktop Status Filter */}
          <div className="mb-6">
            <h3 className="font-medium mb-3">{t('status')}</h3>
            <div className="space-y-2">
              {Object.values(StatusMotor).map(status => (
                <div key={status} className="flex items-center space-x-2">
                  <Checkbox
                    id={`desktop-status-${status}`}
                    checked={filters.status === status}
                    onCheckedChange={checked => {
                      updateFilter('status', checked ? status : undefined);
                    }}
                  />
                  <Label
                    htmlFor={`desktop-status-${status}`}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {status}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-2 flex gap-2">
            <Button variant="outline" className="flex-1" onClick={handleResetFilters}>
              {t('reset')}
            </Button>
            <Button className="flex-1">{t('applyFilters')}</Button>
          </div>
        </div>
      </div>
    </>
  );
}
