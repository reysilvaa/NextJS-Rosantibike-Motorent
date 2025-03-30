// Blog Types
export interface BlogPost {
  id: string
  judul: string
  slug: string
  konten: string
  featuredImage?: string
  status: "draft" | "published"
  thumbnail?: string
  kategori: string
  tags?: string[]
  meta_description?: string
  createdAt: string
  updatedAt?: string
  
  // Tambahan field untuk tampilan detail blog
  author?: string
  tanggal_publikasi?: string
  reading_time?: number
  related_posts?: {
    judul: string
    slug: string
    thumbnail?: string
    tanggal_publikasi?: string
  }[]
} 