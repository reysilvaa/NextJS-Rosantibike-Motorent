import { Viewport } from 'next';

export interface ViewportConfig {
  width?: string;
  initialScale?: number;
  maximumScale?: number;
  userScalable?: boolean;
  viewportFit?: 'auto' | 'contain' | 'cover';
  themeColor?:
    | string
    | Array<{
        media: string;
        color: string;
      }>;
  colorScheme?: 'normal' | 'light' | 'dark' | 'light dark' | 'dark light';
}

export const defaultViewportConfig: ViewportConfig = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
};

export const generateViewport = (config: Partial<ViewportConfig> = {}): Viewport => {
  const mergedConfig = { ...defaultViewportConfig, ...config };

  return {
    width: mergedConfig.width,
    initialScale: mergedConfig.initialScale,
    maximumScale: mergedConfig.maximumScale,
    userScalable: mergedConfig.userScalable,
    viewportFit: mergedConfig.viewportFit,
    themeColor: mergedConfig.themeColor,
    colorScheme: mergedConfig.colorScheme,
  };
};
