'use client';

import { format, parse } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { DateRange } from 'react-day-picker';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { useAppTranslations } from '@/i18n/hooks';

interface DateRangeSearchProps {
  onSearch: (dateFrom: string, dateTo: string) => void;
  title?: string;
  description?: string;
  buttonText?: string;
  initialDateFrom?: string | null;
  initialDateTo?: string | null;
  cardClassName?: string;
  _usePopover?: boolean;
}

export default function DateRangeSearch({
  onSearch,
  title,
  description,
  buttonText,
  initialDateFrom,
  initialDateTo,
  cardClassName,
  _usePopover = true,
}: DateRangeSearchProps) {
  const { t  } = useAppTranslations();
  const [dateRange, setDateRange] = useState<DateRange | undefined>();

  // Inisialisasi tanggal dari props jika tersedia
  useEffect(() => {
    if (initialDateFrom && initialDateTo) {
      try {
        const fromDate = parse(initialDateFrom, 'yyyy-MM-dd', new Date());
        const toDate = parse(initialDateTo, 'yyyy-MM-dd', new Date());
        setDateRange({
          from: fromDate,
          to: toDate,
        });
      } catch (e) {
        console.error('Error parsing initial dates', e);
      }
    }
  }, [initialDateFrom, initialDateTo]);

  const handleSearch = () => {
    if (!dateRange?.from || !dateRange?.to) {
      console.warn(t('startAndEndDateRequired'));
      return;
    }

    const formattedDateFrom = format(dateRange.from, 'yyyy-MM-dd');
    const formattedDateTo = format(dateRange.to, 'yyyy-MM-dd');
    onSearch(formattedDateFrom, formattedDateTo);
  };

  return (
    <Card
      className={`${cardClassName || 'bg-card border-border'} shadow-md rounded-lg overflow-hidden`}
    >
      {(title || description) && (
        <CardHeader className="pb-2 space-y-1 bg-muted/40">
          {title && (
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" /> {title}
            </CardTitle>
          )}
          {description && <p className="text-muted-foreground text-sm">{description}</p>}
        </CardHeader>
      )}
      <CardContent className="space-y-5 p-4">
        <div className="bg-background rounded-md p-1">
          <DateRangePicker dateRange={dateRange} onDateRangeChange={setDateRange} />
        </div>
        <Button className="w-full font-medium" onClick={handleSearch} size="lg">
          {buttonText || t('search')}
        </Button>
      </CardContent>
    </Card>
  );
}
