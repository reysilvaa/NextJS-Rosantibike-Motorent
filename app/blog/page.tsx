import type { Metadata } from "next"
import BlogList from "@/components/blog/blog-list"
import BlogSidebar from "@/components/blog/blog-sidebar"

export const metadata: Metadata = {
  title: "Blog | MotoCruise",
  description: "Berita terbaru, tips, dan cerita tentang motor dan petualangan berkendara",
}

export default function BlogPage() {
  return (
    <div className="container mx-auto px-4 py-20">
      <div className="max-w-6xl mx-auto">
        <div className="mb-10">
          <h1 className="text-4xl font-bold mb-6">Blog</h1>
          <p className="text-gray-400 max-w-3xl">
            Tetap update dengan berita motor terbaru, tips berkendara, dan cerita petualangan dari blog kami.
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

