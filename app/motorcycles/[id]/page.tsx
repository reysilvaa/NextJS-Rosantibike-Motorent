import { notFound } from "next/navigation"
import MotorcycleDetail from "@/components/motorcycles/motorcycle-detail"
import PageSeo from "@/components/shared/seo/page-seo"
import { fetchMotorcycleTypeById } from "@/lib/network/api"

interface MotorcycleDetailPageProps {
  params: {
    id: string
  }
}

export default async function MotorcycleDetailPage({ params }: MotorcycleDetailPageProps) {
  const { id } = params;

  if (!id) {
    notFound();
  }
  
  // Fetch motorcycle data for SEO
  let title = "Detail Motor | Rosantibike Motorent";
  let description = "Lihat detail motor dan ketersediaan untuk rental motor di Malang";
  let ogImage = "/images/motorcycle-default-og.jpg";
  
  try {
    const motorcycle = await fetchMotorcycleTypeById(id);
    
    if (motorcycle) {
      title = `${motorcycle.merk} ${motorcycle.model} | Rosantibike Motorent`;
      description = `Sewa ${motorcycle.merk} ${motorcycle.model} ${motorcycle.cc}cc di Malang dengan harga terjangkau.`;
      ogImage = motorcycle.gambar || "/images/motorcycle-default-og.jpg";
    }
  } catch (error) {
    console.error('Error fetching motorcycle data for SEO:', error);
  }

  return (
    <div className="py-20">
      <PageSeo
        title={title}
        description={description}
        canonicalPath={`/motorcycles/${id}`}
        ogImage={ogImage}
      />
      
      <div className="container mx-auto px-4">
        <MotorcycleDetail id={id} />
      </div>
    </div>
  )
} 