import type { Metadata } from "next"
import BlogList from "@/components/blog/blog-list"
import BlogSidebar from "@/components/blog/blog-sidebar"

export const metadata: Metadata = {
  title: "Blog | MotoCruise",
  description: "Latest news, tips, and stories about motorcycles and riding adventures",
}

export default function BlogPage() {
  return (
    <div className="pt-20 pb-20">
      <div className="container mx-auto px-4">
        <div className="py-10">
          <h1 className="text-4xl font-bold mb-6">Blog</h1>
          <p className="text-gray-400 max-w-3xl">
            Stay updated with the latest motorcycle news, riding tips, and adventure stories from our blog.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-2/3">
            <BlogList />
          </div>
          <div className="lg:w-1/3">
            <BlogSidebar />
          </div>
        </div>
      </div>
    </div>
  )
}

