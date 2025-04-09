import { Metadata } from 'next'
import BlogPageContent from "@/components/blog/blog-page-content"
import { getSeoMetadata } from "@/lib/shared/seo"

export const metadata: Metadata = getSeoMetadata({
  title: "Blog",
  description: "Baca artikel terbaru tentang tips berkendara, panduan wisata, dan informasi menarik seputar dunia motor di Malang.",
  canonicalPath: "/blog",
  ogImage: "/images/blog-og.jpg",
})

export default function BlogPage() {
  return <BlogPageContent />
}

