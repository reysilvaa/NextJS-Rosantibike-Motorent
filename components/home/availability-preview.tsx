'use client';

import { format } from 'date-fns';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  BikeIcon,
  CalendarIcon as CalendarFull,
  CalendarIcon,
  Clock,
  MapPin,
  Search,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAppTranslations } from '@/i18n/hooks';
import { fetchMotorcycleTypes } from '@/lib/network/api';
import { MotorcycleType } from '@/lib/types/motorcycle';
import { cn } from '@/lib/utils/utils';

export default function AvailabilityPreview() {
  const router = useRouter();
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [selectedMotorcycleId, setSelectedMotorcycleId] = useState('');
  const [motorcycleTypes, setMotorcycleTypes] = useState<MotorcycleType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { t  } = useAppTranslations();

  // Fetch motorcycle types from API
  useEffect(() => {
    const getMotorcycleTypes = async () => {
      try {
        setIsLoading(true);
        const data = await fetchMotorcycleTypes();
        if (data && Array.isArray(data) && data.length > 0) {
          setMotorcycleTypes(data);
          // Pilih motor pertama sebagai default
          if (data.length > 0) {
            setSelectedMotorcycleId(data[0].id);
          }
        }
        setIsLoading(false);
      } catch (err) {
        console.error('Error loading motorcycle types:', err);
        setIsLoading(false);
      }
    };

    getMotorcycleTypes();
  }, []);

  const handleSearch = () => {
    if (startDate && endDate) {
      const startDateStr = format(startDate, 'yyyy-MM-dd');
      const endDateStr = format(endDate, 'yyyy-MM-dd');
      router.push(
        `/availability?startDate=${startDateStr}&endDate=${endDateStr}&jenisMotorId=${selectedMotorcycleId}`
      );
    }
  };

  // Pengelompokan motor berdasarkan merk
  const getMerkFromMotor = (motor: MotorcycleType): string => {
    return motor.merk;
  };

  // Group motorcycles by merk
  const groupedMotorcycles = motorcycleTypes.reduce(
    (groups, motor) => {
      const merk = getMerkFromMotor(motor);
      if (!groups[merk]) {
        groups[merk] = [];
      }
      groups[merk].push(motor);
      return groups;
    },
    {} as Record<string, MotorcycleType[]>
  );

  const features = [
    {
      icon: <CalendarFull className="h-10 w-10 text-primary" />,
      title: t('instantBooking') || 'Instant Booking',
      description:
        t('instantBookingDesc') || 'Book your motorcycle in seconds with our easy-to-use platform',
    },
    {
      icon: <Clock className="h-10 w-10 text-primary" />,
      title: t('24/7Support') || '24/7 Support',
      description:
        t('24/7SupportDesc') || 'Our customer service team is available around the clock',
    },
    {
      icon: <MapPin className="h-10 w-10 text-primary" />,
      title: t('centralLocation') || 'Central Location',
      description:
        t('centralLocationDesc') ||
        'Conveniently located in Kota Malang for easy pickup and drop-off',
    },
  ];

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-background to-background/80 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(var(--primary),0.1),transparent_70%)]"></div>
      </div>

      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start max-w-6xl mx-auto">
          {/* Left side - Booking form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:sticky lg:top-24"
          >
            <div className="mb-8">
              <motion.h2
                className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                {t('checkAvailabilityTitle')}
              </motion.h2>
              <motion.p
                className="text-muted-foreground text-lg"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                {t('checkAvailabilityDescription')}
              </motion.p>
            </div>

            <Card className="border-primary/10 shadow-xl shadow-primary/5 overflow-hidden">
              <CardContent className="p-0">
                <Tabs defaultValue="dates" className="w-full">
                  <div className="bg-primary/5 border-b border-primary/10 px-6 py-4">
                    <TabsList className="grid grid-cols-2 bg-background/50">
                      <TabsTrigger value="dates" className="text-sm">
                        {t('selectDates') || 'Select Dates'}
                      </TabsTrigger>
                      <TabsTrigger value="motorcycleType" className="text-sm">
                        {t('selectMotorcycleType') || 'Select Motorcycle Type'}
                      </TabsTrigger>
                    </TabsList>
                  </div>

                  <div className="p-6">
                    <TabsContent value="dates" className="mt-0 space-y-6 min-h-[300px]">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-foreground/80 mb-1">
                            {t('startDate')}
                          </label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className={cn(
                                  'w-full justify-start text-left font-normal group hover:border-primary/50 transition-colors',
                                  !startDate && 'text-muted-foreground'
                                )}
                              >
                                <CalendarIcon className="mr-2 h-4 w-4 group-hover:text-primary transition-colors" />
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

                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-foreground/80 mb-1">
                            {t('endDate')}
                          </label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className={cn(
                                  'w-full justify-start text-left font-normal group hover:border-primary/50 transition-colors',
                                  !endDate && 'text-muted-foreground'
                                )}
                              >
                                <CalendarIcon className="mr-2 h-4 w-4 group-hover:text-primary transition-colors" />
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
                      </div>
                    </TabsContent>

                    <TabsContent value="motorcycleType" className="mt-0 min-h-[300px]">
                      <div className="space-y-4">
                        <p className="text-sm text-muted-foreground">
                          {t('selectMotorcycleTypeDesc') || 'Choose your preferred motorcycle type'}
                        </p>

                        {isLoading ? (
                          <div className="py-4 text-center text-muted-foreground">
                            {t('loading') || 'Loading motorcycle types...'}
                          </div>
                        ) : (
                          <div className="space-y-4 max-h-[250px] overflow-y-auto pr-2">
                            {Object.entries(groupedMotorcycles).map(([merk, motors]) => (
                              <div key={merk} className="space-y-2">
                                <h3 className="text-sm font-medium text-muted-foreground">
                                  {merk}
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                  {motors.map(motor => (
                                    <Button
                                      key={motor.id}
                                      type="button"
                                      variant={
                                        selectedMotorcycleId === motor.id ? 'default' : 'outline'
                                      }
                                      className={cn(
                                        'justify-start h-auto py-3 px-4',
                                        selectedMotorcycleId === motor.id
                                          ? 'bg-primary text-white'
                                          : 'border-primary/20 hover:border-primary hover:bg-primary/5'
                                      )}
                                      onClick={() => setSelectedMotorcycleId(motor.id)}
                                    >
                                      <BikeIcon className="h-4 w-4 mr-2 flex-shrink-0" />
                                      <div className="text-left">
                                        <div className="font-medium">
                                          {motor.merk} {motor.model}
                                        </div>
                                        <div className="text-xs opacity-80">{motor.cc}cc</div>
                                      </div>
                                    </Button>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </TabsContent>
                  </div>

                  <div className="border-t border-border p-6">
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button
                        className="w-full bg-primary hover:bg-primary/90 text-white group"
                        size="lg"
                        onClick={handleSearch}
                        disabled={!startDate || !endDate || !selectedMotorcycleId || isLoading}
                      >
                        <Search className="mr-2 h-5 w-5" />
                        {t('checkAvailability')}
                        <ArrowRight className="ml-2 h-4 w-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                      </Button>
                    </motion.div>
                  </div>
                </Tabs>
              </CardContent>
            </Card>
          </motion.div>

          {/* Right side - Features */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-8 lg:sticky lg:top-24"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                className="flex gap-6 items-start"
              >
                <div className="bg-primary/10 p-4 rounded-2xl">{feature.icon}</div>
                <div>
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              </motion.div>
            ))}

            <div className="mt-8 pt-8 border-t border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    {t('startingFrom') || 'Starting from'}
                  </p>
                  <p className="text-3xl font-bold text-primary">
                    Rp 100.000
                    <span className="text-sm font-normal text-muted-foreground">/day</span>
                  </p>
                </div>
                <div className="bg-primary/10 px-4 py-2 rounded-full">
                  <p className="text-primary font-medium">{t('bestValue') || 'Best Value'}</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
