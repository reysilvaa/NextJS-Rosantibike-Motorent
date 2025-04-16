'use client';

import { motion } from 'framer-motion';
import { ArrowRight, ChevronRight, Clock, Gauge, Star } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { useTranslation } from '@/i18n/hooks';
import { fetchMotorcycleTypes } from '@/lib/network/api';
import type { MotorcycleType } from '@/lib/types/motorcycle';

export default function FeaturedMotorcycles() {
  const [motorcycles, setMotorcycles] = useState<MotorcycleType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const { t } = useTranslation();

  useEffect(() => {
    const getMotorcycles = async () => {
      try {
        setIsLoading(true);
        console.log('Fetching motorcycle types...');
        const data = await fetchMotorcycleTypes();

        console.log('Response from fetchMotorcycleTypes:', data);

        if (data && Array.isArray(data) && data.length > 0) {
          console.log(`Successfully fetched ${data.length} motorcycle types`);
          const featuredMotorcycles = data.slice(0, 8);
          setMotorcycles(featuredMotorcycles);
        } else {
          console.warn('Data dari API kosong atau bukan array, menggunakan placeholder');
          setMotorcycles([]);
        }
        setIsLoading(false);
      } catch (err) {
        console.error('Error saat fetching data motor:', err);
        setError(t('loadingFailed'));
        setIsLoading(false);
      }
    };

    getMotorcycles();
  }, [t]);

  // Placeholder data for when API fails or during development

  const displayMotorcycles = motorcycles.length > 0 ? motorcycles : [];

  // Add categories to motorcycles if they don't have them
  const enhancedMotorcycles = displayMotorcycles.map(motorcycle => {
    // Add kategori based on CC if not present
    const kategori = motorcycle.cc <= 200 ? 'Scooter' : motorcycle.cc <= 500 ? 'Sport' : 'Naked';

    // Add rating if not present
    const rating = 4.5 + Math.random() * 0.5;

    // Get harga from unitMotor if available, otherwise calculate based on CC
    const harga =
      motorcycle.unitMotor && motorcycle.unitMotor.length > 0
        ? motorcycle.unitMotor[0].hargaSewa
        : 100000 + motorcycle.cc * 200;

    return {
      ...motorcycle,
      kategori,
      rating,
      harga,
    };
  });

  // Get unique categories
  const categories = ['all', ...new Set(enhancedMotorcycles.map(m => m.kategori))];

  // Filter motorcycles by category
  const filteredMotorcycles =
    activeCategory === 'all'
      ? enhancedMotorcycles
      : enhancedMotorcycles.filter(m => m.kategori === activeCategory);

  // Format price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(price);
  };

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-background to-background/80 -z-10">
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_30%,rgba(var(--primary),0.05),transparent_50%)]"></div>
      </div>

      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
              {t('featuredMotorcycles')}
            </h2>
            <p className="text-muted-foreground max-w-2xl text-lg">{t('footerDescription')}</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-4 md:mt-0"
          >
            <Link href="/motorcycles">
              <Button
                variant="outline"
                className="border-primary/20 hover:border-primary hover:bg-primary/5 group"
              >
                {t('viewAll')}
                <ChevronRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Category filters */}
        <motion.div
          className="flex flex-wrap gap-2 mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {categories.map((category, _index) => (
            <Button
              key={category}
              variant={activeCategory === category ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveCategory(category)}
              className={`capitalize ${activeCategory === category ? 'bg-primary text-white' : 'border-primary/20 hover:border-primary hover:bg-primary/5'}`}
            >
              {category === 'all' ? t('allCategories') : category}
            </Button>
          ))}
        </motion.div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => (
              <Card key={i} className="bg-card/50 border-border overflow-hidden">
                <div className="h-48 bg-muted animate-pulse" />
                <CardContent className="p-5">
                  <div className="h-6 bg-muted rounded animate-pulse mb-2" />
                  <div className="h-4 bg-muted rounded animate-pulse w-3/4 mb-4" />
                  <div className="h-16 bg-muted rounded animate-pulse" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-10">
            <p className="text-red-500 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>{t('tryAgain')}</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredMotorcycles.map((motorcycle, index) => (
              <motion.div
                key={motorcycle.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <Link href={`/motorcycles/${motorcycle.id}`}>
                  <Card className="bg-card/50 border-border overflow-hidden hover:border-primary/50 transition-all hover:shadow-xl hover:shadow-primary/10 h-full">
                    <div className="relative h-48 overflow-hidden group">
                      <Image
                        src={motorcycle.gambar || '/placeholder.svg?height=400&width=600'}
                        alt={`${motorcycle.merk} ${motorcycle.model}`}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute top-2 left-2">
                        <Badge className="bg-primary text-white">{motorcycle.kategori}</Badge>
                      </div>
                      <div className="absolute top-2 right-2">
                        <Badge className="bg-black/70 text-white">{motorcycle.cc} CC</Badge>
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                        <Button
                          variant="default"
                          size="sm"
                          className="w-full bg-primary hover:bg-primary/90"
                        >
                          {t('viewDetails')}
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <CardContent className="p-5">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-xl font-bold line-clamp-1">
                          {motorcycle.merk} {motorcycle.model}
                        </h3>
                        <div className="flex items-center text-yellow-500">
                          <Star className="h-4 w-4 fill-yellow-500" />
                          <span className="text-sm ml-1 font-medium">
                            {motorcycle.rating?.toFixed(1)}
                          </span>
                        </div>
                      </div>

                      <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                        {`${motorcycle.cc}cc model with excellent performance. Perfect for exploring Kota Malang.`}
                      </p>

                      <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
                        <div className="flex items-center">
                          <Gauge className="h-4 w-4 mr-1" />
                          <span>{motorcycle.cc} CC</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          <span>
                            {motorcycle.unitMotor && motorcycle.unitMotor.length > 0
                              ? motorcycle.unitMotor[0].tahunPembuatan
                              : new Date().getFullYear()}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="px-5 py-4 border-t">
                      <div className="w-full flex items-center justify-between">
                        <div className="font-bold text-lg text-primary">
                          {formatPrice(
                            motorcycle.unitMotor && motorcycle.unitMotor.length > 0
                              ? motorcycle.unitMotor[0].hargaSewa
                              : motorcycle.harga || 150000
                          )}
                          <span className="text-xs font-normal text-muted-foreground">/day</span>
                        </div>
                        <Badge variant="outline" className="border-primary/30 text-primary">
                          {t('available')}
                        </Badge>
                      </div>
                    </CardFooter>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
