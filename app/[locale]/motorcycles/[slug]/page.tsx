'use client';

import { notFound } from 'next/navigation';
import { use, useEffect, useState } from 'react';

import MotorcycleDetail from '@/components/motorcycles/motorcycle-detail';

interface MotorcycleDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default function MotorcycleDetailPage({ params }: MotorcycleDetailPageProps) {
  // Menggunakan React.use() untuk mengakses params
  const { slug } = use(params);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      setIsLoading(false);
    } else {
      notFound();
    }
  }, [slug]);

  if (isLoading) {
    return (
      <div className="py-20">
        <div className="container mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-64 bg-gray-200 rounded mb-4"></div>
            <div className="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="h-32 bg-gray-200 rounded mb-4"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-20">
      <div className="container mx-auto px-4">
        <MotorcycleDetail slug={slug} />
      </div>
    </div>
  );
}
