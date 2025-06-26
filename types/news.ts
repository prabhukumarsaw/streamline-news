export interface BackendArticle {
  section_id?: number;
  is_visible?: number;
  section_container_name?: string;
  section_renderer_code?: string;
  story_id?: number;
  author_id?: number;
  publication_date?: string;
  publication_time?: string;
  story_title?: string;
  story_body?: string;
  story_author?: number;
  category_id?: number;
  feature_image_id?: number;
  custom_url?: string;
  file_name?: string;
  media_type?: string;
  author_name?: string;
  category?: string;
  cat_in_english?: string;
  sequence?: number;
  ct_tag_name?: string;
}

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