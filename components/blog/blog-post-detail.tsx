"use client"

import Link from "next/link"
import Image from "next/image"
import { format, parseISO } from "date-fns"
import { ArrowLeft, Calendar, Tag, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { BlogPost } from "@/lib/types"

interface BlogPostDetailProps {
  post: BlogPost
}

export default function BlogPostDetail({ post }: BlogPostDetailProps) {
  // Format tanggal
  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), "dd MMMM yyyy")
    } catch (err) {
      return "Tanggal tidak tersedia"
    }
  }

  // Hitung perkiraan waktu baca (1 menit per 183 kata)
  const calculateReadTime = (content: string | undefined) => {
    if (!content) return 1;
    const wordCount = content.trim().split(/\s+/).length
    const readTime = Math.ceil(wordCount / 183)
    return readTime > 0 ? readTime : 1
  }

  const readTime = calculateReadTime(post.konten)

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="max-w-4xl mx-auto">
        {/* Header dan navigasi */}
        <div className="mb-8">
          <Link href="/blog" className="inline-flex items-center text-primary hover:text-primary/80 transition-colors mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Kembali ke Blog
          </Link>
          
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{post.judul}</h1>
          
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 mb-6">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              {formatDate(post.createdAt)}
            </div>
            
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              {readTime} menit baca
            </div>
            
            {post.kategori && (
              <Badge className="bg-primary">{post.kategori}</Badge>
            )}
          </div>
        </div>
        
        {/* Featured image */}
        <div className="relative w-full h-[300px] md:h-[400px] mb-8 rounded-lg overflow-hidden">
          <Image
            src={post.featuredImage || post.thumbnail || "/placeholder.svg?height=600&width=1200"}
            alt={post.judul}
            fill
            priority
            className="object-cover"
          />
        </div>
        
        {/* Konten artikel */}
        <div className="prose prose-invert max-w-none prose-lg prose-headings:text-primary prose-a:text-primary">
          {post.konten ? (
            <div dangerouslySetInnerHTML={{ __html: post.konten }} />
          ) : (
            <p>Konten artikel tidak tersedia.</p>
          )}
        </div>
        
        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="mt-8 pt-6 border-t border-gray-800">
            <div className="flex items-center flex-wrap gap-2">
              <Tag className="h-4 w-4 text-gray-400" />
              {post.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-gray-300">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}
        
        {/* Navigasi bawah */}
        <div className="mt-12 pt-6 border-t border-gray-800">
          <Button asChild>
            <Link href="/blog">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Kembali ke Daftar Artikel
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}