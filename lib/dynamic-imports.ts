import dynamic from 'next/dynamic';

// Dynamic imports untuk komponen UI yang berat
export const LazyVideoPlayer = dynamic(
  () => import('@/components/shared/video-player'),
  { ssr: false, loading: () => <div className="w-full h-48 bg-gray-200 animate-pulse rounded-md" /> }
);

// Dynamic imports untuk komponen yang hanya digunakan di bawah fold
export const LazyCarousel = dynamic(
  () => import('@/components/ui/carousel').then((mod) => mod.Carousel),
  { ssr: true, loading: () => <div className="w-full h-40 bg-gray-200 animate-pulse rounded-md" /> }
);

// Dynamic import untuk komponen chart yang berat
export const LazyChart = dynamic(
  () => import('@/components/ui/chart').then((mod) => mod.Chart),
  { ssr: false, loading: () => <div className="w-full h-64 bg-gray-200 animate-pulse rounded-md" /> }
);

// Dynamic import untuk komponen yang menggunakan librari pihak ketiga berat
export const LazyDateRangePicker = dynamic(
  () => import('@/components/ui/date-range-picker').then((mod) => mod.DateRangePicker),
  { ssr: true }
); 