import { ReactNode } from "react";

export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image: string;
  categoryId: string;
  authorId: string;
  publishedAt: string;
  trending: boolean;
  featured: boolean;
  tags: string[];
  readTime: number;
  views: number;
}


export interface Author {
  id: string;
  name: string;
  bio: string;
  avatar: string;
  social: {
    twitter?: string;
    linkedin?: string;
    email?: string;
  };
}

export interface Comment {
  id: string;
  articleId: string;
  authorName: string;
  authorEmail: string;
  content: string;
  createdAt: string;
  parentId?: string;
}

export interface NewsletterSubscription {
  email: string;
  subscribedAt: string;
  categories: string[];
}

export interface Category {
  id: number
  category: string 
  cat_in_english: string
  serial: number
  created_date: string
  renderer_code: string
}

export interface CategoryResponse {
  status: boolean
  data: Category[]
}

export interface NavItem {
  name: string
  href: string
  icon?: React.ReactNode
  description?: string
  badge?: string
  items?: SubNavItem[]
  featured?: {
    title: string
    description: string
    href: string
  }
}

export interface SubNavItem {
  name: string
  href: string
  description: string
  badge?: string
}

export interface BreakingNewsItem {
  id: number
  title: string
  href: string
  time: Date
  isUrgent?: boolean
}
