'use client';

import { motion } from 'framer-motion';
import { Clock, Mail, MapPin, Phone } from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';
import { useAppTranslations } from '@/i18n/hooks';

export default function ContactInfo() {
  const { t  } = useAppTranslations();

  const contactInfo = [
    {
      icon: <Phone className="h-10 w-10 text-primary" />,
      title: t('phone'),
      details: ['+1 (234) 567-8900', '+1 (234) 567-8901'],
    },
    {
      icon: <Mail className="h-10 w-10 text-primary" />,
      title: t('email'),
      details: ['info@motocruise.com', 'support@motocruise.com'],
    },
    {
      icon: <MapPin className="h-10 w-10 text-primary" />,
      title: t('address'),
      details: [
        t('addressDetails').split(',')[0],
        t('addressDetails').split(',')[1],
        'United States',
      ],
    },
    {
      icon: <Clock className="h-10 w-10 text-primary" />,
      title: t('businessHours'),
      details: [t('monFriHours'), t('satHours'), t('sunClosed')],
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="bg-card/50 border-border">
        <CardContent className="p-6">
          <h2 className="text-2xl font-semibold mb-6">{t('contactInfo')}</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {contactInfo.map((item, index) => (
              <div key={index} className="flex gap-4">
                <div className="flex-shrink-0 mt-1">{item.icon}</div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                  <ul className="space-y-1 text-muted-foreground">
                    {item.details.map((detail, i) => (
                      <li key={i}>{detail}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
