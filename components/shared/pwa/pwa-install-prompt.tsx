'use client';

import { Download, X } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from '@/i18n/hooks';
import { cn } from '@/lib/utils/utils';

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
};

const PWAInstallPrompt = () => {
  const { t } = useTranslation();
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOSDevice, setIsIOSDevice] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Cek apakah aplikasi sudah diinstal sebagai PWA
    if (window.matchMedia('(display-mode: standalone)').matches || 
        (window.navigator as any).standalone === true) {
      setIsInstalled(true);
      return;
    }

    // Deteksi iOS device
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOSDevice(isIOS);

    // Tangkap beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e as BeforeInstallPromptEvent);
      
      // Cek setting lokal - tampilkan prompt hanya jika belum ditolak
      const promptShown = localStorage.getItem('pwaPromptDismissed');
      if (!promptShown || Date.now() > parseInt(promptShown) + 7 * 24 * 60 * 60 * 1000) {
        // Jika prompt belum ditolak atau sudah lebih dari 7 hari
        setShowPrompt(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    
    // Cek jika service worker aktif dan teregistrasi
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then(() => {
        console.log('Service Worker siap untuk PWA');
      });
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  // Handle aksi install
  const handleInstall = async () => {
    if (!installPrompt) return;

    try {
      await installPrompt.prompt();
      const choiceResult = await installPrompt.userChoice;
      
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the install prompt');
        setShowPrompt(false);
        setIsInstalled(true);
      } else {
        console.log('User dismissed the install prompt');
        // Simpan pembatalan di localStorage
        localStorage.setItem('pwaPromptDismissed', Date.now().toString());
      }
    } catch (error) {
      console.error('Error saat instalasi PWA:', error);
    }
    
    setInstallPrompt(null);
  };

  // Handle dismissal
  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('pwaPromptDismissed', Date.now().toString());
  };

  if (isInstalled || !showPrompt) {
    return null;
  }

  return (
    <div className="fixed bottom-4 md:bottom-8 right-4 md:right-8 z-50 max-w-sm animate-in fade-in duration-500">
      <Card className="gradient-card shadow-xl border-primary/20 backdrop-blur-md">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg text-gradient">{t('installApp') || 'Instal Aplikasi'}</CardTitle>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 rounded-full hover:bg-primary/10"
              onClick={handleDismiss}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">{t('close') || 'Tutup'}</span>
            </Button>
          </div>
          <CardDescription>
            {t('installAppDesc') || 'Instal Rosantibike di perangkat Anda untuk akses lebih cepat'}
          </CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          {isIOSDevice ? (
            <div className="space-y-2">
              <p>{t('installIOSInstructions') || 'Untuk menginstal di iOS:'}</p>
              <ol className="list-decimal pl-5 space-y-1">
                <li>{t('tapShareButton') || 'Ketuk tombol Share'}</li>
                <li>{t('scrollAndTapAddToHome') || 'Scroll dan ketuk "Add to Home Screen"'}</li>
                <li>{t('tapAdd') || 'Ketuk "Add"'}</li>
              </ol>
            </div>
          ) : (
            <p>
              {t('installBenefits') || 'Nikmati pengalaman lebih cepat, fitur offline, dan tanpa browser frame.'}
            </p>
          )}
        </CardContent>
        <CardFooter className={cn(!isIOSDevice && "pt-2")}>
          {!isIOSDevice && (
            <Button 
              onClick={handleInstall}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium group transition-all"
            >
              <Download className="mr-2 h-4 w-4 group-hover:animate-pulse" />
              {t('installNow') || 'Instal Sekarang'}
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default PWAInstallPrompt; 