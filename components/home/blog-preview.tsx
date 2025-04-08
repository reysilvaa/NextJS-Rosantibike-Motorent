"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { ChevronRight, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { fetchBlogPosts } from "@/lib/network/api"
import type { BlogPost } from "@/lib/types"
import { useTranslation } from "@/i18n/hooks"

export default function BlogPreview() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { t } = useTranslation()

  useEffect(() => {
    const getBlogPosts = async () => {
      try {
        setIsLoading(true)
        const response = await fetchBlogPosts(1, 10)
        
        // Ambil data dari respons
        const blogData = response.data || []
        
        // Pastikan kita mempunyai array
        if (Array.isArray(blogData)) {
          setPosts(blogData.slice(0, 3)) // Ambil 3 post pertama
        } else {
          // Jika data bukan array, tampilkan pesan error
          setError(t("invalidDataFormat"))
          console.error("Format data blog tidak valid:", blogData)
        }
        
        setIsLoading(false)
      } catch (err) {
        setError(t("loadingFailed"))
        setIsLoading(false)
        console.error("Error saat memuat blog posts:", err)
      }
    }

    getBlogPosts()
  }, [t])

  // Placeholder data for when API fails or during development
  const placeholderPosts = [
    {
      id: "1",
      judul: "Top 5 Motorcycle Routes in California",
      slug: "top-5-motorcycle-routes-california",
      konten: "Discover the most scenic and thrilling motorcycle routes that California has to offer...",
      featuredImage: "/placeholder.svg?height=400&width=600",
      kategori: "Travel",
      createdAt: "2023-05-15T10:30:00Z",
    },
    {
      id: "2",
      judul: "Motorcycle Maintenance Tips for Beginners",
      slug: "motorcycle-maintenance-tips-beginners",
      konten: "Essential maintenance tips every motorcycle rider should know to keep their bike in top condition...",
      featuredImage: "/placeholder.svg?height=400&width=600",
      kategori: "Maintenance",
      createdAt: "2023-06-02T14:45:00Z",
    },
    {
      id: "3",
      judul: "Choosing the Right Motorcycle Gear",
      slug: "choosing-right-motorcycle-gear",
      konten: "A comprehensive guide to selecting the perfect gear for safety and comfort on your rides...",
      featuredImage: "/placeholder.svg?height=400&width=600",
      kategori: "Gear",
      createdAt: "2023-06-20T09:15:00Z",
    },
  ]

  const displayPosts = posts.length > 0 ? posts : placeholderPosts

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{t("latestBlogTitle")}</h2>
            <p className="text-muted-foreground max-w-2xl">
              {t("latestBlogDescription")}
            </p>
          </div>
          <Link href="/blog" className="mt-4 md:mt-0">
            <Button variant="link" className="text-primary">
              {t("viewAllArticles")}
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="bg-card/50 border-border overflow-hidden">
                <div className="h-48 bg-muted animate-pulse" />
                <CardContent className="p-5">
                  <div className="h-6 bg-muted rounded animate-pulse mb-2" />
                  <div className="h-4 bg-muted rounded animate-pulse w-3/4 mb-4" />
                  <div className="h-16 bg-muted rounded animate-pulse" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-10">
            <p className="text-red-500 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>{t("tryAgain")}</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {displayPosts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link href={`/blog/${post.slug}`}>
                  <Card className="bg-card/50 border-border overflow-hidden hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/10 h-full">
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={post.featuredImage || "/placeholder.svg?height=400&width=600"}
                        alt={post.judul}
                        fill
                        className="object-cover transition-transform hover:scale-105"
                      />
                      <Badge className="absolute top-2 right-2 bg-primary">{post.kategori}</Badge>
                    </div>
                    <CardContent className="p-5">
                      <div className="flex items-center text-muted-foreground text-sm mb-3">
                        <Calendar className="h-4 w-4 mr-1" />
                        {formatDate(post.createdAt)}
                      </div>
                      <h3 className="text-xl font-bold mb-2">{post.judul}</h3>
                      <p className="text-foreground/80 line-clamp-3">{post.konten}</p>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

