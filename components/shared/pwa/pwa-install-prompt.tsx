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

    // Deteksi iOS device dengan lebih akurat
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOSDevice(isIOS);

    // Deteksi perangkat Android
    const isAndroid = /Android/.test(navigator.userAgent);
    
    // Tangkap beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e as BeforeInstallPromptEvent);
      
      // Cek setting lokal - tampilkan prompt hanya jika belum ditolak
      const promptShown = localStorage.getItem('pwaPromptDismissed');
      if (!promptShown || Date.now() > parseInt(promptShown) + 3 * 24 * 60 * 60 * 1000) {
        // Jika prompt belum ditolak atau sudah lebih dari 3 hari
        setShowPrompt(true);
      }
    };

    // Untuk perangkat iOS, kita perlu selalu menampilkan panduan instalasi
    // karena iOS tidak mendukung event beforeinstallprompt
    if (isIOS) {
      const promptShown = localStorage.getItem('pwaPromptIOSDismissed');
      if (!promptShown || Date.now() > parseInt(promptShown) + 3 * 24 * 60 * 60 * 1000) {
        setTimeout(() => {
          setShowPrompt(true);
        }, 3000); // Tunda prompt 3 detik agar pengguna dapat melihat konten terlebih dahulu
      }
    }

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
        if (isIOSDevice) {
          localStorage.setItem('pwaPromptIOSDismissed', Date.now().toString());
        } else {
          localStorage.setItem('pwaPromptDismissed', Date.now().toString());
        }
      }
    } catch (error) {
      console.error('Error saat instalasi PWA:', error);
    }
    
    setInstallPrompt(null);
  };

  // Handle dismissal
  const handleDismiss = () => {
    setShowPrompt(false);
    if (isIOSDevice) {
      localStorage.setItem('pwaPromptIOSDismissed', Date.now().toString());
    } else {
      localStorage.setItem('pwaPromptDismissed', Date.now().toString());
    }
  };

  if (isInstalled || !showPrompt) {
    return null;
  }

  return (
    <div className="fixed bottom-4 md:bottom-8 right-4 md:right-8 z-50 max-w-sm animate-slide-up">
      <Card className="relative overflow-hidden backdrop-blur-xl bg-background/95 shadow-2xl border border-primary/20 rounded-xl">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent pointer-events-none" />
        <CardHeader className="pb-2 relative">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg font-semibold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              {t('installApp') || 'Instal Aplikasi'}
            </CardTitle>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 rounded-full hover:bg-primary/10 transition-colors"
              onClick={handleDismiss}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">{t('close') || 'Tutup'}</span>
            </Button>
          </div>
          <CardDescription className="text-foreground/80">
            {t('installAppDesc') || 'Instal Rosantibike di perangkat Anda untuk akses lebih cepat'}
          </CardDescription>
        </CardHeader>
        <CardContent className="text-sm">
          {isIOSDevice ? (
            <div className="space-y-3">
              <p className="font-medium text-foreground/90">{t('installIOSInstructions') || 'Untuk menginstal di iOS:'}</p>
              <ol className="list-decimal pl-5 space-y-2.5">
                <li className="flex items-center gap-2 text-foreground/80">
                  {t('tapShareButton') || 'Ketuk tombol Share'}
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary/10">
                    📤
                  </span>
                </li>
                <li className="flex items-center gap-2 text-foreground/80">
                  {t('scrollAndTapAddToHome') || 'Scroll dan ketuk "Add to Home Screen"'}
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary/10">
                    ➕
                  </span>
                </li>
                <li className="text-foreground/80">{t('tapAdd') || 'Ketuk "Add"'}</li>
              </ol>
              <div className="mt-4 rounded-lg bg-primary/5 border border-primary/20 p-3">
                <p className="font-medium text-foreground flex items-center gap-2">
                  <span className="text-lg">✨</span>
                  {t('iosInstallBenefits') || 'Manfaat: Akses lebih cepat dan pengalaman seperti aplikasi native'}
                </p>
              </div>
            </div>
          ) : (
            <div className="py-2">
              <p className="text-foreground/80">
                {t('installBenefits') || 'Nikmati pengalaman lebih cepat, fitur offline, dan tanpa browser frame.'}
              </p>
            </div>
          )}
        </CardContent>
        <CardFooter className={cn("relative", !isIOSDevice && "pt-2")}>
          {!isIOSDevice && (
            <Button 
              onClick={handleInstall}
              className="w-full bg-install-gradient hover:opacity-90 text-primary-foreground font-medium group transition-all duration-300 shadow-lg shadow-primary/20"
            >
              <Download className="mr-2 h-4 w-4 group-hover:animate-pulse-subtle transition-transform group-hover:scale-110 duration-300" />
              {t('installNow') || 'Instal Sekarang'}
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default PWAInstallPrompt;
