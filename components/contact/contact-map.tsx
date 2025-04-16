'use client';

import { motion } from 'framer-motion';

import GoogleMapComponent from '@/components/features/map/google-map';
import { Card } from '@/components/ui/card';
import { useTranslation } from '@/i18n/hooks';

export default function ContactMap() {
  const { t } = useTranslation();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card className="bg-card/50 border-border overflow-hidden">
        <div className="h-[400px]" aria-label={t('ourLocation')}>
          <GoogleMapComponent />
        </div>
      </Card>
    </motion.div>
  );
}
