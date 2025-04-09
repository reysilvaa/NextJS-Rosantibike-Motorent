import MotorcyclesPageContent from "@/components/motorcycles/motorcycles-page-content"
import PageSeo from "@/components/shared/seo/page-seo"

export default function MotorcyclesPage() {
  return (
    <>
      <PageSeo 
        title="Koleksi Motor | Rosantibike Motorent"
        description="Jelajahi koleksi motor premium kami yang tersedia untuk disewa. Berbagai pilihan motor untuk kebutuhan Anda di Malang."
        canonicalPath="/motorcycles"
        ogImage="/images/motorcycles-og.jpg"
      />
      <MotorcyclesPageContent />
    </>
  )
}

