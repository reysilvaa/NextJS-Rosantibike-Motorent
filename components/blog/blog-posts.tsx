"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useBlogPosts } from "@/hooks/use-blog";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate } from "@/lib/utils";
import { Calendar, Search, Tag } from "lucide-react";
import { useTranslation } from "@/i18n/hooks";

export function BlogPosts() {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const { data: posts, isLoading, meta } = useBlogPosts(currentPage, 6, search);

  // Fungsi untuk handle pencarian
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Reset ke halaman pertama saat pencarian baru
    setCurrentPage(1);
  };

  return (
    <div className="space-y-8">
      {/* Search dan Filter */}
      <div className="mb-8">
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
            <Input
              type="search"
              placeholder={t("searchArticles")}
              className="pl-10 bg-gray-950/50 border-gray-800"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Button type="submit">{t("search")}</Button>
        </form>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((index) => (
            <Card key={index} className="bg-gray-900/50 border-gray-800 overflow-hidden">
              <div className="h-48 relative">
                <Skeleton className="h-full w-full rounded-none" />
              </div>
              <CardContent className="p-5 space-y-4">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-4 w-2/3" />
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-16" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* No Results */}
      {!isLoading && posts.length === 0 && (
        <div className="text-center py-16">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <Tag className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-xl font-medium mb-2">{t("noArticlesFound")}</h3>
          <p className="text-gray-400 mb-6">{t("tryAnotherSearch")}</p>
          <Button onClick={() => setSearch("")}>{t("clearSearch")}</Button>
        </div>
      )}

      {/* Blog Posts Grid */}
      {!isLoading && posts.length > 0 && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="h-full"
              >
                <Card className="bg-gray-900/60 border-gray-800 overflow-hidden hover:border-primary/30 hover:bg-gray-900/80 transition-all h-full hover:shadow-md hover:shadow-primary/5 group">
                  <div className="h-48 relative bg-gray-800 overflow-hidden">
                    {(post.thumbnail || post.featuredImage) ? (
                      <Image
                        src={post.thumbnail || post.featuredImage || "/placeholder.svg"}
                        alt={post.judul}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-gray-600">
                        {t("noImage")}
                      </div>
                    )}
                  </div>
                  <CardContent className="p-5 space-y-3">
                    <Badge
                      variant="outline"
                      className="border-primary/30 text-primary bg-primary/5 hover:bg-primary/10"
                    >
                      {post.kategori}
                    </Badge>
                    <h3 className="font-semibold text-lg group-hover:text-primary transition-colors line-clamp-2">
                      {post.judul}
                    </h3>
                    {post.meta_description && (
                      <p className="text-gray-400 text-sm line-clamp-2">
                        {post.meta_description}
                      </p>
                    )}
                    <div className="flex items-center text-gray-500 text-sm pt-2">
                      <Calendar className="h-3.5 w-3.5 mr-1" />
                      <span>{formatDate(post.createdAt)}</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {/* Pagination */}
          {meta && meta.totalPages > 1 && (
            <div className="flex justify-center mt-10">
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                  className="border-gray-800 bg-gray-900/50"
                >
                  {t("previous")}
                </Button>
                <div className="flex items-center space-x-1">
                  {Array.from({ length: meta.totalPages }, (_, i) => i + 1).map((page) => (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      onClick={() => setCurrentPage(page)}
                      className={
                        currentPage === page
                          ? ""
                          : "border-gray-800 bg-gray-900/50"
                      }
                      size="sm"
                    >
                      {page}
                    </Button>
                  ))}
                </div>
                <Button
                  variant="outline"
                  disabled={currentPage === meta.totalPages}
                  onClick={() => setCurrentPage(currentPage + 1)}
                  className="border-gray-800 bg-gray-900/50"
                >
                  {t("next")}
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
} 