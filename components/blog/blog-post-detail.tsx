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
import { fetchBlogPostBySlug } from "@/lib/api"
import type { BlogPost } from "@/lib/types"
import { useTranslation } from "@/i18n/hooks"

interface BlogPostDetailProps {
  slug: string
}

export default function BlogPostDetail({ slug }: BlogPostDetailProps) {
  const { t, i18n } = useTranslation()
  const [blogPost, setBlogPost] = useState<BlogPost | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchBlogPostDetail = async () => {
      try {
        setIsLoading(true)
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
  }, [slug, t])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    // Format date based on current language
    return date.toLocaleDateString(i18n.language === "id" ? "id-ID" : "en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-3/4" />
        <div className="flex items-center space-x-4">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-36" />
        </div>
        <Skeleton className="h-[400px] w-full" />
        <div className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500 mb-4">{error}</p>
        <Button onClick={() => window.location.reload()}>{t("tryAgain")}</Button>
      </div>
    )
  }

  if (!blogPost) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-400 mb-4">{t("blogPostNotFound")}</p>
        <Link href="/blog">
          <Button>{t("backToBlog")}</Button>
        </Link>
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
    <div className="space-y-8">
      <Link href="/blog" className="inline-flex items-center text-primary hover:underline mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        {t("backToBlog")}
      </Link>

      <div>
        <h1 className="text-3xl md:text-4xl font-bold mb-4">{blogPost.judul}</h1>
        <div className="flex flex-wrap items-center text-gray-400 text-sm gap-4 mb-6">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-1" />
            {formatDate(blogPost.createdAt)}
          </div>
          <div className="flex items-center">
            <User className="h-4 w-4 mr-1" />
            {t("adminAuthor")}
          </div>
          <div className="flex items-center">
            <Tag className="h-4 w-4 mr-1" />
            <Badge variant="secondary">{blogPost.kategori}</Badge>
          </div>
        </div>
      </div>

      {blogPost.featuredImage && (
        <div className="relative h-[400px] w-full rounded-lg overflow-hidden mb-8">
          <Image
            src={blogPost.featuredImage}
            alt={blogPost.judul}
            fill
            className="object-cover"
          />
        </div>
      )}

      <Card className="bg-gray-900/50 border-gray-800">
        <CardContent className="p-6 prose prose-invert max-w-none">
          <div dangerouslySetInnerHTML={{ __html: contentToDisplay }} />
        </CardContent>
      </Card>

      <Separator className="my-8" />

      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">{t("relatedArticles")}</h3>
        <Link href="/blog">
          <Button variant="outline">{t("viewAllArticles")}</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Placeholder untuk artikel terkait - dalam aplikasi nyata, ini bisa menggunakan data dari API */}
        {[1, 2, 3].map((index) => (
          <Card
            key={index}
            className="bg-gray-900/50 border-gray-800 overflow-hidden hover:border-primary/50 transition-all"
          >
            <div className="relative h-40 bg-gray-800">
              <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                {t("imagePlaceholder")}
              </div>
            </div>
            <CardContent className="p-4">
              <h4 className="font-medium mb-2">{t("relatedArticleTitle")} {index}</h4>
              <p className="text-gray-400 text-sm">{formatDate(new Date().toISOString())}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}