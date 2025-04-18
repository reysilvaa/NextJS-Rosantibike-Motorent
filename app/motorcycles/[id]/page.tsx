'use client';

import { notFound } from 'next/navigation';
import { useEffect, useState } from 'react';

import MotorcycleDetail from '@/components/motorcycles/motorcycle-detail';

interface MotorcycleDetailPageProps {
  params: {
    id: string;
  };
}

export default function MotorcycleDetailPage({ params }: MotorcycleDetailPageProps) {
  const [id, setId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Mengambil id dari params
    if (params && params.id) {
      setId(params.id);
      setIsLoading(false);
    } else {
      notFound();
    }
  }, [params]);

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

  if (!id) {
    return null; // Akan di-handle oleh notFound
  }

  return (
    <div className="py-20">
      <div className="container mx-auto px-4">
        <MotorcycleDetail id={id} />
      </div>
    </div>
  );
}
