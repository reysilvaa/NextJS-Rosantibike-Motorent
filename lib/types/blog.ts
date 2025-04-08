import { StatusArtikel } from './enums'

export interface BlogPost {
  id: string
  judul: string
  slug: string
  konten: string
  thumbnail: string | null
  kategori: string
  status: StatusArtikel
  tags: BlogPostTag[]
  createdAt: string
  updatedAt: string
}

export interface BlogTag {
  id: string
  nama: string
  createdAt: string
  updatedAt: string
  posts: BlogPostTag[]
}

export interface BlogPostTag {
  postId: string
  tagId: string
  createdAt: string
  post: BlogPost
  tag: BlogTag
} 