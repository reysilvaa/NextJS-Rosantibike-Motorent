'use client';

import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { CalendarIcon, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useAppTranslations } from '@/i18n/hooks';
import { cn } from '@/lib/utils/utils';

export default function AvailabilityPreview() {
  const router = useRouter();
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const { t } = useAppTranslations();

  const handleSearch = () => {
    if (startDate && endDate) {
      const startDateStr = format(startDate, 'yyyy-MM-dd');
      const endDateStr = format(endDate, 'yyyy-MM-dd');
      router.push(`/availability?tanggalMulai=${startDateStr}&tanggalSelesai=${endDateStr}`);
    }
  };

  return (
    <section className="py-20 bg-gradient-to-b from-background to-background/80">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="bg-gradient-to-r from-card to-card/80 border border-border rounded-xl p-8 md:p-12 max-w-4xl mx-auto"
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('checkAvailabilityTitle')}</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {t('checkAvailabilityDescription')}
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-4 max-w-3xl mx-auto">
            <div className="flex-1">
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                {t('startDate')}
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'w-full justify-start text-left font-normal',
                      !startDate && 'text-muted-foreground'
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, 'PPP') : t('selectDate')}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    initialFocus
                    disabled={date => date < new Date()}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="flex-1">
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                {t('endDate')}
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'w-full justify-start text-left font-normal',
                      !endDate && 'text-muted-foreground'
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, 'PPP') : t('selectDate')}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    initialFocus
                    disabled={date => date < (startDate || new Date())}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="flex items-end">
              <Button
                className="w-full bg-primary hover:bg-primary/90"
                onClick={handleSearch}
                disabled={!startDate || !endDate}
              >
                <Search className="mr-2 h-4 w-4" />
                {t('check')}
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
