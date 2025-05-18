'use client';

import { motion, useInView } from 'framer-motion';
import { ArrowRight, Mail, MapPin, Phone, Send } from 'lucide-react';
import type React from 'react';
import { useRef, useState } from 'react';

import GoogleMapComponent from '@/components/features/map/google-map';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useAppTranslations } from '@/i18n/hooks';

export default function ContactSection() {
  const { t  } = useAppTranslations();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'form' | 'map'>('form');

  const formRef = useRef(null);
  const _isFormInView = useInView(formRef, { once: true });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSubmitSuccess(true);
      setFormData({ name: '', email: '', phone: '', message: '' });
    } catch (error) {
      setSubmitError(t('messageSendFailed'));
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: <Phone className="h-5 w-5 text-primary" />,
      title: t('phone'),
      details: t('phoneNumber'),
    },
    {
      icon: <Mail className="h-5 w-5 text-primary" />,
      title: t('email'),
      details: t('emailAddress'),
    },
    {
      icon: <MapPin className="h-5 w-5 text-primary" />,
      title: t('address'),
      details: t('addressDetails'),
    },
  ];

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background/80 -z-10">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_20%,rgba(var(--primary),0.1),transparent_40%)]"></div>
        <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_80%,rgba(var(--primary),0.05),transparent_40%)]"></div>
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
            {t('contactUs')}
          </motion.h2>
          <motion.p
            className="text-foreground/75 text-lg"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {t('contactDescription')}
          </motion.p>
        </div>

        <div className="max-w-6xl mx-auto">
          {/* Mobile tab switcher */}
          <div className="md:hidden flex rounded-lg overflow-hidden mb-6 border">
            <button
              className={`flex-1 py-3 px-4 text-center font-medium ${activeTab === 'form' ? 'bg-primary text-white' : 'bg-card'}`}
              onClick={() => setActiveTab('form')}
            >
              {t('contactFormTitle')}
            </button>
            <button
              className={`flex-1 py-3 px-4 text-center font-medium ${activeTab === 'map' ? 'bg-primary text-white' : 'bg-card'}`}
              onClick={() => setActiveTab('map')}
            >
              {t('ourLocation')}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            {/* Contact form */}
            <motion.div
              className={`${activeTab === 'map' ? 'hidden md:block' : ''}`}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              ref={formRef}
            >
              <Card className="overflow-hidden border-primary/10 shadow-lg shadow-primary/5">
                <div className="bg-primary/5 p-6 border-b border-primary/10">
                  <h3 className="text-2xl font-semibold text-foreground">
                    {t('contactFormTitle')}
                  </h3>
                  <p className="text-muted-foreground mt-1">{t('contactDescription')}</p>
                </div>

                <CardContent className="p-6">
                  {submitSuccess ? (
                    <motion.div
                      className="bg-success/20 border border-success/30 rounded-lg p-6 text-center"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-success/20 mb-4">
                        <svg
                          className="w-8 h-8 text-success"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                      <h4 className="font-semibold text-success text-xl mb-2">
                        {t('messageSentSuccess')}
                      </h4>
                      <p className="text-foreground/80 mb-4">{t('messageSentSuccessDesc')}</p>
                      <Button
                        className="mt-2"
                        variant="outline"
                        onClick={() => setSubmitSuccess(false)}
                      >
                        {t('sendAnotherMessage')}
                      </Button>
                    </motion.div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-5">
                      <div className="space-y-2">
                        <label
                          htmlFor="name"
                          className="block text-sm font-medium text-foreground/80"
                        >
                          {t('fullName')}
                        </label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="bg-background/50 border-input focus:border-primary/50 transition-colors"
                          placeholder={t('fullNamePlaceholder') || 'Your full name'}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-2">
                          <label
                            htmlFor="email"
                            className="block text-sm font-medium text-foreground/80"
                          >
                            {t('email')}
                          </label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="bg-background/50 border-input focus:border-primary/50 transition-colors"
                            placeholder={t('emailPlaceholder') || 'Your email address'}
                          />
                        </div>

                        <div className="space-y-2">
                          <label
                            htmlFor="phone"
                            className="block text-sm font-medium text-foreground/80"
                          >
                            {t('phone')}
                          </label>
                          <Input
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="bg-background/50 border-input focus:border-primary/50 transition-colors"
                            placeholder={t('phonePlaceholder') || 'Your phone number'}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label
                          htmlFor="message"
                          className="block text-sm font-medium text-foreground/80"
                        >
                          {t('message')}
                        </label>
                        <Textarea
                          id="message"
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          required
                          rows={5}
                          className="bg-background/50 border-input focus:border-primary/50 transition-colors resize-none"
                          placeholder={t('messagePlaceholder') || 'Your message'}
                        />
                      </div>

                      {submitError && (
                        <motion.div
                          className="bg-destructive/10 border border-destructive/30 rounded-lg p-4 text-destructive text-sm"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          transition={{ duration: 0.3 }}
                        >
                          {submitError}
                        </motion.div>
                      )}

                      <motion.div
                        className="pt-2"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button
                          type="submit"
                          className="w-full bg-primary hover:bg-primary/90 transition-colors text-white"
                          disabled={isSubmitting}
                          size="lg"
                        >
                          {isSubmitting ? (
                            <span className="flex items-center">
                              <svg
                                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                              >
                                <circle
                                  className="opacity-25"
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  strokeWidth="4"
                                ></circle>
                                <path
                                  className="opacity-75"
                                  fill="currentColor"
                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                              </svg>
                              {t('sending')}
                            </span>
                          ) : (
                            <span className="flex items-center">
                              <Send className="mr-2 h-5 w-5" />
                              {t('sendMessage')}
                            </span>
                          )}
                        </Button>
                      </motion.div>
                    </form>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Map and contact info */}
            <motion.div
              className={`${activeTab === 'form' ? 'hidden md:block' : ''}`}
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Card className="overflow-hidden border-primary/10 shadow-lg shadow-primary/5 h-full">
                <div className="h-[300px] relative">
                  <GoogleMapComponent />
                  <div className="absolute inset-0 pointer-events-none border-b border-border"></div>
                </div>

                <CardContent className="p-6">
                  <h3 className="text-2xl font-semibold mb-6 text-foreground">
                    {t('ourLocation')}
                  </h3>

                  <div className="space-y-6">
                    {contactInfo.map((item, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="flex items-start gap-4 group"
                      >
                        <div className="bg-primary/10 rounded-full p-3 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                          {item.icon}
                        </div>
                        <div>
                          <h4 className="font-medium text-lg mb-1 text-foreground">{item.title}</h4>
                          <p className="text-foreground/70">{item.details}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  <div className="mt-8 pt-6 border-t border-border">
                    <Button
                      variant="outline"
                      className="w-full group border-primary/20 hover:border-primary hover:bg-primary/5"
                    >
                      <span className="mr-2">{t('getDirections')}</span>
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
