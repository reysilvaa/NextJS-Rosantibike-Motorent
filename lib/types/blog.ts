import { StatusArtikel } from './enums'
import { Admin } from './admin'

export interface BlogPost {
  id: string
  judul: string
  slug: string
  konten: string
  thumbnail: string | null
  featuredImage?: string | null
  kategori: string
  status: 'DRAFT' | 'TERBIT'
  createdAt: string
  updatedAt: string
  tags: BlogPostTag[]
  author?: Admin
}

export interface BlogTag {
  id: string
  nama: string
  createdAt: string
  updatedAt: string
}

export interface BlogPostTag {
  postId: string
  tagId: string
  createdAt: string
  tag: BlogTag
}

export interface Category {
  id: string
  name: string
  slug: string
} 