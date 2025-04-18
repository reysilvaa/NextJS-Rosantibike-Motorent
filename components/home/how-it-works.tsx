'use client';

import { motion } from 'framer-motion';
import { BikeIcon as Motorcycle, Calendar, CheckCircle, CreditCard } from 'lucide-react';

import { useTranslation } from '@/i18n/hooks';

export default function HowItWorks() {
  const { t } = useTranslation();

  const steps = [
    {
      icon: <Calendar className="h-12 w-12 text-white" />,
      title: t('howItWorksStep1Title'),
      description: t('howItWorksStep1Desc'),
      color: 'from-blue-500 to-blue-600',
      delay: 0,
    },
    {
      icon: <Motorcycle className="h-12 w-12 text-white" />,
      title: t('howItWorksStep2Title'),
      description: t('howItWorksStep2Desc'),
      color: 'from-purple-500 to-purple-600',
      delay: 0.1,
    },
    {
      icon: <CreditCard className="h-12 w-12 text-white" />,
      title: t('howItWorksStep3Title'),
      description: t('howItWorksStep3Desc'),
      color: 'from-pink-500 to-pink-600',
      delay: 0.2,
    },
    {
      icon: <CheckCircle className="h-12 w-12 text-white" />,
      title: t('howItWorksStep4Title'),
      description: t('howItWorksStep4Desc'),
      color: 'from-green-500 to-green-600',
      delay: 0.3,
    },
  ];

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-background to-background/90 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(var(--primary),0.05),transparent_70%)]"></div>
      </div>

      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2
            className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            {t('howItWorks')}
          </motion.h2>
          <motion.p
            className="text-muted-foreground text-lg"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {t('howItWorksDescription')}
          </motion.p>
        </div>

        <div className="relative">
          {/* Timeline connector for desktop */}
          <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-primary/20 via-primary/40 to-primary/20 transform -translate-x-1/2 rounded-full"></div>

          <div className="space-y-12 lg:space-y-24 relative">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: step.delay }}
                className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center`}
              >
                {/* Timeline dot for desktop */}
                <div className="hidden lg:block absolute left-1/2 transform -translate-x-1/2 w-6 h-6 rounded-full bg-primary border-4 border-background z-10"></div>

                {/* Icon */}
                <div className="flex-shrink-0 mb-6 lg:mb-0 z-10">
                  <motion.div
                    className={`w-24 h-24 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-lg`}
                    whileHover={{ scale: 1.05, rotate: 5 }}
                    transition={{ type: 'spring', stiffness: 400 }}
                  >
                    {step.icon}
                  </motion.div>
                </div>

                {/* Content */}
                <div
                  className={`text-center ${
                    index % 2 === 0
                      ? 'lg:text-right lg:mr-auto lg:ml-8 lg:pl-0 lg:pr-8 lg:w-[calc(50%-3rem)]'
                      : 'lg:text-left lg:ml-auto lg:mr-8 lg:pr-0 lg:pl-8 lg:w-[calc(50%-3rem)]'
                  }`}
                >
                  <h3 className="text-2xl font-bold mb-3">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
