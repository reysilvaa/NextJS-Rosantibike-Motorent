import { Metadata } from "next"
import { generateMetadata as baseSeoMetadata } from '@/lib/seo/config'
import { generateKeywords } from '@/lib/seo/keywords'

interface MotorcycleDetailPageProps {
  params: {
    id: string
  }
}

export async function generateMetadata({ params }: MotorcycleDetailPageProps): Promise<Metadata> {
  try {
    // You can fetch motorcycle data here to generate dynamic metadata
    // For now, using a simpler approach with the ID
    return baseSeoMetadata({
      title: `Motorcycle Details - Rosanti Bike Rental`,
      description: `Detailed information about our premium motorcycle. Check specifications, features, and book this motorcycle for your next adventure.`,
      keywords: generateKeywords('motorcycle-detail', { 
        title: `Motorcycle Details - Rosanti Bike Rental`,
        additionalKeywords: [params.id]
      }),
      openGraph: {
        url: `https://rosantibike.com/motorcycles/${params.id}`,
        images: ['/images/motorcycle-detail-og.jpg'],
        type: 'article',
      },
      robots: {
        index: true,
        follow: true,
      },
    })
  } catch (error) {
    return baseSeoMetadata({
      title: 'Motorcycle - Rosanti Bike Rental',
      description: 'Explore our premium motorcycle collection',
      keywords: generateKeywords('motorcycle-detail'),
      robots: {
        index: true,
        follow: true,
      },
    })
  }
}

export default function MotorcycleDetailLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children;
} 