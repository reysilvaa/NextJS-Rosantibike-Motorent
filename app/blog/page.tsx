import BlogPageContent from "@/components/blog/blog-page-content"
import PageSeo from "@/components/shared/seo/page-seo"

export default function BlogPage() {
  return (
    <>
      <PageSeo
        title="Blog"
        description="Baca artikel terbaru tentang tips berkendara, panduan wisata, dan informasi menarik seputar dunia motor di Malang."
        canonicalPath="/blog"
        ogImage="/images/blog-og.jpg"
      />
      <BlogPageContent />
    </>
  )
}

