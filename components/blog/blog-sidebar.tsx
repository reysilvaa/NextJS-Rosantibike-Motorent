"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Search, Tag } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useTranslation } from "@/i18n/hooks"

export default function BlogSidebar() {
  const { t } = useTranslation()
  const [searchQuery, setSearchQuery] = useState("")

  const categories = [
    { name: t("travel"), count: 12 },
    { name: t("maintenance"), count: 8 },
    { name: t("gear"), count: 10 },
    { name: t("technical"), count: 6 },
    { name: t("history"), count: 4 },
    { name: t("events"), count: 5 },
  ]

  const tags = [
    t("adventure"),
    t("sportBikes"),
    t("cruisers"),
    t("maintenance"),
    t("safety"),
    t("gearReviews"),
    t("roadTrips"),
    t("motorcycleCulture"),
    t("beginnerTips"),
    t("customization"),
    t("vintage"),
    t("racing"),
  ]

  const recentPosts = [
    {
      id: "1",
      title: t("blogPost1Title"),
      slug: "essential-safety-tips-night-riding",
      date: t("blogPost1Date"),
    },
    {
      id: "2",
      title: t("blogPost2Title"),
      slug: "choose-perfect-motorcycle-helmet",
      date: t("blogPost2Date"),
    },
    {
      id: "3",
      title: t("blogPost3Title"),
      slug: "motorcycle-camping-beginners-guide",
      date: t("blogPost3Date"),
    },
    {
      id: "4",
      title: t("blogPost4Title"),
      slug: "understanding-motorcycle-insurance-options",
      date: t("blogPost4Date"),
    },
  ]

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this would redirect to search results
    console.log(t("searchingFor"), searchQuery)
  }

  return (
    <div className="space-y-6">
      <Card className="bg-card/50 border-border">
        <CardHeader>
          <CardTitle>{t("search")}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="flex gap-2">
            <Input
              placeholder={t("searchArticles")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-background/50 border-input"
            />
            <Button type="submit" size="icon">
              <Search className="h-4 w-4" />
              <span className="sr-only">{t("search")}</span>
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="bg-card/50 border-border">
        <CardHeader>
          <CardTitle>{t("category")}</CardTitle>
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

      <Card className="bg-card/50 border-border">
        <CardHeader>
          <CardTitle>{t("recentPosts")}</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-4">
            {recentPosts.map((post) => (
              <li key={post.id}>
                <Link href={`/blog/${post.slug}`} className="block hover:text-primary transition-colors">
                  <h4 className="font-medium line-clamp-2">{post.title}</h4>
                  <p className="text-sm text-muted-foreground mt-1">{post.date}</p>
                </Link>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card className="bg-card/50 border-border">
        <CardHeader>
          <CardTitle>{t("tags")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Link key={tag} href={`/blog/tag/${tag.toLowerCase()}`}>
                <Badge variant="secondary" className="bg-muted hover:bg-muted/80 cursor-pointer">
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

