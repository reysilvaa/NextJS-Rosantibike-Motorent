"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Search, Tag } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function BlogSidebar() {
  const [searchQuery, setSearchQuery] = useState("")

  const categories = [
    { name: "Travel", count: 12 },
    { name: "Maintenance", count: 8 },
    { name: "Gear", count: 10 },
    { name: "Technical", count: 6 },
    { name: "History", count: 4 },
    { name: "Events", count: 5 },
  ]

  const tags = [
    "Adventure",
    "Sport Bikes",
    "Cruisers",
    "Maintenance",
    "Safety",
    "Gear Reviews",
    "Road Trips",
    "Motorcycle Culture",
    "Beginner Tips",
    "Customization",
    "Vintage",
    "Racing",
  ]

  const recentPosts = [
    {
      id: "1",
      title: "Essential Safety Tips for Night Riding",
      slug: "essential-safety-tips-night-riding",
      date: "August 15, 2023",
    },
    {
      id: "2",
      title: "How to Choose the Perfect Motorcycle Helmet",
      slug: "choose-perfect-motorcycle-helmet",
      date: "August 8, 2023",
    },
    {
      id: "3",
      title: "Motorcycle Camping: A Beginner's Guide",
      slug: "motorcycle-camping-beginners-guide",
      date: "July 29, 2023",
    },
    {
      id: "4",
      title: "Understanding Motorcycle Insurance Options",
      slug: "understanding-motorcycle-insurance-options",
      date: "July 22, 2023",
    },
  ]

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this would redirect to search results
    console.log("Searching for:", searchQuery)
  }

  return (
    <div className="space-y-6">
      <Card className="bg-gray-900/50 border-gray-800">
        <CardHeader>
          <CardTitle>Search</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="flex gap-2">
            <Input
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-gray-800/50 border-gray-700"
            />
            <Button type="submit" size="icon">
              <Search className="h-4 w-4" />
              <span className="sr-only">Search</span>
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="bg-gray-900/50 border-gray-800">
        <CardHeader>
          <CardTitle>Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {categories.map((category) => (
              <li key={category.name}>
                <Link
                  href={`/blog/category/${category.name.toLowerCase()}`}
                  className="flex justify-between items-center py-2 hover:text-primary transition-colors"
                >
                  <span>{category.name}</span>
                  <Badge variant="outline">{category.count}</Badge>
                </Link>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card className="bg-gray-900/50 border-gray-800">
        <CardHeader>
          <CardTitle>Recent Posts</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-4">
            {recentPosts.map((post) => (
              <li key={post.id}>
                <Link href={`/blog/${post.slug}`} className="block hover:text-primary transition-colors">
                  <h4 className="font-medium line-clamp-2">{post.title}</h4>
                  <p className="text-sm text-gray-400 mt-1">{post.date}</p>
                </Link>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card className="bg-gray-900/50 border-gray-800">
        <CardHeader>
          <CardTitle>Tags</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Link key={tag} href={`/blog/tag/${tag.toLowerCase()}`}>
                <Badge variant="secondary" className="bg-gray-800 hover:bg-gray-700 cursor-pointer">
                  <Tag className="h-3 w-3 mr-1" />
                  {tag}
                </Badge>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

