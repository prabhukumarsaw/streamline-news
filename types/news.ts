export interface Article {
    id: string;
    title: string;
    slug: string;
    excerpt: string | null;
    contentBody: string | null;
    contentType: "article" | "breaking_news" | "feature" | "opinion" | "photo_gallery" | "video" | null;
    status: "draft" | "review" | "approved" | "published" | "archived" | "rejected";
    featuredImageId?: string | null;
    authorId: string | null;
    editorId?: string | null;
    categoryId: number | null;
    viewCount: number;
    likeCount: number;
    commentCount: number;
    shareCount: number;
    readingTime: number;
    isFeatured: boolean;
    isBreaking: boolean;
    isPremium: boolean;
    scheduledAt?: string | null;
    publishedAt: string | null;
    expiresAt?: string | null;
    metaTitle?: string | null;
    metaDescription?: string | null;
    metaKeywords?: string | null;
    canonicalUrl?: string | null;
    customFields?: Record<string, any> | null;
    seoScore?: number;
    createdAt: string | null;
    updatedAt: string | null;
  };

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
  id: number;
  category: string;
  cat_in_english: string;
  serial: number;
  created_date: string;
  renderer_code: string;
}

export interface CategoryResponse {
  status: boolean;
  data: Category[];
}

export interface NavItem {
  name: string;
  href: string;
  icon?: React.ReactNode;
  description?: string;
  badge?: string;
  items?: SubNavItem[];
  featured?: {
    title: string;
    description: string;
    href: string;
  };
}

export interface SubNavItem {
  name: string;
  href: string;
  description: string;
  badge?: string;
}

export interface BreakingNewsItem {
  id: number;
  title: string;
  href: string;
  time: Date;
  isUrgent?: boolean;
}

export interface Tag {
  id: number;
  tag_name: string;
  media_id: number;
  created_date: string;
  file_name: string;
  media_upload_date: string;
}

export interface NewsResponse<T = any> {
  status: boolean;
  message: string;
  data: T;
  meta_data?: {
    apiId: string;
    version: string;
    responsetime: number;
    epoch: string;
    action: string;
    deviceId: string | null;
  };
}

export interface PaginatedNewsResponse<T = any> extends NewsResponse<{
  current_page: number;
  data: T[];
  last_page: number;
  total: number;
  per_page: number;
}> {}

export interface NewsListParams {
  page?: number;
  per_page?: number;
  category_id?: string | number;
  search?: string;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
  trending?: boolean;
}

export const createSafeArticle = (article: Partial<Article>): Article => ({
  id: article.id || 'unknown',
  title: article.title || 'Untitled Article',
  slug: article.slug || 'untitled',
  excerpt: article.excerpt || null,
  contentBody: article.contentBody || null,
  contentType: article.contentType || null,
  status: article.status || 'draft',
  featuredImageId: article.featuredImageId || null,
  authorId: article.authorId || null,
  editorId: article.editorId || null,
  categoryId: article.categoryId || null,
  viewCount: article.viewCount || 0,
  likeCount: article.likeCount || 0,
  commentCount: article.commentCount || 0,
  shareCount: article.shareCount || 0,
  readingTime: article.readingTime || 1,
  isFeatured: article.isFeatured || false,
  isBreaking: article.isBreaking || false,
  isPremium: article.isPremium || false,
  scheduledAt: article.scheduledAt || null,
  publishedAt: article.publishedAt || new Date().toISOString(),
  expiresAt: article.expiresAt || null,
  metaTitle: article.metaTitle || null,
  metaDescription: article.metaDescription || null,
  metaKeywords: article.metaKeywords || null,
  canonicalUrl: article.canonicalUrl || null,
  customFields: article.customFields || null,
  seoScore: article.seoScore || undefined,
  createdAt: article.createdAt || null,
  updatedAt: article.updatedAt || null,
});