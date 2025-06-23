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

export interface Category {
  id: string;
  name: string;
  slug: string;
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