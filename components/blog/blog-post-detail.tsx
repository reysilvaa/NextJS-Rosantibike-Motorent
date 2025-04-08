"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Calendar, Tag, User } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { fetchBlogPostBySlug } from "@/lib/network/api"
import type { BlogPost } from "@/lib/types/types"
import { useTranslation } from "@/i18n/hooks"
import { formatDate } from "@/lib/utils/utils"

interface BlogPostDetailProps {
  slug?: string;
  post?: BlogPost;
}

export default function BlogPostDetail({ slug, post: initialPost }: BlogPostDetailProps) {
  const { t, i18n } = useTranslation()
  const [blogPost, setBlogPost] = useState<BlogPost | null>(initialPost || null)
  const [isLoading, setIsLoading] = useState(!initialPost)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Jika post sudah disediakan, tidak perlu mengambil dari API
    if (initialPost) {
      setBlogPost(initialPost)
      setIsLoading(false)
      return
    }

    const fetchBlogPostDetail = async () => {
      try {
        setIsLoading(true)
        
        // Jika tidak ada slug, tampilkan error
        if (!slug) {
          setError(t("blogPostNotFound"))
          setIsLoading(false)
          return
        }
        
        const data = await fetchBlogPostBySlug(slug)
        if (data) {
          setBlogPost(data)
          setError(null)
        } else {
          setError(t("blogPostNotFound"))
        }
      } catch (err: any) {
        console.error("Error fetching blog post:", err)
        setError(err.message || t("failedToLoadBlogPost"))
      } finally {
        setIsLoading(false)
      }
    }

    fetchBlogPostDetail()
  }, [slug, initialPost, t])

  if (isLoading) {
    return (
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto space-y-6 animate-pulse">
          <div className="flex items-center mb-6">
            <Skeleton className="h-4 w-24 mr-2 rounded-md" />
            <Skeleton className="h-4 w-16 rounded-md" />
          </div>
          <Skeleton className="h-10 w-4/5 mb-4 rounded-md" />
          <div className="flex items-center space-x-4 mb-6">
            <Skeleton className="h-4 w-24 rounded-md" />
            <Skeleton className="h-4 w-36 rounded-md" />
            <Skeleton className="h-4 w-20 rounded-md" />
          </div>
          <Skeleton className="h-[300px] w-full rounded-lg mb-6" />
          <div className="space-y-4">
            <Skeleton className="h-4 w-full rounded-md" />
            <Skeleton className="h-4 w-full rounded-md" />
            <Skeleton className="h-4 w-3/4 rounded-md" />
            <Skeleton className="h-4 w-5/6 rounded-md" />
            <Skeleton className="h-4 w-full rounded-md" />
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto flex flex-col items-center justify-center py-16 px-4">
          <div className="w-16 h-16 bg-destructive/20 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-destructive" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-xl font-bold mb-2 text-center">Artikel Tidak Ditemukan</h2>
          <p className="text-muted-foreground mb-6 text-center max-w-md">{error}</p>
          <div className="flex gap-3">
            <Button 
              onClick={() => window.location.reload()} 
              variant="outline" 
              className="border-border hover:bg-accent"
            >
              {t("tryAgain")}
            </Button>
            <Link href="/blog">
              <Button>{t("backToBlog")}</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (!blogPost) {
    return (
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto flex flex-col items-center justify-center py-16 px-4">
          <div className="w-16 h-16 bg-warning/20 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold mb-2">{t("blogPostNotFound")}</h2>
          <p className="text-muted-foreground mb-6 text-center max-w-md">Maaf, artikel yang Anda cari tidak ditemukan atau telah dihapus.</p>
          <Link href="/blog">
            <Button>{t("backToBlog")}</Button>
          </Link>
        </div>
      </div>
    )
  }

  // Placeholder untuk konten demo
  const demoContent = `
    <p>
      ${t("blogIntroductoryText")}
    </p>
    <h2>${t("blogSection1")}</h2>
    <p>
      ${t("blogSection1Content")}
    </p>
    <p>
      ${t("blogSection1Content2")}
    </p>
    <h2>${t("blogSection2")}</h2>
    <p>
      ${t("blogSection2Content")}
    </p>
    <ul>
      <li>${t("blogListItem1")}</li>
      <li>${t("blogListItem2")}</li>
      <li>${t("blogListItem3")}</li>
    </ul>
    <p>
      ${t("blogConclusion")}
    </p>
  `

  // Gunakan konten dari API jika tersedia, atau gunakan konten demo
  const contentToDisplay = blogPost.konten || demoContent

  return (
    <div className="container mx-auto px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <Link href="/blog" className="inline-flex items-center text-primary hover:text-primary/80 hover:underline transition-colors mb-6 group">
          <div className="mr-2 h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
            <ArrowLeft className="h-4 w-4 text-primary" />
          </div>
          <span className="font-medium">{t("backToBlog")}</span>
        </Link>

        <div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">{blogPost.judul}</h1>
          <div className="flex flex-wrap items-center text-muted-foreground text-sm gap-4 mb-6">
            <div className="flex items-center bg-accent/20 px-3 py-1 rounded-full">
              <Calendar className="h-3.5 w-3.5 mr-2 text-primary" />
              {formatDate(blogPost.createdAt)}
            </div>
            <div className="flex items-center bg-accent/20 px-3 py-1 rounded-full">
              <User className="h-3.5 w-3.5 mr-2 text-primary" />
              {t("adminAuthor")}
            </div>
            <div className="flex items-center">
              <Tag className="h-3.5 w-3.5 mr-2 text-primary" />
              <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">
                {blogPost.kategori}
              </Badge>
            </div>
          </div>
        </div>

        {(blogPost.featuredImage || blogPost.thumbnail) && (
          <div className="relative h-[400px] w-full rounded-xl overflow-hidden mb-8 shadow-lg border border-border">
            <Image
              src={blogPost.featuredImage || blogPost.thumbnail || "/placeholder.svg"}
              alt={blogPost.judul}
              fill
              className="object-cover transition-transform hover:scale-105 duration-700"
            />
          </div>
        )}

        <Card className="bg-card/60 border-border shadow-lg rounded-xl overflow-hidden">
          <CardContent className="p-8 prose prose-invert max-w-none prose-headings:text-primary prose-a:text-primary prose-img:rounded-lg prose-strong:text-primary/90">
            <div dangerouslySetInnerHTML={{ __html: contentToDisplay }} />
          </CardContent>
        </Card>

        <Separator className="my-10 bg-border" />

        <div className="space-y-8">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold">{t("relatedArticles")}</h3>
            <Link href="/blog">
              <Button variant="outline" className="border-border hover:bg-accent">
                {t("viewAllArticles")}
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Placeholder untuk artikel terkait - dalam aplikasi nyata, ini bisa menggunakan data dari API */}
            {[1, 2, 3].map((index) => (
              <Card
                key={index}
                className="bg-card/60 border-border overflow-hidden hover:border-primary/30 hover:shadow-md hover:shadow-primary/5 transition-all duration-300 group"
              >
                <div className="relative h-40 bg-muted overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center text-muted-foreground group-hover:scale-110 transition-transform duration-700">
                    {t("imagePlaceholder")}
                  </div>
                </div>
                <CardContent className="p-5">
                  <h4 className="font-medium mb-2 group-hover:text-primary transition-colors">{t("relatedArticleTitle")} {index}</h4>
                  <p className="text-muted-foreground text-sm">{formatDate(new Date().toISOString())}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

