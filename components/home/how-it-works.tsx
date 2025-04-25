
'use client';

import { motion } from 'framer-motion';
import { Calendar, BikeIcon as Motorcycle, CreditCard, CheckCircle } from 'lucide-react';
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
      {/* Enhanced Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background to-background/90 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(var(--primary),0.05),transparent_70%)]">
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
          />
        </div>
      </div>

      <div className="container mx-auto px-4">
        {/* Header Section with Enhanced Animations */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2
            className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            {t('howItWorks')}
          </motion.h2>
          <motion.p
            className="text-muted-foreground text-lg"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
          >
            {t('howItWorksDescription')}
          </motion.p>
        </div>

        {/* Timeline Section with Enhanced Animations */}
        <div className="relative">
          {/* Animated Timeline Connector for Desktop */}
          <motion.div
            className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary/20 via-primary/40 to-primary/20 transform -translate-x-1/2"
            initial={{ height: 0 }}
            whileInView={{ height: "100%" }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: "easeInOut" }}
          />

          {/* Mobile Timeline Connector */}
          <motion.div
            className="lg:hidden absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary/20 via-primary/40 to-primary/20 transform -translate-x-1/2"
            initial={{ height: 0 }}
            whileInView={{ height: "100%" }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: "easeInOut" }}
          />

          <div className="space-y-12 lg:space-y-24 relative">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: step.delay }}
                className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center`}
              >
                {/* Animated Timeline Dot */}
                <motion.div
                  className="absolute left-1/2 transform -translate-x-1/2 flex items-center justify-center"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: step.delay + 0.3 }}
                >
                  <div className="w-6 h-6 rounded-full bg-primary border-4 border-background z-10" />
                  <motion.div
                    className="absolute w-12 h-12 rounded-full border-4 border-primary/20"
                    animate={{ scale: [1, 1.5, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </motion.div>

                {/* Icon with Enhanced Animation */}
                <motion.div
                  className="flex-shrink-0 mb-6 lg:mb-0 z-10"
                  whileHover={{ scale: 1.05, rotate: 5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <motion.div
                    className={`w-24 h-24 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-lg`}
                    initial={{ rotate: -10, scale: 0.9 }}
                    whileInView={{ rotate: 0, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.6,
                      delay: step.delay,
                      type: "spring",
                      stiffness: 200
                    }}
                  >
                    <motion.div
                      animate={{ y: [0, -5, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      {step.icon}
                    </motion.div>
                  </motion.div>
                </motion.div>

                {/* Content with Enhanced Animation */}
                <motion.div
                  className={`text-center ${
                    index % 2 === 0
                      ? 'lg:text-right lg:mr-auto lg:ml-8 lg:pl-0 lg:pr-8 lg:w-[calc(50%-3rem)]'
                      : 'lg:text-left lg:ml-auto lg:mr-8 lg:pr-0 lg:pl-8 lg:w-[calc(50%-3rem)]'
                  }`}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: step.delay + 0.2 }}
                >
                  <motion.h3 
                    className="text-2xl font-bold mb-3"
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: step.delay + 0.3 }}
                  >
                    {step.title}
                  </motion.h3>
                  <motion.p 
                    className="text-muted-foreground"
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: step.delay + 0.4 }}
                  >
                    {step.description}
                  </motion.p>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
