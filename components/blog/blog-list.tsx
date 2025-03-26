"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { fetchBlogPosts } from "@/lib/api"
import type { BlogPost } from "@/lib/types"

export default function BlogList() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    const getBlogPosts = async () => {
      try {
        setIsLoading(true)
        const data = await fetchBlogPosts(currentPage, 6)
        setPosts(data)
        setTotalPages(3) // Hardcoded for now, would come from API response in real app
        setIsLoading(false)
      } catch (err) {
        setError("Failed to load blog posts")
        setIsLoading(false) 
        console.error(err)
      }
    }

    getBlogPosts()
  }, [currentPage])

  // Placeholder data for when API fails or during development
  const placeholderPosts = [
    {
      id: "1",
      judul: "Top 5 Motorcycle Routes in California",
      slug: "top-5-motorcycle-routes-california",
      konten: "Discover the most scenic and thrilling motorcycle routes that California has to offer. From coastal highways to mountain passes, these routes provide breathtaking views and exciting riding experiences for motorcyclists of all levels.",
      featuredImage: "/placeholder.svg?height=400&width=600",
      kategori: "Travel",
      createdAt: "2023-05-15T10:30:00Z",
    },
    {
      id: "2",
      judul: "Motorcycle Maintenance Tips for Beginners",
      slug: "motorcycle-maintenance-tips-beginners",
      konten: "Essential maintenance tips every motorcycle rider should know to keep their bike in top condition. Learn about regular checks, fluid changes, and simple repairs that can save you time and money while ensuring your safety on the road.",
      featuredImage: "/placeholder.svg?height=400&width=600",
      kategori: "Maintenance",
      createdAt: "2023-06-02T14:45:00Z",
    },
    {
      id: "3",
      judul: "Choosing the Right Motorcycle Gear",
      slug: "choosing-right-motorcycle-gear",
      konten: "A comprehensive guide to selecting the perfect gear for safety and comfort on your rides. From helmets and jackets to gloves and boots, we cover everything you need to know about protective equipment for motorcyclists.",
      featuredImage: "/placeholder.svg?height=400&width=600",
      kategori: "Gear",
      createdAt: "2023-06-20T09:15:00Z",
    },
    {
      id: "4",
      judul: "The Evolution of Motorcycle Design",
      slug: "evolution-motorcycle-design",
      konten: "Explore the fascinating history and evolution of motorcycle design from the early 20th century to modern times. Learn how technological advancements and cultural influences have shaped the motorcycles we ride today.",
      featuredImage: "/placeholder.svg?height=400&width=600",
      kategori: "History",
      createdAt: "2023-07-05T11:20:00Z",
    },
    {
      id: "5",
      judul: "Preparing for a Long-Distance Motorcycle Trip",
      slug: "preparing-long-distance-motorcycle-trip",
      konten: "Planning a long-distance motorcycle journey? This guide covers everything from route planning and packing essentials to bike preparation and safety considerations for extended rides.",
      featuredImage: "/placeholder.svg?height=400&width=600",
      kategori: "Travel",
      createdAt: "2023-07-18T08:30:00Z",
    },
    {
      id: "6",
      judul: "Understanding Motorcycle Engine Types",
      slug: "understanding-motorcycle-engine-types",
      konten: "A beginner-friendly explanation of different motorcycle engine types and configurations. Learn about inline, V-twin, boxer, and rotary engines, and understand the pros and cons of each design for different riding styles.",
      featuredImage: "/placeholder.svg?height=400&width=600",
      kategori: "Technical",
      createdAt: "2023-08-01T13:45:00Z",
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

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  return (
    <div className="space-y-8">
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="bg-gray-900/50 border-gray-800 overflow-hidden">
              <div className="h-48 bg-gray-800 animate-pulse" />
              <CardContent className="p-5">
                <div className="h-6 bg-gray-800 rounded animate-pulse mb-2" />
                <div className="h-4 bg-gray-800 rounded animate-pulse w-3/4 mb-4" />
                <div className="h-16 bg-gray-800 rounded animate-pulse" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-10">
          <p className="text-red-500 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {displayPosts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link href={`/blog/${post.slug}`}>
                  <Card className="bg-gray-900/50 border-gray-800 overflow-hidden hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/10 h-full">
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
                      <div className="flex items-center text-gray-400 text-sm mb-3">
                        <Calendar className="h-4 w-4 mr-1" />
                        {formatDate(post.createdAt)}
                      </div>
                      <h3 className="text-xl font-bold mb-2">{post.judul}</h3>
                      <p className="text-gray-300 line-clamp-3">{post.konten}</p>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>

          <div className="flex justify-center mt-8">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" onClick={handlePreviousPage} disabled={currentPage === 1}>
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only">Previous page</span>
              </Button>

              {[...Array(totalPages)].map((_, i) => (
                <Button
                  key={i}
                  variant={currentPage === i + 1 ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </Button>
              ))}

              <Button variant="outline" size="icon" onClick={handleNextPage} disabled={currentPage === totalPages}>
                <ChevronRight className="h-4 w-4" />
                <span className="sr-only">Next page</span>
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

