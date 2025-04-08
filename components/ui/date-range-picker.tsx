"use client"

import * as React from "react"
import { format } from "date-fns"
import { DateRange } from "react-day-picker"
import { CalendarIcon } from "@radix-ui/react-icons"
import { cn } from "@/lib/utils/utils"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useTranslation } from "@/i18n/hooks"
import { useMediaQuery } from "@/hooks/use-media-query"

// Core props for all date range pickers
interface CoreDateRangePickerProps {
  dateRange: DateRange | undefined
  onDateRangeChange: (range: DateRange | undefined) => void
  className?: string
  disabledDates?: (date: Date) => boolean
  numberOfMonths?: number
}

// Core calendar component
function CoreCalendar({
  dateRange,
  onDateRangeChange,
  disabledDates,
  numberOfMonths = 2
}: Pick<CoreDateRangePickerProps, "dateRange" | "onDateRangeChange" | "disabledDates" | "numberOfMonths">) {
  const defaultDisabledDates = (date: Date) => date < new Date()
  const disableDates = disabledDates || defaultDisabledDates

  return (
    <Calendar
      initialFocus
      mode="range"
      defaultMonth={dateRange?.from}
      selected={dateRange}
      onSelect={onDateRangeChange}
      numberOfMonths={numberOfMonths}
      disabled={disableDates}
      className="rounded-lg border border-border bg-card p-2 w-full"
    />
  )
}

// Inline variant (default)
export function DateRangePicker({
  dateRange,
  onDateRangeChange,
  className,
  disabledDates,
  numberOfMonths: customNumberOfMonths
}: CoreDateRangePickerProps) {
  const { t } = useTranslation()
  const isDesktop = useMediaQuery("(min-width: 768px)")
  
  // Determine the number of months based on screen size unless specified
  const numberOfMonths = customNumberOfMonths || (isDesktop ? 2 : 1)
  
  return (
    <div className={cn("grid gap-2", className)}>
      <div className="flex justify-center w-full">
        <div className="w-full flex justify-center">
          <CoreCalendar
            dateRange={dateRange}
            onDateRangeChange={onDateRangeChange}
            disabledDates={disabledDates}
            numberOfMonths={numberOfMonths}
          />
        </div>
      </div>
      {dateRange?.from && dateRange?.to && (
        <p className="text-sm text-muted-foreground text-center">
          {format(dateRange.from, "PPP")} - {format(dateRange.to, "PPP")}
        </p>
      )}
    </div>
  )
}

// Popover variant
export function DateRangePickerPopover({
  dateRange,
  onDateRangeChange,
  className,
  disabledDates,
  numberOfMonths: customNumberOfMonths
}: CoreDateRangePickerProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)")
  const numberOfMonths = customNumberOfMonths || (isDesktop ? 2 : 1)
  
  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-[300px] justify-start text-left font-normal",
              !dateRange && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {dateRange?.from ? (
              dateRange.to ? (
                <>
                  {format(dateRange.from, "dd/MM/yyyy")} -{" "}
                  {format(dateRange.to, "dd/MM/yyyy")}
                </>
              ) : (
                format(dateRange.from, "dd/MM/yyyy")
              )
            ) : (
              <span>Pilih tanggal</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <CoreCalendar
            dateRange={dateRange}
            onDateRangeChange={onDateRangeChange}
            disabledDates={disabledDates}
            numberOfMonths={numberOfMonths}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
} 